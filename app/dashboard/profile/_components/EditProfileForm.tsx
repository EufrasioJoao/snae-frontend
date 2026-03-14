"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { UserProfile, UpdateProfileData } from "../_types/profile.types";
import EscolaSelector from "@/app/onboarding/_components/EscolaSelector";

interface EditProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  loading?: boolean;
}

export default function EditProfileForm({ profile, onSubmit, loading = false }: EditProfileFormProps) {
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: profile.name,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Inicializar dados do formulário baseado no perfil
    const initialData: UpdateProfileData = {
      name: profile.name,
    };

    if (profile.perfilEstudante) {
      initialData.nivelEnsino = profile.perfilEstudante.nivelEnsino;
      initialData.anoEscolar = profile.perfilEstudante.anoEscolar;
      initialData.escolaId = profile.perfilEstudante.escola?.id;
      initialData.escolaManual = profile.perfilEstudante.escolaManual;
    }

    if (profile.perfilProfessor) {
      initialData.especialidade = profile.perfilProfessor.especialidade;
      initialData.instituicao = profile.perfilProfessor.instituicao;
    }

    setFormData(initialData);
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (profile.role === "ESTUDANTE") {
      if (!formData.nivelEnsino) {
        newErrors.nivelEnsino = "Nível de ensino é obrigatório";
      }
      if (!formData.anoEscolar || formData.anoEscolar < 1 || formData.anoEscolar > 12) {
        newErrors.anoEscolar = "Ano escolar deve estar entre 1 e 12";
      }
    }

    if (profile.role === "PROFESSOR") {
      if (!formData.especialidade?.trim()) {
        newErrors.especialidade = "Especialidade é obrigatória";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleEscolaChange = (escolaId: string | undefined, escolaManual: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      escolaId,
      escolaManual,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Seu nome completo"
          className={errors.name ? "border-red-500" : ""}
          disabled={loading || submitting}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Campos específicos para Estudante */}
      {profile.role === "ESTUDANTE" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nivelEnsino">Nível de Ensino *</Label>
              <Select
                value={formData.nivelEnsino}
                onValueChange={(value) => handleInputChange("nivelEnsino", value)}
                disabled={loading || submitting}
              >
                <SelectTrigger className={errors.nivelEnsino ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENSINO_PRIMARIO">Ensino Primário</SelectItem>
                  <SelectItem value="ENSINO_SECUNDARIO">Ensino Secundário</SelectItem>
                </SelectContent>
              </Select>
              {errors.nivelEnsino && (
                <p className="text-sm text-red-600">{errors.nivelEnsino}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="anoEscolar">Ano Escolar *</Label>
              <Select
                value={formData.anoEscolar?.toString()}
                onValueChange={(value) => handleInputChange("anoEscolar", parseInt(value))}
                disabled={loading || submitting}
              >
                <SelectTrigger className={errors.anoEscolar ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((ano) => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}ª classe
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.anoEscolar && (
                <p className="text-sm text-red-600">{errors.anoEscolar}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Escola</Label>
            <EscolaSelector
              value={formData.escolaId}
              manualValue={formData.escolaManual}
              onChange={handleEscolaChange}
            />
          </div>
        </>
      )}

      {/* Campos específicos para Professor */}
      {profile.role === "PROFESSOR" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade *</Label>
            <Input
              id="especialidade"
              value={formData.especialidade || ""}
              onChange={(e) => handleInputChange("especialidade", e.target.value)}
              placeholder="Sua área de especialização"
              className={errors.especialidade ? "border-red-500" : ""}
              disabled={loading || submitting}
            />
            {errors.especialidade && (
              <p className="text-sm text-red-600">{errors.especialidade}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instituicao">Instituição</Label>
            <Input
              id="instituicao"
              value={formData.instituicao || ""}
              onChange={(e) => handleInputChange("instituicao", e.target.value)}
              placeholder="Nome da sua instituição (opcional)"
              disabled={loading || submitting}
            />
          </div>
        </>
      )}

      {/* Botão de Salvar */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading || submitting}
          className="min-w-32"
        >
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}