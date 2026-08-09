import * as XLSX from 'xlsx';
import { Candidate, CommitteeMember, ElectionLevelConfig, ElectionUnit, Voter, Witness } from '../types';

interface ExtendedCandidateStats extends Candidate {
  votesType3?: number;
  votesType2?: number;
  votesType1?: number;
}

export function exportElectionResultsToExcel(
  config: ElectionLevelConfig,
  candidates: ExtendedCandidateStats[],
  voters: Voter[],
  validBallotsCount: number,
  invalidBallotsCount: number,
  unit?: ElectionUnit,
  committee?: CommitteeMember[],
  witnesses?: Witness[]
) {
  const wb = XLSX.utils.book_new();
  const isQuocHoi = config.levelCode === 'QUOC_HOI';
  const mauTitle = isQuocHoi ? 'MẪU SỐ 18-HĐBC (QUỐC HỘI)' : 'MẪU SỐ 23-HĐBC (HĐND)';

  const totalReturned = validBallotsCount + invalidBallotsCount;
  const turnOutPct = config.totalVoters > 0 ? ((totalReturned / config.totalVoters) * 100).toFixed(2) : '0.00';
  const validPct = totalReturned > 0 ? ((validBallotsCount / totalReturned) * 100).toFixed(2) : '0.00';
  const invalidPct = totalReturned > 0 ? ((invalidBallotsCount / totalReturned) * 100).toFixed(2) : '0.00';

  // SHEET 1: BIÊN BẢN CHÍNH THỨC MẪU 18 / 23
  const reportHeader = [
    ['CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'],
    ['Độc lập - Tự do - Hạnh phúc'],
    ['-------------------------'],
    ['BIÊN BẢN KIỂM PHIẾU BẦU CỬ'],
    [`CẤP BẦU CỬ: ${config.levelName.toUpperCase()} (${mauTitle})`],
    [`Khóa/Nhiệm kỳ: ${unit?.term || 'Khóa XVI (2026 - 2031)'}`],
    [`Khu vực bỏ phiếu số: ${unit?.votingAreaNo || '01'}, ${unit?.wardName || ''}, ${unit?.province || ''}`],
    [''],
    ['I. TÌNH HÌNH CỬ TRI VÀ PHIẾU BẦU CỬ'],
    ['1. Tổng số cử tri của khu vực bỏ phiếu', config.totalVoters, 'cử tri'],
    ['2. Số phiếu bầu cử Tổ bầu cử nhận vào', config.ballotsReceived, 'phiếu'],
    ['3. Số phiếu bầu cử Tổ bầu cử phát ra', config.ballotsIssued, 'phiếu'],
    ['4. Số phiếu bầu cử thu vào (số cử tri đã đi bầu)', totalReturned, `phiếu (${turnOutPct}%)`],
    ['5. Số phiếu bầu thừa (chưa phát ra) và hỏng', config.ballotsDamaged, 'phiếu'],
    ['6. Số phiếu bầu hợp lệ', validBallotsCount, `phiếu (${validPct}%)`],
    ['7. Số phiếu bầu không hợp lệ', invalidBallotsCount, `phiếu (${invalidPct}%)`],
    ['8. Số đại biểu được bầu', config.numRepresentatives, 'đại biểu'],
    [''],
    ['II. KẾT QUẢ BẦU CỬ CHI TIẾT THEO ỨNG CỬ VIÊN'],
    ['STT', 'Họ và tên người ứng cử', 'Giới tính', 'Ngày sinh', 'Địa chỉ / Thôn', 'Số phiếu bầu', 'Tỷ lệ %', 'Loại phiếu 3', 'Loại phiếu 2', 'Loại phiếu 1', 'Kết quả trúng cử'],
  ];

  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  sortedCandidates.forEach((c, idx) => {
    const isElected = idx < config.numRepresentatives && c.voteCount > 0;
    reportHeader.push([
      c.stt.toString(),
      c.fullName,
      c.gender,
      c.dob,
      c.address || '',
      c.voteCount.toString(),
      `${c.votePercentage}%`,
      (c.votesType3 || 0).toString(),
      (c.votesType2 || 0).toString(),
      (c.votesType1 || 0).toString(),
      isElected ? 'TRÚNG CỬ' : 'Không trúng cử'
    ]);
  });

  reportHeader.push(['']);
  reportHeader.push(['III. DANH SÁCH ỨNG CỬ VIÊN TRÚNG CỬ']);
  reportHeader.push(['STT', 'Họ và tên người trúng cử', 'Ngày sinh', 'Giới tính', 'Số phiếu bầu', 'Tỷ lệ %']);
  sortedCandidates.slice(0, config.numRepresentatives).forEach((c, idx) => {
    reportHeader.push([
      (idx + 1).toString(),
      c.fullName,
      c.dob,
      c.gender,
      c.voteCount.toString(),
      `${c.votePercentage}%`
    ]);
  });

  const wsReport = XLSX.utils.aoa_to_sheet(reportHeader);
  XLSX.utils.book_append_sheet(wb, wsReport, 'Bien_Ban_Mau_Bao_Cao');

  // SHEET 2: DANH SÁCH CỬ TRI ĐI BẦU THỰC TẾ
  const voterRows = [
    ['DANH SÁCH CỬ TRI THAM GIA BỎ PHIẾU'],
    [`Cấp bầu cử: ${config.levelName}`],
    ['STT', 'Mã thẻ cử tri', 'Họ và tên cử tri', 'Giới tính', 'Ngày sinh', 'Số CMND/CCCD', 'Địa chỉ / Thôn', 'Trạng thái bỏ phiếu', 'Thời điểm đi bầu'],
  ];

  voters.forEach(v => {
    voterRows.push([
      v.stt.toString(),
      v.voterCardNo,
      v.fullName,
      v.gender,
      v.dob,
      v.idCard || '',
      v.address,
      v.hasVoted ? 'Đã bỏ phiếu' : 'Chưa bỏ phiếu',
      v.votedAt || ''
    ]);
  });

  const wsVoters = XLSX.utils.aoa_to_sheet(voterRows);
  XLSX.utils.book_append_sheet(wb, wsVoters, 'Danh_Sach_Cu_Tri');

  // SHEET 3: THÀNH VIÊN TỔ BẦU CỬ & NGUYÊN TẮC KIỂM PHIẾU
  if (committee && committee.length > 0) {
    const committeeRows = [
      ['THÀNH PHẦN TỔ BẦU CỬ VÀ ĐẠI DIỆN CHỨNG KIẾN'],
      ['STT', 'Họ và tên', 'Chức vụ / Vai trò trong Tổ bầu cử', 'Đơn vị công tác / Đại diện'],
    ];

    committee.forEach((m, idx) => {
      committeeRows.push([
        (idx + 1).toString(),
        m.fullName,
        m.position,
        m.unit || 'Tổ bầu cử số ' + (unit?.votingAreaNo || '01')
      ]);
    });

    if (witnesses && witnesses.length > 0) {
      committeeRows.push(['']);
      committeeRows.push(['ĐẠI DIỆN CỬ TRI CHỨNG KIẾN KIỂM PHIẾU']);
      committeeRows.push(['STT', 'Họ và tên', 'Cơ quan / Đại diện cử tri']);
      witnesses.forEach((w, idx) => {
        committeeRows.push([
          (idx + 1).toString(),
          w.fullName,
          w.representedOrg || 'Đại diện cử tri nhân dân'
        ]);
      });
    }

    const wsCommittee = XLSX.utils.aoa_to_sheet(committeeRows);
    XLSX.utils.book_append_sheet(wb, wsCommittee, 'To_Bau_Cu_Va_Chung_Kien');
  }

  // Save workbook
  const cleanLevelCode = config.levelCode || 'BAO_CAO';
  XLSX.writeFile(wb, `Bao_Cao_Kiem_Phieu_${cleanLevelCode}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
