import React, { useState, useEffect } from 'react';
import { User, Role, UserStatus } from '../../types';
import { getUsers, approveUser, rejectUser, updateUserRole } from '../../lib/storage';
import { ShieldCheck, UserCheck, UserX, UserPlus, X, Award, CheckCircle, Clock, Lock, Shield } from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active'>('all');

  const loadUsers = () => {
    setUsersList(getUsers());
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = (userId: string, role: Role) => {
    try {
      approveUser(userId, role);
      loadUsers();
      alert(`Đã phê duyệt tài khoản thành công với quyền: ${role === 'admin' ? '👑 Admin' : role === 'editor' ? '✏️ Editor' : '👁️ Viewer'}`);
    } catch (e: any) {
      alert(e.message || 'Lỗi phê duyệt!');
    }
  };

  const handleReject = (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn TỪ CHỐI tài khoản này?')) {
      try {
        rejectUser(userId);
        loadUsers();
      } catch (e: any) {
        alert(e.message || 'Lỗi!');
      }
    }
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    try {
      updateUserRole(userId, newRole);
      loadUsers();
    } catch (e: any) {
      alert(e.message || 'Lỗi!');
    }
  };

  const filteredUsers = usersList.filter(u => {
    if (filterStatus === 'pending') return u.status === 'pending_approval';
    if (filterStatus === 'active') return u.status === 'active';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-2xl max-w-4xl w-full p-6 shadow-2xl font-sans text-xs text-slate-800 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-red-700" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 uppercase">
                QUẢN TRỊ TÀI KHOẢN & PHÊ DUYỆT THÀNH VIÊN
              </h2>
              <p className="text-xs text-slate-500">
                Phê duyệt đăng ký, cấp quyền 3 cấp (Admin, Editor, Viewer) | Admin: <strong className="text-red-700">{currentUser?.fullName}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({usersList.length})
            </button>

            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center space-x-1 ${
                filterStatus === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Chờ Admin duyệt ({usersList.filter(u => u.status === 'pending_approval').length})</span>
            </button>

            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center space-x-1 ${
                filterStatus === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Đã hoạt động ({usersList.filter(u => u.status === 'active').length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Tác giả: <strong>Phạm Công Tuân</strong> (0916 199 945)
          </div>
        </div>

        {/* Users Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-[55vh] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200 text-[11px] uppercase">
                <th className="p-3">Họ và tên / Username</th>
                <th className="p-3">Email & SĐT</th>
                <th className="p-3">Trạng thái Kích hoạt</th>
                <th className="p-3">Quyền hạn (Role)</th>
                <th className="p-3 text-right">Thao tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  
                  {/* Name & Username */}
                  <td className="p-3 font-semibold text-slate-900">
                    <div>{user.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">@{user.username}</div>
                  </td>

                  {/* Email & Phone */}
                  <td className="p-3 text-slate-600">
                    <div>{user.email}</div>
                    {user.phone && <div className="text-[10px] text-emerald-700 font-mono">{user.phone}</div>}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3">
                    {user.status === 'pending_approval' && (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Chờ Admin phê duyệt</span>
                      </span>
                    )}
                    {user.status === 'active' && (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Đã kích hoạt</span>
                      </span>
                    )}
                    {user.status === 'rejected' && (
                      <span className="px-2.5 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                        <UserX className="w-3 h-3" />
                        <span>Từ chối</span>
                      </span>
                    )}
                  </td>

                  {/* Role Selector */}
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value as Role)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                    >
                      <option value="admin">👑 Admin (Quản trị cao nhất)</option>
                      <option value="editor">✏️ Editor (Cán bộ Tổ bầu cử)</option>
                      <option value="viewer">👁️ Viewer (Quan sát viên - Chỉ đọc)</option>
                    </select>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3 text-right space-x-2">
                    {user.status === 'pending_approval' && (
                      <>
                        <button
                          onClick={() => handleApprove(user.id, 'editor')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs shadow-xs"
                        >
                          Duyệt (Editor)
                        </button>
                        <button
                          onClick={() => handleApprove(user.id, 'viewer')}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-xs shadow-xs"
                        >
                          Duyệt (Viewer)
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-xs"
                        >
                          Từ chối
                        </button>
                      </>
                    )}

                    {user.status === 'active' && (
                      <span className="text-[11px] text-emerald-700 font-bold">✓ Đã hoạt động</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className="text-[11px] text-slate-500">
            Hệ thống phân quyền 3 cấp (Admin, Editor, Viewer) | Bản quyền: <strong>Phạm Công Tuân</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs"
          >
            Đóng bảng
          </button>
        </div>

      </div>
    </div>
  );
};
