import React, { useState } from 'react';
import { Database, Check, X, Key, ExternalLink, HelpCircle } from 'lucide-react';
import { initCustomSupabase } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConnected
}) => {
  const [url, setUrl] = useState(localStorage.getItem('app_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('app_supabase_key') || '');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!url.trim() || !key.trim()) {
      setStatusMsg('Vui lòng nhập đầy đủ Supabase URL và Anon Key');
      return;
    }

    try {
      initCustomSupabase(url.trim(), key.trim());
      setStatusMsg('Đã kết nối Supabase Cloud thành công!');
      onConnected();
      setTimeout(() => {
        onClose();
        setStatusMsg('');
      }, 1500);
    } catch (e) {
      console.error(e);
      setStatusMsg('Lỗi cấu hình kết nối Supabase');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Cấu Hình Kết Nối Supabase Cloud</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Nhập thông tin dự án Supabase của bạn để bật đồng bộ dữ liệu Realtime và lưu trữ trực tiếp trên đám mây PostgreSQL.
        </p>

        {statusMsg && (
          <div className="bg-slate-900 border border-amber-500/40 text-amber-300 p-3 rounded-lg text-xs font-medium">
            {statusMsg}
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Supabase Project URL</label>
            <input
              type="text"
              placeholder="https://xxxx.supabase.co"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Supabase Anon Key (API Key)</label>
            <textarea
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={e => setKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs"
            />
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-lg text-xs text-slate-400 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-amber-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hướng dẫn nhanh:</span>
          </div>
          <p>1. Đăng ký tài khoản miễn phí tại <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a>.</p>
          <p>2. Chạy file <code className="text-amber-300">supabase_schema.sql</code> trong Supabase SQL Editor.</p>
          <p>3. Dán URL và Anon Key thu được từ Project Settings {'>'} API vào đây.</p>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-semibold"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow"
          >
            Lưu Kết Nối
          </button>
        </div>

      </div>
    </div>
  );
};
