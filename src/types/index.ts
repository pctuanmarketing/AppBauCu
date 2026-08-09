export type CouncilId = 'quoc_hoi' | 'hdnd_tinh' | 'hdnd_xa';

export type Role = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'pending_approval' | 'rejected';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: UserStatus;
  activationCode?: string;
  isActivated?: boolean;
  registeredAt?: string;
}

export interface VotingUnit {
  id: string;
  unitName: string;
  votingArea: string;
  province: string;
  term: string;
  district: string;
  commune: string;
  totalVoters: number;
  quocHoiUnitNo: string;
  quocHoiAreas: string;
  hdndTinhUnitNo: string;
  hdndTinhAreas: string;
  hdndXaUnitNo: string;
  hdndXaAreas: string;
}

export interface ElectionPersonnel {
  toTruong: string;
  thuKy: string;
  uyVien1: string;
  uyVien2: string;
  uyVien3: string;
}

export interface WitnessVoter {
  stt: number;
  fullName: string;
  address: string;
  idCard: string;
}

export interface Council {
  id: CouncilId;
  name: string;
  shortName: string;
  candidatesCount: number;
  electCount: number;
  candidatesToElect?: number;
  reportTemplate?: string;
}

export interface Candidate {
  id: string;
  councilId: CouncilId;
  stt: number;
  fullName: string;
  yearOfBirth?: number;
  birthDate?: string;
  gender?: string;
  hometown?: string;
  residence?: string;
  qualification?: string;
  position?: string;
  workplace?: string;
  notes?: string;
  votingUnitId?: string;
}

export interface VoteRecord {
  id: string;
  votingUnitId: string;
  councilId: CouncilId;
  totalVoters: number;
  votersVoted: number;
  ballotsIssued: number;
  ballotsCollected: number;
  validBallots: number;
  invalidBallots: number;
  notes?: string;
  status: 'draft' | 'completed';
  ballotsReceived?: number;
  ballotsDamaged?: number;
  ballotsRemaining?: number;
}

export interface CandidateVote {
  id?: string;
  voteRecordId: string;
  candidateId: string;
  votesCount: number;
  voteCount?: number;
}

export interface SingleBallotLog {
  id: string;
  ballotNo: number;
  struckOutStts: number[];
  valid: boolean;
  timestamp: string;
}
