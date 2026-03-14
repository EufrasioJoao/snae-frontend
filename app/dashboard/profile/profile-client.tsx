"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Shield, School } from "lucide-react";

import ProfileHeader from "./_components/ProfileHeader";
import ProfileInfo from "./_components/ProfileInfo";
import EditProfileForm from "./_components/EditProfileForm";
import ChangePasswordForm from "./_components/ChangePasswordForm";
import ProfileStats from "./_components/ProfileStats";

import { UserProfile, UpdateProfileData, ChangePasswordData } from "./_types/profile.types";
import api from "@/lib/api-requests";

export default function ProfileClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Carregar perfil do usuário
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.user.getProfile();
      
      if (response.success) {
        setProfile(response.user);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar perfil do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    if (!profile) return;

    try {
      setUpdating(true);
      const response = await api.user.updateProfile(data);
      
      if (response.success) {
        setProfile(response.user);
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao atualizar perfil";
      toast.error(message);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (data: ChangePasswordData) => {
    try {
      const response = await api.user.changePassword(data);
      
      if (response.success) {
        toast.success("Senha alterada com sucesso!");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao alterar senha";
      toast.error(message);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Erro ao carregar perfil do usuário</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Editar Perfil
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Segurança
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações do Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileInfo profile={profile} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Editar Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EditProfileForm
                    profile={profile}
                    onSubmit={handleUpdateProfile}
                    loading={updating}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Alterar Senha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm onSubmit={handleChangePassword} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar com Estatísticas */}
        <div className="space-y-6">
          <ProfileStats profile={profile} />
          
          {/* Informações da Escola/Instituição */}
          {(profile.perfilEstudante?.escola || profile.perfilProfessor?.escola || 
            profile.perfilEstudante?.escolaManual || profile.perfilProfessor?.instituicao) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="w-5 h-5" />
                  {profile.role === "ESTUDANTE" ? "Escola" : "Instituição"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.perfilEstudante?.escola && (
                  <div>
                    <p className="font-medium">{profile.perfilEstudante.escola.nome}</p>
                    <p className="text-sm text-gray-600">{profile.perfilEstudante.escola.cidade}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {profile.perfilEstudante.escola.tipo.replace("_", " ")}
                    </p>
                  </div>
                )}
                
                {profile.perfilEstudante?.escolaManual && (
                  <div>
                    <p className="font-medium">{profile.perfilEstudante.escolaManual}</p>
                    <p className="text-xs text-gray-500">Escola não cadastrada no sistema</p>
                  </div>
                )}
                
                {profile.perfilProfessor?.escola && (
                  <div>
                    <p className="font-medium">{profile.perfilProfessor.escola.nome}</p>
                    <p className="text-sm text-gray-600">{profile.perfilProfessor.escola.cidade}</p>
                  </div>
                )}
                
                {profile.perfilProfessor?.instituicao && (
                  <div>
                    <p className="font-medium">{profile.perfilProfessor.instituicao}</p>
                    <p className="text-xs text-gray-500">Instituição não cadastrada no sistema</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}