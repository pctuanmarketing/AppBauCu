export type ElectionLevel = 'QUOC_HOI' | 'HDND_TINH' | 'HDND_XA';

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEW';

export type UserAccountStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  status: UserAccountStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ElectionUnit {
  id: string;
  province: string;
  term: string;
  quocHoiUnitNo: number;
  quocHoiWards: string;
  hdndTinhUnitNo: number;
  hdndTinhWards: string;
  hdndXaUnitNo: number;
  hdndXaVillages: string;
  votingAreaNo: number;
  wardName: string;
}

export interface CommitteeMember {
  id: string;
  stt: number;
  fullName: string;
  role: string;
  idCard: string;
  phone: string;
}

export interface Witness {
  id: string;
  stt: number;
  fullName: string;
  address: string;
  idCard?: string;
  phone?: string;
}

export interface Candidate {
  id: string;
  stt: number;
  fullName: string;
  gender: string;
  dob: string;
  electionLevel: ElectionLevel;
  voteCount: number;
  votePercentage: number;
  votesType3?: number;
  votesType2?: number;
  votesType1?: number;
}

export interface ElectionLevelConfig {
  levelCode: ElectionLevel;
  levelName: string;
  totalVoters: number;
  numCandidates: number;
  numRepresentatives: number;
  ballotsReceived: number;
  ballotsIssued: number;
  ballotsDamaged: number;
  ballotsReturned: number;
}

export interface Voter {
  id: string;
  stt: number;
  voterCardNo: string;
  fullName: string;
  gender: string;
  dob: string;
  idCard?: string;
  ethnicity?: string;
  address: string;

  eligibleQuocHoi?: boolean;
  eligibleHdndTinh?: boolean;
  eligibleHdndXa?: boolean;

  hasVoted: boolean;
  votedAt?: string;
}

export interface BallotRecord {
  id: string;
  ballotIndex: number;
  electionLevel: ElectionLevel;
  isValid: boolean;
  struckOutNumbers: string;
  struckOutCandidateIds: string[];
  electedCandidateIds: string[];
  numElectedCount: number;
  createdAt: string;
}

export interface SystemSettings {
  isLocked: boolean;
  currentRole: UserRole;
  termName: string;
}
