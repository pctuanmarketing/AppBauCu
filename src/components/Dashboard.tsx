import React from 'react';
import { Council, CouncilId, VoteRecord, VotingUnit } from '../types';
import { Users, FileCheck, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Award, TrendingUp, Vote } from 'lucide-react';

interface DashboardProps {
  unit: VotingUnit;
  councils: Council[];
  voteRecords: Record<string, { record: VoteRecord }>;
  onSelectCouncil: (id: CouncilId) => void;
  onNavigateToCounting: (id: CouncilId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  unit,
  councils,
  voteRecords,
  onSelectCouncil,
  onNavigateToCounting
}) => {
  const currentRecord = voteRecords[councils[0]?.id]?.record;
  const totalVoters = unit.totalVoters || 1;
  const votersVoted = currentRecord ? currentRecord.votersVoted : 0;
  const votedPercent = ((votersVoted / totalVoters) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Banner / Header Unit Info */}
      <div className="bg-gradient-to-r from-red-900/40 via-slate-800 to-slate-900 border border-red-800/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-red-500 pointer-events-none">
          <Vote className="w-80 h-80" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ĐƠN VỊ BẦU CỬ CHÍNH THỨC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {unit.unitName} – {unit.votingArea}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Địa bàn: <span className="font-semibold text-amber-200">{unit.commune}</span> - {unit.district} - {unit.province}
            </p>
          </div>

          <div className="flex items-center bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 rounded-xl px-5 py-3.5 shadow-md">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Tiến độ cử tri đi bầu</span>
              <span className="text-2xl font-black text-amber-400">{votedPercent}%</span>
            </div>
            <div className="ml-4 w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Cử tri đã tham gia bỏ phiếu: <strong>{votersVoted.toLocaleString('vi-VN')}</strong> / {totalVoters.toLocaleString('vi-VN')}</span>
            <span>Tỷ lệ hoàn thành: {votedPercent}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-500 shadow"
              style={{ width: `${Math.min(100, Math.max(0, Number(votedPercent)))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of 4 Election Councils */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Danh Sách Các Cấp Bầu Cử & Tiến Độ Kiểm Phiếu</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {councils.map((council) => {
            const rec = voteRecords[council.id]?.record;
            const valid = rec ? rec.validBallots : 0;
            const invalid = rec ? rec.invalidBallots : 0;
            const status = rec ? rec.status : 'draft';

            return (
              <div
                key={council.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 hover:border-red-500/50 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 text-xs font-bold bg-slate-700 text-amber-300 rounded border border-slate-600">
                      {council.shortName}
                    </span>
                    {status === 'completed' ? (
                      <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Đã kiểm
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-medium text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Chờ kiểm
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-3 line-clamp-2">
                    {council.name}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-300 border-t border-slate-700/60 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phiếu thu vào:</span>
                      <span className="font-semibold">{rec?.ballotsCollected || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phiếu hợp lệ:</span>
                      <span className="font-semibold text-emerald-400">{valid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phiếu không hợp lệ:</span>
                      <span className="font-semibold text-red-400">{invalid}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToCounting(council.id)}
                  className="mt-4 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold transition-all"
                >
                  <span>Mở bảng kiểm phiếu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quy tắc đối soát tự động */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Hệ Thống Tự Động Kiểm Tra Quy Tắc Nghiệm Thu Kiểm Phiếu</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-300 block mb-1">1. Ràng buộc Tổng số phiếu</span>
            <p className="text-slate-400">Số phiếu thu vào = Số phiếu hợp lệ + Số phiếu không hợp lệ.</p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-300 block mb-1">2. Ràng buộc Cử tri</span>
            <p className="text-slate-400">Số phiếu phát ra $\le$ Tổng số cử tri trong danh sách khu vực bỏ phiếu.</p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-300 block mb-1">3. Ràng buộc Phiếu Bầu</span>
            <p className="text-slate-400">Số phiếu bầu (Đồng ý) của từng ứng cử viên $\le$ Tổng số phiếu hợp lệ.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
