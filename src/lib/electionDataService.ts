import { supabase, isSupabaseConfigured } from './supabase';
import {
  BallotRecord,
  Candidate,
  CommitteeMember,
  ElectionLevel,
  ElectionLevelConfig,
  ElectionUnit,
  Voter,
  Witness,
} from '../types';

export const TABLES = {
  UNITS: 'election_units',
  CONFIGS: 'election_level_configs',
  COMMITTEE: 'committee_members',
  WITNESSES: 'witnesses',
  CANDIDATES: 'candidates',
  VOTERS: 'voters',
  BALLOTS: 'ballot_records',
};

// ---------------------------------------------------------
// DATA MAPPERS (Database Row <-> Frontend Type)
// ---------------------------------------------------------

export function mapDbUnit(u: any): ElectionUnit {
  return {
    id: String(u.id),
    province: u.province || 'Thành phố Đà Nẵng',
    term: u.term || 'XVI',
    quocHoiUnitNo: u.quoc_hoi_unit_no ?? 2,
    quocHoiWards: u.quoc_hoi_wards || '',
    hdndTinhUnitNo: u.hdnd_tinh_unit_no ?? 6,
    hdndTinhWards: u.hdnd_tinh_wards || '',
    hdndXaUnitNo: u.hdnd_xa_unit_no ?? 8,
    hdndXaVillages: u.hdnd_xa_villages || '',
    votingAreaNo: u.voting_area_no ?? 21,
    wardName: u.ward_name || 'Xã Hòa Tiến',
  };
}

export function mapDbConfig(c: any): ElectionLevelConfig {
  return {
    levelCode: c.level_code as ElectionLevel,
    levelName: c.level_name || '',
    totalVoters: c.total_voters ?? 0,
    numCandidates: c.num_candidates ?? 0,
    numRepresentatives: c.num_representatives ?? 0,
    ballotsReceived: c.ballots_received ?? 0,
    ballotsIssued: c.ballots_issued ?? 0,
    ballotsDamaged: c.ballots_damaged ?? 0,
    ballotsReturned: c.ballots_returned ?? 0,
  };
}

export function mapDbCommittee(m: any): CommitteeMember {
  return {
    id: String(m.id),
    stt: m.stt ?? 1,
    fullName: m.full_name || '',
    role: m.role || 'Ủy viên',
    idCard: m.id_card || '',
    phone: m.phone || '',
  };
}

export function mapDbWitness(w: any): Witness {
  return {
    id: String(w.id),
    stt: w.stt ?? 1,
    fullName: w.full_name || '',
    address: w.address || '',
    idCard: w.id_card || '',
    phone: w.phone || '',
  };
}

export function mapDbCandidate(c: any): Candidate {
  return {
    id: String(c.id),
    stt: c.stt ?? 1,
    fullName: c.full_name || '',
    gender: c.gender || 'Nam',
    dob: c.dob || '',
    electionLevel: c.election_level as ElectionLevel,
    voteCount: c.vote_count ?? 0,
    votePercentage: Number(c.vote_percentage || 0),
  };
}

export function mapDbVoter(v: any): Voter {
  return {
    id: String(v.id),
    stt: v.stt ?? 1,
    voterCardNo: v.voter_card_no || '',
    fullName: v.full_name || '',
    gender: v.gender || '',
    dob: v.dob || '',
    address: v.address || '',
    hasVoted: Boolean(v.has_voted),
    votedAt: v.voted_at || undefined,
  };
}

export function mapDbBallot(b: any): BallotRecord {
  return {
    id: String(b.id),
    ballotIndex: b.ballot_index ?? 1,
    electionLevel: b.election_level as ElectionLevel,
    isValid: Boolean(b.is_valid),
    struckOutNumbers: b.struck_out_numbers || '',
    struckOutCandidateIds: Array.isArray(b.struck_out_candidate_ids) ? b.struck_out_candidate_ids : [],
    electedCandidateIds: Array.isArray(b.elected_candidate_ids) ? b.elected_candidate_ids : [],
    numElectedCount: Array.isArray(b.elected_candidate_ids) ? b.elected_candidate_ids.length : 0,
    createdAt: b.created_at || new Date().toISOString(),
  };
}

// ---------------------------------------------------------
// DATABASE FETCH ALL SNAPSHOT
// ---------------------------------------------------------

export interface GlobalElectionSnapshot {
  unit?: ElectionUnit;
  configs?: Record<ElectionLevel, ElectionLevelConfig>;
  committee?: CommitteeMember[];
  witnesses?: Witness[];
  candidates?: Candidate[];
  voters?: Voter[];
  ballots?: BallotRecord[];
}

export async function fetchGlobalElectionData(): Promise<GlobalElectionSnapshot | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const [
      unitRes,
      configRes,
      committeeRes,
      witnessRes,
      candidateRes,
      voterRes,
      ballotRes,
    ] = await Promise.all([
      supabase.from(TABLES.UNITS).select('*').limit(1),
      supabase.from(TABLES.CONFIGS).select('*'),
      supabase.from(TABLES.COMMITTEE).select('*').order('stt', { ascending: true }),
      supabase.from(TABLES.WITNESSES).select('*').order('stt', { ascending: true }),
      supabase.from(TABLES.CANDIDATES).select('*').order('stt', { ascending: true }),
      supabase.from(TABLES.VOTERS).select('*').order('stt', { ascending: true }),
      supabase.from(TABLES.BALLOTS).select('*').order('ballot_index', { ascending: true }),
    ]);

    const snapshot: GlobalElectionSnapshot = {};

    if (unitRes.data && unitRes.data.length > 0) {
      snapshot.unit = mapDbUnit(unitRes.data[0]);
    }

    if (configRes.data && configRes.data.length > 0) {
      const configMap: Partial<Record<ElectionLevel, ElectionLevelConfig>> = {};
      configRes.data.forEach(c => {
        const mapped = mapDbConfig(c);
        if (mapped.levelCode) {
          configMap[mapped.levelCode] = mapped;
        }
      });
      if (Object.keys(configMap).length > 0) {
        snapshot.configs = configMap as Record<ElectionLevel, ElectionLevelConfig>;
      }
    }

    if (committeeRes.data && Array.isArray(committeeRes.data)) {
      snapshot.committee = committeeRes.data.map(mapDbCommittee);
    }

    if (witnessRes.data && Array.isArray(witnessRes.data)) {
      snapshot.witnesses = witnessRes.data.map(mapDbWitness);
    }

    if (candidateRes.data && Array.isArray(candidateRes.data)) {
      snapshot.candidates = candidateRes.data.map(mapDbCandidate);
    }

    if (voterRes.data && Array.isArray(voterRes.data)) {
      snapshot.voters = voterRes.data.map(mapDbVoter);
    }

    if (ballotRes.data && Array.isArray(ballotRes.data)) {
      snapshot.ballots = ballotRes.data.map(mapDbBallot);
    }

    return snapshot;
  } catch (err) {
    console.error('❌ Error fetching global election data from Supabase:', err);
    return null;
  }
}

// ---------------------------------------------------------
// DATABASE MUTATIONS (SAVE & DELETE)
// ---------------------------------------------------------

export async function saveVoterToSupabase(voter: Voter): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = {
      id: voter.id,
      stt: voter.stt,
      voter_card_no: voter.voterCardNo || `V-${voter.stt}`,
      full_name: voter.fullName,
      gender: voter.gender || '',
      dob: voter.dob || '',
      address: voter.address || '',
      has_voted: voter.hasVoted || false,
      voted_at: voter.votedAt || null,
    };
    const { error } = await supabase.from(TABLES.VOTERS).upsert(payload, { onConflict: 'id' });
    if (error) console.error('❌ Save voter error:', error.message);
    return !error;
  } catch (err) {
    console.error('❌ Save voter exception:', err);
    return false;
  }
}

export async function deleteVoterFromSupabase(voterId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from(TABLES.VOTERS).delete().eq('id', voterId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function saveCandidateToSupabase(candidate: Candidate): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = {
      id: candidate.id,
      stt: candidate.stt,
      full_name: candidate.fullName,
      gender: candidate.gender,
      dob: candidate.dob || '',
      election_level: candidate.electionLevel,
      vote_count: candidate.voteCount || 0,
      vote_percentage: candidate.votePercentage || 0,
    };
    const { error } = await supabase.from(TABLES.CANDIDATES).upsert(payload, { onConflict: 'id' });
    return !error;
  } catch (err) {
    return false;
  }
}

export async function deleteCandidateFromSupabase(candidateId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from(TABLES.CANDIDATES).delete().eq('id', candidateId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function saveBallotToSupabase(ballot: BallotRecord): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = {
      id: ballot.id,
      ballot_index: ballot.ballotIndex,
      election_level: ballot.electionLevel,
      is_valid: ballot.isValid,
      struck_out_numbers: ballot.struckOutNumbers || '',
      struck_out_candidate_ids: ballot.struckOutCandidateIds || [],
      elected_candidate_ids: ballot.electedCandidateIds || [],
      created_at: ballot.createdAt || new Date().toISOString(),
    };
    const { error } = await supabase.from(TABLES.BALLOTS).upsert(payload, { onConflict: 'id' });
    return !error;
  } catch (err) {
    return false;
  }
}

export async function deleteBallotFromSupabase(ballotId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from(TABLES.BALLOTS).delete().eq('id', ballotId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function saveCommitteeToSupabase(member: CommitteeMember): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = {
      id: member.id,
      stt: member.stt,
      full_name: member.fullName,
      role: member.role,
      id_card: member.idCard || '',
      phone: member.phone || '',
    };
    const { error } = await supabase.from(TABLES.COMMITTEE).upsert(payload, { onConflict: 'id' });
    return !error;
  } catch (err) {
    return false;
  }
}

export async function deleteCommitteeFromSupabase(memberId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from(TABLES.COMMITTEE).delete().eq('id', memberId);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function saveWitnessToSupabase(witness: Witness): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = {
      id: witness.id,
      stt: witness.stt,
      full_name: witness.fullName,
      address: witness.address || '',
      id_card: witness.idCard || '',
      phone: witness.phone || '',
    };
    const { error } = await supabase.from(TABLES.WITNESSES).upsert(payload, { onConflict: 'id' });
    return !error;
  } catch (err) {
    return false;
  }
}

export async function deleteWitnessFromSupabase(witnessId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from(TABLES.WITNESSES).delete().eq('id', witnessId);
    return !error;
  } catch (err) {
    return false;
  }
}

// ---------------------------------------------------------
// REALTIME MULTI-TABLE SUBSCRIPTION
// ---------------------------------------------------------

export function subscribeToGlobalElectionChanges(
  onTableChange: (tableName: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) => void
): { unsubscribe: () => void } | null {
  if (!isSupabaseConfigured || !supabase) return null;

  console.log('📡 [REALTIME] Subscribing to shared business tables (voters, candidates, ballots, committee, witnesses, units, configs)...');

  const channel = supabase
    .channel('global_business_data_realtime_channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      (payload) => {
        console.log(`⚡ [GLOBAL REALTIME EVENT] Table: ${payload.table}, Event: ${payload.eventType}`);
        onTableChange(payload.table, payload.eventType as any, payload);
      }
    )
    .subscribe((status, err) => {
      if (err) console.error('❌ Global Realtime subscription error:', err);
      else console.log(`📡 [GLOBAL REALTIME STATUS]: ${status}`);
    });

  return {
    unsubscribe: () => {
      console.log('🔌 [REALTIME] Unsubscribing global business data channel...');
      supabase.removeChannel(channel);
    },
  };
}
