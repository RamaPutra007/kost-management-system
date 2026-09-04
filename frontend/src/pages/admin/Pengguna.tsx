import React, { useState } from 'react';
import { Users, Search, Plus, MoreVertical, Edit2, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { UserFormModal } from './Pengguna/UserFormModal';
import { ResetPasswordModal } from './Pengguna/ResetPasswordModal';

export function Pengguna() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (selectedUser) {
        return api.put(`/users/${selectedUser.id}`, data);
      }
      return api.post('/users', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsFormOpen(false);
      setSelectedUser(null);
    }
  });

  const resetMutation = useMutation({
    mutationFn: async (password: string) => {
      return api.put(`/users/${selectedUser.id}/reset-password`, { password });
    },
    onSuccess: () => {
      setIsResetOpen(false);
      setSelectedUser(null);
      alert('Password berhasil direset!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Gagal menghapus pengguna.');
    }
  });

  const filteredUsers = users.filter((user: any) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Manajemen Pengguna</h1>
          <p className="text-slate-500 mt-1">Kelola akses, peran, dan data akun sistem.</p>
        </div>
        <Button className="flex items-center space-x-2" onClick={() => {
          setSelectedUser(null);
          setIsFormOpen(true);
        }}>
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-xs">
            <Input 
              placeholder="Cari nama atau email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="h-10 bg-slate-50 border-slate-200"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
            <span>Total: {users.length} Pengguna</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peran (Role)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Bergabung</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                        user.role?.name === 'Owner' ? 'bg-purple-100 text-purple-700' :
                        user.role?.name === 'Admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'Aktif' ? 'success' : 'default'}>
                        {user.status || 'Aktif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500 font-medium">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Dropdown
                        align="right"
                        trigger={
                          <button className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        }
                        items={[
                          { 
                            label: 'Edit Profil', 
                            icon: <Edit2 className="w-4 h-4 mr-2" />, 
                            onClick: () => {
                              setSelectedUser(user);
                              setIsFormOpen(true);
                            } 
                          },
                          { 
                            label: 'Reset Password', 
                            icon: <Key className="w-4 h-4 mr-2" />, 
                            onClick: () => {
                              setSelectedUser(user);
                              setIsResetOpen(true);
                            } 
                          },
                          { 
                            label: 'Hapus Akses', 
                            icon: <Trash2 className="w-4 h-4 mr-2" />, 
                            danger: true, 
                            onClick: () => {
                              if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
                                deleteMutation.mutate(user.id);
                              }
                            } 
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-navy mb-1">Pengguna Tidak Ditemukan</h3>
                    <p className="text-slate-500">Ubah kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }} 
        onSubmit={(data) => saveMutation.mutate(data)} 
        initialData={selectedUser} 
        isSubmitting={saveMutation.isPending} 
      />

      <ResetPasswordModal 
        isOpen={isResetOpen} 
        onClose={() => {
          setIsResetOpen(false);
          setSelectedUser(null);
        }} 
        onSubmit={(password) => resetMutation.mutate(password)} 
        isSubmitting={resetMutation.isPending} 
      />
    </div>
  );
}
