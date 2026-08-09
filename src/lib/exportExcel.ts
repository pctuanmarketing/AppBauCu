import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Candidate, Council, VoteRecord, VotingUnit, CandidateVote } from '../types';

export const exportExcelReport = (
  councils: Council[],
  unit: VotingUnit,
  voteRecords: Record<string, { record: VoteRecord; candidateVotes: CandidateVote[]; candidates: Candidate[] }>
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Tổng hợp cử tri & Phiếu phát ra/thu vào
  const summaryData = [
    ['BẢNG TỔNG HỢP KẾT QUẢ KIỂM PHIẾU BẦU CỬ 2026 - 2031'],
    [`Khu vực bỏ phiếu: ${unit.votingArea}`],
    [`Địa bàn: ${unit.commune} - ${unit.district} - ${unit.province}`],
    [],
    ['STT', 'Cấp bầu cử', 'Tổng cử tri', 'Cử tri đi bầu', 'Tỷ lệ đi bầu (%)', 'Phiếu phát ra', 'Phiếu thu vào', 'Phiếu hợp lệ', 'Phiếu không hợp lệ', 'Trạng thái'],
    ...councils.map((c, idx) => {
      const data = voteRecords[c.id];
      const r = data ? data.record : null;
      const totalVoters = r ? r.totalVoters : unit.totalVoters;
      const votersVoted = r ? r.votersVoted : 0;
      const percent = totalVoters > 0 ? ((votersVoted / totalVoters) * 100).toFixed(2) + '%' : '0%';
      return [
        idx + 1,
        c.name,
        totalVoters,
        votersVoted,
        percent,
        r ? r.ballotsIssued : 0,
        r ? r.ballotsCollected : 0,
        r ? r.validBallots : 0,
        r ? r.invalidBallots : 0,
        r?.status === 'completed' ? 'Đã hoàn thành' : 'Đang kiểm'
      ];
    })
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'TongHopChung');

  // Sheet 2: Chi tiết Ứng cử viên & Phiếu bầu
  councils.forEach(c => {
    const data = voteRecords[c.id];
    if (!data) return;
    const { record, candidateVotes, candidates } = data;

    const detailData = [
      [`KẾT QUẢ PHIẾU BẦU CHITIẾT - ${c.name.toUpperCase()}`],
      [`Khu vực bỏ phiếu: ${unit.votingArea}`],
      [`Tổng số phiếu hợp lệ: ${record.validBallots}`],
      [],
      ['STT', 'Họ và tên Ứng cử viên', 'Năm sinh', 'Chức vụ / Đơn vị công tác', 'Số phiếu bầu (Đồng ý)', 'Số phiếu gạch (Không bầu)', 'Tỷ lệ %', 'Kết quả trúng cử'],
      ...candidates.map((cand, idx) => {
        const v = candidateVotes.find(vote => vote.candidateId === cand.id);
        const voteCount = v ? v.voteCount : 0;
        const againstCount = v ? v.againstCount : 0;
        const percent = record.validBallots > 0 ? ((voteCount / record.validBallots) * 100).toFixed(2) + '%' : '0%';
        const isElected = v?.isElected ? 'Trúng cử' : 'Không trúng cử';

        return [
          idx + 1,
          cand.fullName,
          cand.birthYear || '',
          cand.currentPosition || '',
          voteCount,
          againstCount,
          percent,
          isElected
        ];
      })
    ];

    const wsDetail = XLSX.utils.aoa_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, wsDetail, c.shortName.replace(/[^a-zA-Z0-9]/g, '_'));
  });

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `KetQuaKiemPhieu_BauCu2026_${unit.unitName.replace(/\s+/g, '_')}.xlsx`);
};
