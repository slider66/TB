
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import toast from 'react-hot-toast';
import { Loader2, RefreshCw, Save, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState({});

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('app_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data);
        } catch (error) {
            toast.error('Error al cargar usuarios: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user => user.user_id === userId ? { ...user, global_role: newRole } : user));
    };

    const handleSaveRole = async (userId) => {
        const user = users.find(u => u.user_id === userId);
        if (!user) return;

        setSaving(prev => ({...prev, [userId]: true}));
        try {
            const { error } = await supabase
                .from('app_users')
                .update({ global_role: user.global_role })
                .eq('user_id', userId);

            if (error) throw error;
            toast.success(`Rol de ${user.email} actualizado.`);
        } catch (error) {
            toast.error('No se pudo actualizar el rol: ' + error.message);
            fetchUsers(); // Revert changes on error
        } finally {
            setSaving(prev => ({...prev, [userId]: false}));
        }
    };
    
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Gestión de Usuarios</CardTitle>
                <div className="flex justify-between items-center mt-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Buscar por email o nombre..."
                            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => fetchUsers()} variant="outline" disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-orange" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-100">
                                <tr>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4">Rol</th>
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.user_id} className="border-b">
                                        <td className="p-4 font-medium">{user.email}</td>
                                        <td className="p-4">{user.full_name || 'N/A'}</td>
                                        <td className="p-4">
                                            <Select
                                                value={user.global_role}
                                                onValueChange={(value) => handleRoleChange(user.user_id, value)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Seleccionar rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="client">Cliente</SelectItem>
                                                    <SelectItem value="partner_admin">Partner Admin</SelectItem>
                                                    <SelectItem value="reviewer">Revisor</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4">
                                            <Button size="sm" onClick={() => handleSaveRole(user.user_id)} disabled={saving[user.user_id]}>
                                                {saving[user.user_id] ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UserManagement;
