"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api-requests";
import UsersHeader from "./_components/UsersHeader";
import UsersStats from "./_components/UsersStats";
import UsersFilters from "./_components/UsersFilters";
import UsersTable from "./_components/UsersTable";
import UserModal from "./_components/UserModal";
import DeleteUserModal from "./_components/DeleteUserModal";
import ViewUserModal from "./_components/ViewUserModal";
import { User, UserStats } from "./_types/user.types";

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    estudantes: 0,
    professores: 0,
    admins: 0,
    pendingOnboarding: 0,
    unverifiedEmails: 0,
    activeUsers: 0,
    verifiedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [userModal, setUserModal] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit",
    user: null as User | null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    user: null as User | null,
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    user: null as User | null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [searchTerm, roleFilter, statusFilter]);

  const fetchStats = async () => {
    try {
      const response = await api.user.getStats();
      
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Erro ao carregar estatísticas");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await api.user.getAll(params);
      
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUsers();
    fetchStats();
  };

  const handleCreateUser = () => {
    setUserModal({
      isOpen: true,
      mode: "create",
      user: null,
    });
  };

  const handleEditUser = (user: User) => {
    setUserModal({
      isOpen: true,
      mode: "edit",
      user,
    });
  };

  const handleDeleteUser = (user: User) => {
    setDeleteModal({
      isOpen: true,
      user,
    });
  };

  const handleViewUser = (user: User) => {
    setViewModal({
      isOpen: true,
      user,
    });
  };

  const handleSaveUser = async (userData: any) => {
    try {
      setActionLoading(true);
      
      if (userModal.mode === "create") {
        const response = await api.user.create(userData);
        if (response.success) {
          toast.success("Utilizador criado com sucesso!");
          handleRefresh();
        } else {
          toast.error(response.error || "Erro ao criar utilizador");
        }
      } else {
        const response = await api.user.update(userModal.user!.id, userData);
        if (response.success) {
          toast.success("Utilizador atualizado com sucesso!");
          handleRefresh();
        } else {
          toast.error(response.error || "Erro ao atualizar utilizador");
        }
      }
      
      setUserModal({ isOpen: false, mode: "create", user: null });
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast.error(error.response?.data?.error || "Erro ao salvar utilizador");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.user) return;
    
    try {
      setActionLoading(true);
      const response = await api.user.delete(deleteModal.user.id);
      
      if (response.success) {
        toast.success("Utilizador excluído com sucesso!");
        handleRefresh();
      } else {
        toast.error(response.error || "Erro ao excluir utilizador");
      }
      
      setDeleteModal({ isOpen: false, user: null });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.error || "Erro ao excluir utilizador");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UsersHeader 
        onCreateUser={handleCreateUser}
        onRefresh={handleRefresh}
      />
      
      <UsersStats stats={stats} />
      
      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      
      <UsersTable 
        users={users}
        loading={loading}
        onRefresh={handleRefresh}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
      />

      {/* Modals */}
      <UserModal
        isOpen={userModal.isOpen}
        onClose={() => setUserModal({ isOpen: false, mode: "create", user: null })}
        onSave={handleSaveUser}
        user={userModal.user}
        mode={userModal.mode}
      />

      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleConfirmDelete}
        user={deleteModal.user}
        isLoading={actionLoading}
      />

      <ViewUserModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, user: null })}
        user={viewModal.user}
      />
    </div>
  );
}