"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "../_types/user.types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  user?: User | null;
  mode: "create" | "edit";
}

export default function UserModal({ 
  isOpen, 
  onClose, 
  onSave, 
  user, 
  mode 
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    emailVerified: false,
  });

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "USER",
        emailVerified: false,
      });
    }
  }, [mode, user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Utilizador" : "Editar Utilizador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Digite o email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Conta</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Utilizador</SelectItem>
                <SelectItem value="ESTUDANTE">Estudante</SelectItem>
                <SelectItem value="PROFESSOR">Professor</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailVerified"
              checked={formData.emailVerified}
              onChange={(e) => handleChange("emailVerified", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="emailVerified">Email verificado</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "create" ? "Criar" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}