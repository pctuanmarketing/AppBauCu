import * as XLSX from 'xlsx';
import { Candidate, ElectionLevelConfig, Voter } from '../types';

export function exportElectionResultsToExcel(
  config: ElectionLevelConfig,
  candidates: Candidate[],
  voters: Voter[],
  validBallotsCount: number,
  invalidBallotsCount: number
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet Kết quả kiểm phiếu
  const resultsData = [
    ['BÁO CÁO KẾT QUẢ KIỂM PHIẾU BẦU CỬ'],
    [`CẤP BẦU CỬ: ${config.levelName}`],
    [''],
    ['THÔNG TIN CHUNG'],
    ['Tổng số cử tri', config.totalVoters],
    ['Số phiếu nhận vào', config.ballotsReceived],
    ['Số phiếu phát ra', config.ballotsIssued],
    ['Số phiếu thu vào', config.ballotsReturned],
    ['Số phiếu hợp lệ', validBallotsCount],
    ['Số phiếu không hợp lệ', invalidBallotsCount],
    [''],
    ['KẾT QUẢ BẦU CỬ CHI TIẾT THEO ỨNG CỬ VIÊN'],
    ['STT', 'Họ và tên ứng cử viên', 'Giới tính', 'Ngày sinh', 'Số phiếu bầu', 'Tỷ lệ %', 'Kết quả'],
  ];

  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  sortedCandidates.forEach((c, idx) => {
    const isElected = idx < config.numRepresentatives && c.voteCount > 0;
    resultsData.push([
      c.stt.toString(),
      c.fullName,
      c.gender,
      c.dob,
      c.voteCount.toString(),
      `${c.votePercentage}%`,
      isElected ? 'TRÚNG CỬ' : 'Không trúng cử'
    ]);
  });

  const wsResults = XLSX.utils.aoa_to_sheet(resultsData);
  XLSX.utils.book_append_sheet(wb, wsResults, 'Ket_Qua_Kiem_Phieu');

  // 2. Sheet Danh sách Cử tri
  const voterRows = [
    ['DANH SÁCH CỬ TRI ĐI BỎ PHIẾU'],
    ['STT', 'Mã thẻ cử tri', 'Họ và tên', 'Giới tính', 'Ngày sinh', 'Địa chỉ / Thôn', 'Trạng thái đi bầu', 'Thời gian bầu'],
  ];

  voters.forEach(v => {
    voterRows.push([
      v.stt.toString(),
      v.voterCardNo,
      v.fullName,
      v.gender,
      v.dob,
      v.address,
      v.hasVoted ? 'Đã bỏ phiếu' : 'Chưa bỏ phiếu',
      v.votedAt || ''
    ]);
  });

  const wsVoters = XLSX.utils.aoa_to_sheet(voterRows);
  XLSX.utils.book_append_sheet(wb, wsVoters, 'Danh_Sach_Cu_Tri');

  // Tải file về
  XLSX.writeFile(wb, `Ket_Qua_Bau_Cu_${config.levelCode}_${new Date().toISOString().slice(0,10)}.xlsx`);
}
