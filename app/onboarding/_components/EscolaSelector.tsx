"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Building2, X } from "lucide-react";
import apiRequests from "@/lib/api-requests";

interface Provincia {
  id: string;
  nome: string;
}

interface Distrito {
  id: string;
  nome: string;
}

interface Escola {
  id: string;
  nome: string;
  tipo: string;
  cidade?: string;
  bairro?: string;
  provincia: { nome: string };
  distrito?: { nome: string };
}

interface EscolaSelectorProps {
  value?: string;
  manualValue?: string;
  onChange: (escolaId?: string, escolaManual?: string) => void;
  tipoEscola?: "PRIMARIA" | "SECUNDARIA" | "PRIMARIA_SECUNDARIA";
  disabled?: boolean;
}

export default function EscolaSelector({ value, manualValue, onChange, tipoEscola, disabled = false }: EscolaSelectorProps) {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [selectedEscola, setSelectedEscola] = useState<Escola | null>(null);
  const [localManualValue, setLocalManualValue] = useState(manualValue || "");

  // Sincronizar valor manual local com prop
  useEffect(() => {
    setLocalManualValue(manualValue || "");
  }, [manualValue]);

  // Carregar províncias
  useEffect(() => {
    fetchProvincias();
  }, []);

  // Carregar distritos quando província muda
  useEffect(() => {
    if (selectedProvincia) {
      fetchDistritos(selectedProvincia);
    } else {
      setDistritos([]);
      setSelectedDistrito("");
    }
  }, [selectedProvincia]);

  // Buscar escolas quando filtros mudam
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || selectedProvincia) {
        fetchEscolas();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedProvincia, selectedDistrito, tipoEscola]);

  const fetchProvincias = async () => {
    try {
      const data = await apiRequests.escola.getProvincias();
      
      if (data && data.success && data.provincias) {
        setProvincias(data.provincias);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error: any) {
      console.error("Error fetching provincias:", error);
    }
  };

  const fetchDistritos = async (provinciaId: string) => {
    try {
      const data = await apiRequests.escola.getDistritos(provinciaId);
      if (data.success) {
        setDistritos(data.distritos);
      }
    } catch (error) {
      console.error("Error fetching distritos:", error);
    }
  };

  const fetchEscolas = async () => {
    setIsSearching(true);
    try {
      const data = await apiRequests.escola.search({
        search: searchTerm || undefined,
        provinciaId: selectedProvincia || undefined,
        distritoId: selectedDistrito || undefined,
        tipo: tipoEscola,
      });
      
      if (data.success) {
        setEscolas(data.escolas);
      }
    } catch (error) {
      console.error("Error fetching escolas:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectEscola = (escola: Escola) => {
    setSelectedEscola(escola);
    onChange(escola.id, undefined);
    setShowManualInput(false);
  };

  const handleManualInput = (value: string) => {
    setLocalManualValue(value);
    onChange(undefined, value);
    setSelectedEscola(null);
  };

  const clearSelection = () => {
    setSelectedEscola(null);
    setLocalManualValue("");
    onChange(undefined, undefined);
  };

  return (
    <div className="space-y-4">
      {/* Escola Selecionada */}
      {(selectedEscola || localManualValue) && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {selectedEscola ? selectedEscola.nome : localManualValue}
                </span>
              </div>
              {selectedEscola && (
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedEscola.provincia.nome}
                    {selectedEscola.distrito && ` - ${selectedEscola.distrito.nome}`}
                    {selectedEscola.bairro && ` - ${selectedEscola.bairro}`}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={clearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      {!selectedEscola && !localManualValue && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Província */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Província
              </label>
              <select
                value={selectedProvincia}
                onChange={(e) => setSelectedProvincia(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Todas as províncias</option>
                {provincias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Distrito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distrito
              </label>
              <select
                value={selectedDistrito}
                onChange={(e) => setSelectedDistrito(e.target.value)}
                disabled={!selectedProvincia || disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Todos os distritos</option>
                {distritos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Escola
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={disabled}
                placeholder="Digite o nome da escola..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Lista de Escolas */}
          {escolas.length > 0 && (
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {escolas.map((escola) => (
                <button
                  key={escola.id}
                  type="button"
                  onClick={() => handleSelectEscola(escola)}
                  disabled={disabled}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">{escola.nome}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {escola.provincia.nome}
                    {escola.distrito && ` - ${escola.distrito.nome}`}
                    {escola.bairro && ` - ${escola.bairro}`}
                  </div>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="text-center py-4 text-gray-500">
              Buscando escolas...
            </div>
          )}

          {!isSearching && escolas.length === 0 && (searchTerm || selectedProvincia) && (
            <div className="text-center py-4 text-gray-500">
              Nenhuma escola encontrada
            </div>
          )}

          {/* Input Manual */}
          <div className="pt-4 border-t border-gray-200">
            {!showManualInput ? (
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                disabled={disabled}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Minha escola não está na lista
              </button>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digite o nome da sua escola
                </label>
                <input
                  type="text"
                  value={localManualValue}
                  onChange={(e) => handleManualInput(e.target.value)}
                  disabled={disabled}
                  placeholder="Nome da escola"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowManualInput(false);
                    setLocalManualValue("");
                    onChange(undefined, undefined);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700 mt-2"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
