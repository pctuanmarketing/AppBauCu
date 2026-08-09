export type ElectionLevel = 'QUOC_HOI' | 'HDND_TINH' | 'HDND_XA';

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEW';

export interface ElectionUnit {
  id: string;
  province: string; // Tỉnh/Thành phố (VD: Thành phố Đà Nẵng)
  term: string; // Khóa (VD: XVI)
  quocHoiUnitNo: number; // Đơn vị bầu cử ĐBQH số
  quocHoiWards: string; // Gồm các Xã/Phường
  hdndTinhUnitNo: number; // Đơn vị bầu cử HĐND Tỉnh số
  hdndTinhWards: string; // Gồm các Xã/Phường
  hdndXaUnitNo: number; // Đơn vị bầu cử HĐND Xã số
  hdndXaVillages: string; // Gồm các Thôn/Tổ dân phố
  votingAreaNo: number; // Khu vực bỏ phiếu số (VD: 21)
  wardName: string; // Xã/Phường (VD: Xã Hòa Tiến)
}

export interface CommitteeMember {
  id: string;
  stt: number;
  fullName: string;
  role: string; // Tổ trưởng, Thư ký, Ủy viên
  idCard: string;
  phone: string;
}

export interface Witness {
  id: string;
  stt: number;
  fullName: string;
  address: string;
}

export interface Candidate {
  id: string;
  stt: number;
  fullName: string;
  gender: string; // Ông / Bà
  dob: string; // Ngày sinh
  electionLevel: ElectionLevel;
  voteCount: number;
  votePercentage: number;
}

export interface ElectionLevelConfig {
  levelCode: ElectionLevel;
  levelName: string; // ĐẠI BIỂU QUỐC HỘI, ĐẠI BIỂU HĐND TỈNH, ĐẠI BIỂU HĐND XÃ
  totalVoters: number; // Tổng số cử tri
  numCandidates: number; // Số người ứng cử
  numRepresentatives: number; // Số đại biểu được bầu
  ballotsReceived: number; // Số phiếu nhận vào
  ballotsIssued: number; // Số phiếu phát ra
  ballotsDamaged: number; // Số phiếu đổi hỏng
  ballotsReturned: number; // Số phiếu thu vào
}

export interface Voter {
  id: string;
  stt: number;
  voterCardNo: string;
  fullName: string;
  gender: string;
  dob: string;
  address: string; // Thôn / Tổ
  hasVoted: boolean;
  votedAt?: string;
}

export interface BallotRecord {
  id: string;
  ballotIndex: number; // Số phiếu thứ bao nhiêu (1, 2, 3...)
  electionLevel: ElectionLevel;
  isValid: boolean;
  struckOutNumbers: string; // Chuỗi gạch nhập vào, VD '134' hoặc '0'
  struckOutCandidateIds: string[]; // Danh sách ID các ứng cử viên bị gạch
  electedCandidateIds: string[]; // Danh sách ID các ứng cử viên được bầu
  createdAt: string;
}

export interface SystemSettings {
  isLocked: boolean;
  currentRole: UserRole;
  termName: string;
}
