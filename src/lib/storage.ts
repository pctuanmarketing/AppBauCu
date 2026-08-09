import { VotingUnit, Council, CouncilId, Candidate, VoteRecord, CandidateVote, User, Role, UserStatus } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const DEFAULT_COUNCILS: Council[] = [
  {
    id: 'quoc_hoi',
    name: 'Hội đồng bầu cử Đại biểu Quốc hội khóa XVI',
    shortName: 'ĐBQH Quốc hội',
    candidatesCount: 5,
    electCount: 3
  },
  {
    id: 'hdnd_tinh',
    name: 'Hội đồng bầu cử ĐB HĐND Thành phố nhiệm kỳ 2026 - 2031',
    shortName: 'HĐND Thành Phố',
    candidatesCount: 7,
    electCount: 4
  },
  {
    id: 'hdnd_xa',
    name: 'Hội đồng bầu cử ĐB HĐND Xã nhiệm kỳ 2026 - 2031',
    shortName: 'HĐND Xã / Phường',
    candidatesCount: 5,
    electCount: 3
  }
];

const DEFAULT_CANDIDATES: Candidate[] = [
  // ĐBQH
  { id: 'cand-qh-1', councilId: 'quoc_hoi', stt: 1, fullName: 'NGUYỄN VĂN AN', yearOfBirth: 1975, gender: 'Nam', position: 'Bí thư Tỉnh ủy', workplace: 'Thành ủy' },
  { id: 'cand-qh-2', councilId: 'quoc_hoi', stt: 2, fullName: 'TRAN THỊ BÌNH', yearOfBirth: 1980, gender: 'Nữ', position: 'Chủ tịch Hội Liên hiệp Phụ nữ', workplace: 'Hội LHPN Thành phố' },
  { id: 'cand-qh-3', councilId: 'quoc_hoi', stt: 3, fullName: 'LÊ HOÀNG CƯỜNG', yearOfBirth: 1968, gender: 'Nam', position: 'Giám đốc Sở Kế hoạch Đầu tư', workplace: 'Sở KHĐT' },
  { id: 'cand-qh-4', councilId: 'quoc_hoi', stt: 4, fullName: 'PHẠM DƯƠNG DŨNG', yearOfBirth: 1982, gender: 'Nam', position: 'Phó Giám đốc Bệnh viện Đa khoa', workplace: 'Bệnh viện Đa khoa' },
  { id: 'cand-qh-5', councilId: 'quoc_hoi', stt: 5, fullName: 'VŨ THỊ EM', yearOfBirth: 1986, gender: 'Nữ', position: 'Hiệu trưởng Trường THPT Chuyên', workplace: 'Trường THPT Chuyên' },

  // HĐND Tỉnh
  { id: 'cand-tinh-1', councilId: 'hdnd_tinh', stt: 1, fullName: 'HOÀNG VĂN GIANG', yearOfBirth: 1972, gender: 'Nam', position: 'Chủ tịch UBND Huyện', workplace: 'UBND Huyện' },
  { id: 'cand-tinh-2', councilId: 'hdnd_tinh', stt: 2, fullName: 'ĐẶNG THỊ HÀ', yearOfBirth: 1979, gender: 'Nữ', position: 'Trưởng Phòng Giáo dục', workplace: 'Phòng GD&ĐT' },
  { id: 'cand-tinh-3', councilId: 'hdnd_tinh', stt: 3, fullName: 'BÙI HỮU HÙNG', yearOfBirth: 1985, gender: 'Nam', position: 'Giám đốc Doanh nghiệp', workplace: 'Công ty CP Phát triển' },
  { id: 'cand-tinh-4', councilId: 'hdnd_tinh', stt: 4, fullName: 'NGÔ THỊ KHÁNH', yearOfBirth: 1988, gender: 'Nữ', position: 'Bí thư Đoàn Thanh niên', workplace: 'Thành đoàn' },
  { id: 'cand-tinh-5', councilId: 'hdnd_tinh', stt: 5, fullName: 'ĐỖ VĂN LONG', yearOfBirth: 1976, gender: 'Nam', position: 'Trưởng Công an Huyện', workplace: 'Công an Huyện' },
  { id: 'cand-tinh-6', councilId: 'hdnd_tinh', stt: 6, fullName: 'PHẠM CÔNG TUÂN', yearOfBirth: 1984, gender: 'Nam', position: 'Chuyên gia Công nghệ Thông tin', workplace: 'Tác giả Phần mềm Bầu cử' },
  { id: 'cand-tinh-7', councilId: 'hdnd_tinh', stt: 7, fullName: 'LÝ THỊ MAI', yearOfBirth: 1990, gender: 'Nữ', position: 'Bác sĩ Chuyên khoa I', workplace: 'Trung tâm Y tế' },

  // HĐND Xã
  { id: 'cand-xa-1', councilId: 'hdnd_xa', stt: 1, fullName: 'TRỊNH VĂN NAM', yearOfBirth: 1981, gender: 'Nam', position: 'Bí thư Đảng ủy Xã', workplace: 'Đảng ủy Xã' },
  { id: 'cand-xa-2', councilId: 'hdnd_xa', stt: 2, fullName: 'PHAN THỊ OANH', yearOfBirth: 1983, gender: 'Nữ', position: 'Chủ tịch UBND Xã', workplace: 'UBND Xã' },
  { id: 'cand-xa-3', councilId: 'hdnd_xa', stt: 3, fullName: 'VÕ VĂN PHÚC', yearOfBirth: 1977, gender: 'Nam', position: 'Trưởng Công an Xã', workplace: 'Công an Xã' },
  { id: 'cand-xa-4', councilId: 'hdnd_xa', stt: 4, fullName: 'LÊ THỊ QUYÊN', yearOfBirth: 1989, gender: 'Nữ', position: 'Chủ tịch Hội Nông dân Xã', workplace: 'Hội Nông dân' },
  { id: 'cand-xa-5', councilId: 'hdnd_xa', stt: 5, fullName: 'HOÀNG VĂN SƠN', yearOfBirth: 1992, gender: 'Nam', position: 'Bí thư Đoàn Xã', workplace: 'Đoàn Thanh niên Xã' }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    fullName: 'Quản Trị Viên Quốc Gia',
    email: 'admin@baucu2026.gov.vn',
    role: 'admin',
    status: 'active',
    isActivated: true,
    registeredAt: new Date().toISOString()
  },
  {
    id: 'usr-pctuan',
    username: 'pctuan',
    fullName: 'Phạm Công Tuân (Tác giả)',
    email: 'pctuanit@gmail.com',
    phone: '0916199945',
    role: 'admin',
    status: 'active',
    isActivated: true,
    registeredAt: new Date().toISOString()
  },
  {
    id: 'usr-editor-1',
    username: 'editor1',
    fullName: 'Đoàn Thị Ngọc Phương',
    email: 'ngocphuong@baucu2026.gov.vn',
    role: 'editor',
    status: 'active',
    isActivated: true,
    registeredAt: new Date().toISOString()
  },
  {
    id: 'usr-viewer-1',
    username: 'viewer1',
    fullName: 'Quan Sát Viên Bầu Cử',
    email: 'giamsat@baucu2026.gov.vn',
    role: 'viewer',
    status: 'active',
    isActivated: true,
    registeredAt: new Date().toISOString()
  }
];

export const getCouncils = (): Council[] => DEFAULT_COUNCILS;

// -------------------------------------------------------------
// USER MANAGEMENT & ROLE AUTHORIZATION API
// -------------------------------------------------------------

export const getUsers = (): User[] => {
  const saved = localStorage.getItem('app_users');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('app_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('app_users', JSON.stringify(users));
};

export const registerUser = (userData: { username: string; fullName: string; email: string; phone?: string; roleRequested?: Role }): { user: User; message: string } => {
  const users = getUsers();
  const existing = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase() || u.email.toLowerCase() === userData.email.toLowerCase());
  
  if (existing) {
    throw new Error('Tài khoản hoặc Email đã tồn tại trên hệ thống!');
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    username: userData.username,
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    role: userData.roleRequested || 'editor',
    status: 'pending_approval',
    isActivated: false,
    activationCode: 'BAUCU2026',
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return {
    user: newUser,
    message: 'Đăng ký thành công! Đã gửi mã kích hoạt Email (BAUCU2026). Đang chờ Admin phê duyệt.'
  };
};

export const activateUserCode = (userId: string, code: string): { success: boolean; message: string } => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return { success: false, message: 'Tài khoản không tồn tại!' };

  if (code.trim().toUpperCase() !== 'BAUCU2026') {
    return { success: false, message: 'Mã kích hoạt không hợp lệ! (Mã đúng: BAUCU2026)' };
  }

  users[index].isActivated = true;
  saveUsers(users);
  return { success: true, message: 'Kích hoạt Email thành công! Tài khoản đang chờ Admin duyệt.' };
};

export const approveUser = (userId: string, assignedRole: Role): User => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('Không tìm thấy tài khoản!');

  users[index].status = 'active';
  users[index].isActivated = true;
  users[index].role = assignedRole;

  saveUsers(users);
  return users[index];
};

export const rejectUser = (userId: string): User => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('Không tìm thấy tài khoản!');

  users[index].status = 'rejected';
  saveUsers(users);
  return users[index];
};

export const updateUserRole = (userId: string, role: Role): User => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('Không tìm thấy tài khoản!');

  users[index].role = role;
  saveUsers(users);
  return users[index];
};

// -------------------------------------------------------------
// VOTING UNIT & CANDIDATES STORAGE
// -------------------------------------------------------------

export const getVotingUnit = async (): Promise<VotingUnit> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('voting_units').select('*').limit(1).single();
      if (!error && data) {
        return {
          id: data.id,
          unitName: data.unit_name,
          votingArea: data.voting_area,
          province: data.province,
          term: data.term,
          district: data.district,
          commune: data.commune,
          totalVoters: data.total_voters,
          quocHoiUnitNo: data.quoc_hoi_unit_no,
          quocHoiAreas: data.quoc_hoi_areas,
          hdndTinhUnitNo: data.hdnd_tinh_unit_no,
          hdndTinhAreas: data.hdnd_tinh_areas,
          hdndXaUnitNo: data.hdnd_xa_unit_no,
          hdndXaAreas: data.hdnd_xa_areas
        };
      }
    } catch (e) {}
  }

  const saved = localStorage.getItem('voting_unit');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }

  const defaultUnit: VotingUnit = {
    id: 'unit-1',
    unitName: 'Tổ bầu cử số 21',
    votingArea: 'Khu vực bỏ phiếu số 21',
    province: 'Thành phố Đà Nẵng',
    term: 'XVI',
    district: 'Huyện Hòa Vang',
    commune: 'Xã Hòa Tiến',
    totalVoters: 1250,
    quocHoiUnitNo: '2',
    quocHoiAreas: 'Đặc khu Hoàng Sa, Phường An Hải, Phường Sơn Trà, Phường Ngũ Hành Sơn, Ph...',
    hdndTinhUnitNo: '6',
    hdndTinhAreas: 'Xã Hòa Vang, Xã Hòa Tiến, Xã Bà Nà',
    hdndXaUnitNo: '8',
    hdndXaAreas: 'Nam Sơn, Lệ Sơn 2, An Trạch'
  };

  localStorage.setItem('voting_unit', JSON.stringify(defaultUnit));
  return defaultUnit;
};

export const saveVotingUnit = async (unit: VotingUnit): Promise<void> => {
  localStorage.setItem('voting_unit', JSON.stringify(unit));
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('voting_units').upsert({
        id: unit.id,
        unit_name: unit.unitName,
        voting_area: unit.votingArea,
        province: unit.province,
        term: unit.term,
        district: unit.district,
        commune: unit.commune,
        total_voters: unit.totalVoters,
        quoc_hoi_unit_no: unit.quocHoiUnitNo,
        quoc_hoi_areas: unit.quocHoiAreas,
        hdnd_tinh_unit_no: unit.hdndTinhUnitNo,
        hdnd_tinh_areas: unit.hdndTinhAreas,
        hdnd_xa_unit_no: unit.hdndXaUnitNo,
        hdnd_xa_areas: unit.hdndXaAreas
      });
    } catch (e) {}
  }
};

export const getCandidates = async (): Promise<Candidate[]> => {
  const saved = localStorage.getItem('candidates');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('candidates', JSON.stringify(DEFAULT_CANDIDATES));
  return DEFAULT_CANDIDATES;
};

export const saveCandidates = async (candidates: Candidate[]): Promise<void> => {
  localStorage.setItem('candidates', JSON.stringify(candidates));
};

export const getVoteRecord = async (councilId: CouncilId): Promise<{ record: VoteRecord; candidateVotes: CandidateVote[] }> => {
  const saved = localStorage.getItem(`vote_record_${councilId}`);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }

  const cands = DEFAULT_CANDIDATES.filter(c => c.councilId === councilId);
  const defaultRecord: VoteRecord = {
    id: `rec-${councilId}`,
    votingUnitId: 'unit-1',
    councilId,
    totalVoters: 1250,
    votersVoted: 1245,
    ballotsIssued: 1245,
    ballotsCollected: 1245,
    validBallots: 1240,
    invalidBallots: 5,
    status: 'draft'
  };

  const defaultCVotes: CandidateVote[] = cands.map((c, i) => ({
    id: `cv-${c.id}`,
    voteRecordId: defaultRecord.id,
    candidateId: c.id,
    votesCount: 1100 - i * 85
  }));

  const data = { record: defaultRecord, candidateVotes: defaultCVotes };
  localStorage.setItem(`vote_record_${councilId}`, JSON.stringify(data));
  return data;
};

export const saveVoteRecord = async (record: VoteRecord, candidateVotes: CandidateVote[]): Promise<void> => {
  const data = { record, candidateVotes };
  localStorage.setItem(`vote_record_${record.councilId}`, JSON.stringify(data));
};
