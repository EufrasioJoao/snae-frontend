"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { ChangePasswordData } from "../_types/profile.types";

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordData) => Promise<void>;
}

export default function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Senha atual é obrigatória";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Nova senha é obrigatória";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Nova senha deve ter pelo menos 8 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "A nova senha deve ser diferente da atual";
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
      
      // Limpar formulário após sucesso
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ChangePasswordData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Fraca";
    if (strength <= 3) return "Média";
    if (strength <= 4) return "Boa";
    return "Forte";
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="space-y-6">
      {/* Aviso de Segurança */}
      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          Por segurança, você precisará fazer login novamente após alterar sua senha.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Senha Atual */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Senha Atual *</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              placeholder="Digite sua senha atual"
              className={errors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        {/* Nova Senha */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova Senha *</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              placeholder="Digite sua nova senha"
              className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Indicador de Força da Senha */}
          {formData.newPassword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getStrengthColor(passwordStrength)}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.
              </div>
            </div>
          )}
          
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirmar Nova Senha */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="Confirme sua nova senha"
              className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Botão de Alterar Senha */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="min-w-32"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Lock className="w-4 h-4 mr-2" />
            Alterar Senha
          </Button>
        </div>
      </form>
    </div>
  );
}