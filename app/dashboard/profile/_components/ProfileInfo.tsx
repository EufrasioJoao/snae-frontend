"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  GraduationCap, 
  School, 
  BookOpen,
  MapPin 
} from "lucide-react";
import { UserProfile } from "../_types/profile.types";

interface ProfileInfoProps {
  profile: UserProfile;
}

export default function ProfileInfo({ profile }: ProfileInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const InfoItem = ({ 
    icon: Icon, 
    label, 
    value, 
    badge 
  }: { 
    icon: any; 
    label: string; 
    value: string | React.ReactNode; 
    badge?: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 py-3">
      <Icon className="w-5 h-5 text-gray-500 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-900">{value}</span>
          {badge}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-1">
      {/* Informações Básicas */}
      <InfoItem
        icon={User}
        label="Nome Completo"
        value={profile.name}
      />

      <InfoItem
        icon={Mail}
        label="Email"
        value={profile.email}
        badge={
          profile.emailVerified ? (
            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
              Verificado
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              Não Verificado
            </Badge>
          )
        }
      />

      <InfoItem
        icon={GraduationCap}
        label="Tipo de Conta"
        value={
          profile.role === "ADMIN" ? "Administrador" :
          profile.role === "PROFESSOR" ? "Professor" : "Estudante"
        }
        badge={
          <Badge variant={
            profile.role === "ADMIN" ? "destructive" :
            profile.role === "PROFESSOR" ? "default" : "secondary"
          }>
            {profile.role}
          </Badge>
        }
      />

      <Separator className="my-4" />

      {/* Informações Específicas do Estudante */}
      {profile.perfilEstudante && (
        <>
          <h3 className="font-semibold text-gray-900 mb-3">Informações Acadêmicas</h3>
          
          <InfoItem
            icon={BookOpen}
            label="Nível de Ensino"
            value={
              profile.perfilEstudante.nivelEnsino === "ENSINO_PRIMARIO" 
                ? "Ensino Primário" 
                : "Ensino Secundário"
            }
          />

          <InfoItem
            icon={GraduationCap}
            label="Ano Escolar"
            value={`${profile.perfilEstudante.anoEscolar}ª classe`}
          />

          {profile.perfilEstudante.escola && (
            <InfoItem
              icon={School}
              label="Escola"
              value={
                <div>
                  <p className="font-medium">{profile.perfilEstudante.escola.nome}</p>
                  {profile.perfilEstudante.escola.cidade && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {profile.perfilEstudante.escola.cidade}
                    </p>
                  )}
                </div>
              }
              badge={
                <Badge variant="outline" className="text-xs">
                  {profile.perfilEstudante.escola.tipo.replace("_", " ")}
                </Badge>
              }
            />
          )}

          {profile.perfilEstudante.escolaManual && (
            <InfoItem
              icon={School}
              label="Escola"
              value={profile.perfilEstudante.escolaManual}
              badge={
                <Badge variant="secondary" className="text-xs">
                  Não cadastrada
                </Badge>
              }
            />
          )}

          <Separator className="my-4" />
        </>
      )}

      {/* Informações Específicas do Professor */}
      {profile.perfilProfessor && (
        <>
          <h3 className="font-semibold text-gray-900 mb-3">Informações Profissionais</h3>
          
          <InfoItem
            icon={BookOpen}
            label="Especialidade"
            value={profile.perfilProfessor.especialidade}
          />

          {profile.perfilProfessor.disciplinas && profile.perfilProfessor.disciplinas.length > 0 && (
            <InfoItem
              icon={GraduationCap}
              label="Disciplinas"
              value={
                <div className="flex flex-wrap gap-1">
                  {profile.perfilProfessor.disciplinas.map((disc) => (
                    <Badge key={disc.id} variant="outline" className="text-xs">
                      {disc.disciplina.nome}
                    </Badge>
                  ))}
                </div>
              }
            />
          )}

          {profile.perfilProfessor.escola && (
            <InfoItem
              icon={School}
              label="Escola"
              value={
                <div>
                  <p className="font-medium">{profile.perfilProfessor.escola.nome}</p>
                  {profile.perfilProfessor.escola.cidade && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {profile.perfilProfessor.escola.cidade}
                    </p>
                  )}
                </div>
              }
            />
          )}

          {profile.perfilProfessor.instituicao && (
            <InfoItem
              icon={School}
              label="Instituição"
              value={profile.perfilProfessor.instituicao}
              badge={
                <Badge variant="secondary" className="text-xs">
                  Não cadastrada
                </Badge>
              }
            />
          )}

          <Separator className="my-4" />
        </>
      )}

      {/* Informações do Sistema */}
      <h3 className="font-semibold text-gray-900 mb-3">Informações do Sistema</h3>
      
      <InfoItem
        icon={Calendar}
        label="Conta criada em"
        value={formatDate(profile.createdAt)}
      />

      <InfoItem
        icon={Calendar}
        label="Última atualização"
        value={formatDate(profile.updatedAt)}
      />

      <InfoItem
        icon={User}
        label="Status do Perfil"
        value={profile.finishedOnboarding ? "Completo" : "Incompleto"}
        badge={
          <Badge variant={profile.finishedOnboarding ? "default" : "secondary"}>
            {profile.finishedOnboarding ? "✓ Completo" : "⚠ Incompleto"}
          </Badge>
        }
      />
    </div>
  );
}