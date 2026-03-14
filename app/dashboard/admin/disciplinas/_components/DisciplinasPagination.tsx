"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DisciplinasPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  loading?: boolean;
}

export default function DisciplinasPagination({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
}: DisciplinasPaginationProps) {
  const { page, limit, total, totalPages } = pagination;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      onPageChange(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    if (!loading) {
      onLimitChange(parseInt(newLimit));
    }
  };

  // Gerar números de páginas para mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas com ellipsis
      if (page <= 3) {
        // Início: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Fim: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Meio: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null; // Não mostrar paginação se houver apenas 1 página
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Informações da paginação */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{startItem}</span> a{" "}
          <span className="font-medium">{endItem}</span> de{" "}
          <span className="font-medium">{total}</span> disciplinas
        </p>

        {/* Seletor de itens por página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Itens por página:</span>
          <Select
            value={limit.toString()}
            onValueChange={handleLimitChange}
            disabled={loading}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center gap-2">
        {/* Primeira página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={!canGoPrevious || loading}
          title="Primeira página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Página anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={!canGoPrevious || loading}
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Números das páginas */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) => (
            <div key={index}>
              {pageNum === "..." ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum as number)}
                  disabled={loading}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Próxima página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={!canGoNext || loading}
          title="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={!canGoNext || loading}
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}