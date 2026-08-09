import { useState, useEffect } from 'react';
import {
  BallotRecord,
  Candidate,
  CommitteeMember,
  ElectionLevel,
  ElectionLevelConfig,
  ElectionUnit,
  SystemSettings,
  Voter,
  Witness,
} from '../types';
import { calculateBallot } from '../lib/ballotCalculator';

// ---------------------------------------------------------
// INITIAL DATASETS
// ---------------------------------------------------------

const INITIAL_UNIT: ElectionUnit = {
  id: 'unit-1',
  province: 'Thành phố Đà Nẵng',
  term: 'XVI',
  quocHoiUnitNo: 2,
  quocHoiWards: 'Đặc khu Hoàng Sa, Phường An Hải, Phường Sơn Trà, Phường Ngũ Hành Sơn',
  hdndTinhUnitNo: 6,
  hdndTinhWards: 'Xã Hòa Vang, Xã Hòa Tiến, Xã Bà Nà',
  hdndXaUnitNo: 8,
  hdndXaVillages: 'Nam Sơn, Lệ Sơn 2, An Trạch',
  votingAreaNo: 21,
  wardName: 'Xã Hòa Tiến',
};

const INITIAL_CONFIGS: Record<ElectionLevel, ElectionLevelConfig> = {
  QUOC_HOI: {
    levelCode: 'QUOC_HOI',
    levelName: 'Đại biểu Quốc hội',
    totalVoters: 1369,
    numCandidates: 5,
    numRepresentatives: 3,
    ballotsReceived: 1436,
    ballotsIssued: 1369,
    ballotsDamaged: 2,
    ballotsReturned: 9,
  },
  HDND_TINH: {
    levelCode: 'HDND_TINH',
    levelName: 'Đại biểu HĐND Tỉnh',
    totalVoters: 1369,
    numCandidates: 5,
    numRepresentatives: 3,
    ballotsReceived: 1436,
    ballotsIssued: 1369,
    ballotsDamaged: 0,
    ballotsReturned: 0,
  },
  HDND_XA: {
    levelCode: 'HDND_XA',
    levelName: 'Đại biểu HĐND Xã',
    totalVoters: 1220,
    numCandidates: 5,
    numRepresentatives: 3,
    ballotsReceived: 1240,
    ballotsIssued: 1240,
    ballotsDamaged: 0,
    ballotsReturned: 1220,
  },
};

const INITIAL_COMMITTEE: CommitteeMember[] = [
  { id: '1', stt: 1, fullName: 'Nguyễn Đính', role: 'Tổ trưởng', idCard: '048085001234', phone: '0905628031' },
  { id: '2', stt: 2, fullName: 'Đặng Thức', role: 'Thư ký', idCard: '048085005678', phone: '0905628660' },
  { id: '3', stt: 3, fullName: 'Đặng Thử', role: 'Ủy viên', idCard: '048085009999', phone: '0905111222' },
  { id: '4', stt: 4, fullName: 'Nguyễn Quang Thơ', role: 'Ủy viên', idCard: '048085008888', phone: '0905333444' },
  { id: '5', stt: 5, fullName: 'Đặng Văn Quang', role: 'Ủy viên', idCard: '048085007777', phone: '0905555666' },
  { id: '6', stt: 6, fullName: 'Phạm Công Tuân', role: 'Ủy viên', idCard: '048085001111', phone: '0916199945' },
  { id: '7', stt: 7, fullName: 'Lê Thị Kim Nhung', role: 'Ủy viên', idCard: '048085002222', phone: '0905777888' },
  { id: '8', stt: 8, fullName: 'Nguyễn Hiếu Nghĩa', role: 'Ủy viên', idCard: '048085003333', phone: '0905999000' },
  { id: '9', stt: 9, fullName: 'Đặng Ngọc Duy', role: 'Ủy viên', idCard: '048085004444', phone: '0905123123' },
  { id: '10', stt: 10, fullName: 'Nguyễn Thị Hương Triều', role: 'Ủy viên', idCard: '048085005555', phone: '0905456456' },
];

const INITIAL_WITNESSES: Witness[] = [
  { id: 'w1', stt: 1, fullName: 'Trần Văn Cảnh', address: 'Thôn An Trạch', idCard: '048085006666', phone: '0905111333' },
  { id: 'w2', stt: 2, fullName: 'Phan Thị Bích', address: 'Thôn Lệ Sơn 2', idCard: '048085007777', phone: '0905222444' },
];

const INITIAL_CANDIDATES: Candidate[] = [
  // Cấp Quốc hội
  { id: 'qh-1', stt: 1, fullName: 'Nguyễn Đại Đồng', gender: 'Ông', dob: '13/10/1979', electionLevel: 'QUOC_HOI', voteCount: 4, votePercentage: 44.44, votesType3: 3, votesType2: 1, votesType1: 0 },
  { id: 'qh-2', stt: 2, fullName: 'Nguyễn Duy Minh', gender: 'Ông', dob: '26/07/1982', electionLevel: 'QUOC_HOI', voteCount: 4, votePercentage: 44.44, votesType3: 3, votesType2: 1, votesType1: 0 },
  { id: 'qh-3', stt: 3, fullName: 'Lê Ngọc Quang', gender: 'Ông', dob: '21/01/1978', electionLevel: 'QUOC_HOI', voteCount: 3, votePercentage: 33.33, votesType3: 3, votesType2: 0, votesType1: 0 },
  { id: 'qh-4', stt: 4, fullName: 'Đặng Thị Thanh Trà', gender: 'Bà', dob: '20/08/1978', electionLevel: 'QUOC_HOI', voteCount: 6, votePercentage: 66.67, votesType3: 3, votesType2: 2, votesType1: 1 },
  { id: 'qh-5', stt: 5, fullName: 'Phạm Trần Minh Tuyễn', gender: 'Bà', dob: '11/04/1989', electionLevel: 'QUOC_HOI', voteCount: 1, votePercentage: 11.11, votesType3: 0, votesType2: 0, votesType1: 1 },

  // Cấp HĐND Tỉnh
  { id: 'tinh-1', stt: 1, fullName: 'Vũ Quang Hùng', gender: 'Ông', dob: '06/09/1969', electionLevel: 'HDND_TINH', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'tinh-2', stt: 2, fullName: 'Lê Phú Nguyên', gender: 'Ông', dob: '01/01/1978', electionLevel: 'HDND_TINH', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'tinh-3', stt: 3, fullName: 'Nguyễn Thị Phượng', gender: 'Bà', dob: '14/07/1974', electionLevel: 'HDND_TINH', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'tinh-4', stt: 4, fullName: 'Nguyễn Thị Xuân Sang', gender: 'Bà', dob: '22/01/1992', electionLevel: 'HDND_TINH', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'tinh-5', stt: 5, fullName: 'Châu Thị Thu', gender: 'Bà', dob: '01/04/1988', electionLevel: 'HDND_TINH', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },

  // Cấp HĐND Xã (Theo ảnh mẫu Xã Hòa Tiến)
  { id: 'xa-1', stt: 1, fullName: 'BÙI NGỌC ANH', gender: 'Ông', dob: '19/03/1979', electionLevel: 'HDND_XA', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'xa-2', stt: 2, fullName: 'NGUYỄN CƯỜNG', gender: 'Ông', dob: '18/12/1975', electionLevel: 'HDND_XA', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'xa-3', stt: 3, fullName: 'PHẠM ĐIỆP', gender: 'Ông', dob: '25/01/1964', electionLevel: 'HDND_XA', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'xa-4', stt: 4, fullName: 'NGUYỄN NGỌC HẢI', gender: 'Ông', dob: '20/10/1976', electionLevel: 'HDND_XA', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
  { id: 'xa-5', stt: 5, fullName: 'TRẦN HỮU TUYẾT', gender: 'Ông', dob: '20/02/1993', electionLevel: 'HDND_XA', voteCount: 0, votePercentage: 0, votesType3: 0, votesType2: 0, votesType1: 0 },
];

const INITIAL_VOTERS: Voter[] = [];

const STORAGE_KEYS = {
  UNIT: 'app_bau_cu_unit',
  CONFIGS: 'app_bau_cu_configs',
  COMMITTEE: 'app_bau_cu_committee',
  WITNESSES: 'app_bau_cu_witnesses',
  CANDIDATES: 'app_bau_cu_candidates',
  VOTERS: 'app_bau_cu_voters_v2',
  BALLOTS: 'app_bau_cu_ballots_v2',
  SETTINGS: 'app_bau_cu_settings',
};

export function useElectionStore() {
  const [unit, setUnit] = useState<ElectionUnit>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UNIT);
    return saved ? JSON.parse(saved) : INITIAL_UNIT;
  });

  const [configs, setConfigs] = useState<Record<ElectionLevel, ElectionLevelConfig>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIGS);
    return saved ? JSON.parse(saved) : INITIAL_CONFIGS;
  });

  const [committee, setCommittee] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMITTEE);
    return saved ? JSON.parse(saved) : INITIAL_COMMITTEE;
  });

  const [witnesses, setWitnesses] = useState<Witness[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITNESSES);
    return saved ? JSON.parse(saved) : INITIAL_WITNESSES;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [voters, setVoters] = useState<Voter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOTERS);
    return saved ? JSON.parse(saved) : INITIAL_VOTERS;
  });

  const [ballots, setBallots] = useState<BallotRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BALLOTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaultVal: SystemSettings = {
      isLocked: false,
      currentRole: 'ADMIN',
      termName: 'Khóa XVI (2026 - 2031)',
      votingStartTime: '07:00',
      votingEndTime: '19:00',
      votingDate: new Date().toISOString().split('T')[0],
      enableVotingTimeCheck: true,
    };
    return saved ? { ...defaultVal, ...JSON.parse(saved) } : defaultVal;
  });

  // Auto-synchronize totalVoters & numCandidates for each level from real lists
  useEffect(() => {
    const qhVoters = voters.filter(v => v.eligibleQuocHoi !== false).length;
    const tinhVoters = voters.filter(v => v.eligibleHdndTinh !== false).length;
    const xaVoters = voters.filter(v => v.eligibleHdndXa !== false).length;

    const qhCandidates = candidates.filter(c => c.electionLevel === 'QUOC_HOI').length;
    const tinhCandidates = candidates.filter(c => c.electionLevel === 'HDND_TINH').length;
    const xaCandidates = candidates.filter(c => c.electionLevel === 'HDND_XA').length;

    setConfigs(prev => {
      let changed = false;
      const next = { ...prev };

      if (next['QUOC_HOI'].totalVoters !== qhVoters || next['QUOC_HOI'].numCandidates !== qhCandidates) {
        next['QUOC_HOI'] = { ...next['QUOC_HOI'], totalVoters: qhVoters, numCandidates: qhCandidates };
        changed = true;
      }
      if (next['HDND_TINH'].totalVoters !== tinhVoters || next['HDND_TINH'].numCandidates !== tinhCandidates) {
        next['HDND_TINH'] = { ...next['HDND_TINH'], totalVoters: tinhVoters, numCandidates: tinhCandidates };
        changed = true;
      }
      if (next['HDND_XA'].totalVoters !== xaVoters || next['HDND_XA'].numCandidates !== xaCandidates) {
        next['HDND_XA'] = { ...next['HDND_XA'], totalVoters: xaVoters, numCandidates: xaCandidates };
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [voters, candidates]);

  // Synchronize to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNIT, JSON.stringify(unit));
    localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(configs));
    localStorage.setItem(STORAGE_KEYS.COMMITTEE, JSON.stringify(committee));
    localStorage.setItem(STORAGE_KEYS.WITNESSES, JSON.stringify(witnesses));
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
    localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(ballots));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [unit, configs, committee, witnesses, candidates, voters, ballots, settings]);

  // Actions
  const toggleVoterStatus = (voterId: string) => {
    setVoters(prev =>
      prev.map(v => {
        if (v.id === voterId) {
          const nextState = !v.hasVoted;
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          return { ...v, hasVoted: nextState, votedAt: nextState ? timeStr : undefined };
        }
        return v;
      })
    );
  };

  const addBallot = (level: ElectionLevel, inputStruckOut: string) => {
    const levelConfig = configs[level];
    const levelCandidates = candidates.filter(c => c.electionLevel === level);

    const result = calculateBallot(inputStruckOut, levelCandidates, levelConfig);

    const levelBallots = ballots.filter(b => b.electionLevel === level);
    const newBallotIndex = levelBallots.length + 1;

    const numElectedCount = result.isValid ? result.electedCandidates.length : 0;

    const newRecord: BallotRecord = {
      id: `ballot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ballotIndex: newBallotIndex,
      electionLevel: level,
      isValid: result.isValid,
      struckOutNumbers: inputStruckOut,
      struckOutCandidateIds: result.struckOutCandidates.map(c => c.id),
      electedCandidateIds: result.electedCandidates.map(c => c.id),
      numElectedCount,
      createdAt: new Date().toISOString(),
    };

    const updatedBallots = [...ballots, newRecord];
    setBallots(updatedBallots);

    recalculateCandidateVotes(level, updatedBallots, candidates);

    return result;
  };

  const undoLastBallot = (level: ElectionLevel) => {
    const levelBallots = ballots.filter(b => b.electionLevel === level);
    if (levelBallots.length === 0) return;

    const lastBallot = levelBallots[levelBallots.length - 1];
    const updatedBallots = ballots.filter(b => b.id !== lastBallot.id);
    setBallots(updatedBallots);

    recalculateCandidateVotes(level, updatedBallots, candidates);
  };

  const resetBallotsForLevel = (level: ElectionLevel) => {
    const updatedBallots = ballots.filter(b => b.electionLevel !== level);
    setBallots(updatedBallots);

    recalculateCandidateVotes(level, updatedBallots, candidates);
  };

  const recalculateCandidateVotes = (
    level: ElectionLevel,
    currentBallots: BallotRecord[],
    currentCandidates: Candidate[]
  ) => {
    const validLevelBallots = currentBallots.filter(
      b => b.electionLevel === level && b.isValid
    );

    const totalValidBallotsCount = validLevelBallots.length;

    const updatedCandidates = currentCandidates.map(c => {
      if (c.electionLevel !== level) return c;

      const votesBallots = validLevelBallots.filter(b =>
        b.electedCandidateIds.includes(c.id)
      );

      const votes = votesBallots.length;
      const votesType3 = votesBallots.filter(b => b.numElectedCount === 3).length;
      const votesType2 = votesBallots.filter(b => b.numElectedCount === 2).length;
      const votesType1 = votesBallots.filter(b => b.numElectedCount === 1).length;

      const percentage = totalValidBallotsCount > 0
        ? parseFloat(((votes / totalValidBallotsCount) * 100).toFixed(2))
        : 0;

      return {
        ...c,
        voteCount: votes,
        votePercentage: percentage,
        votesType3,
        votesType2,
        votesType1,
      };
    });

    setCandidates(updatedCandidates);
  };

  // CRUD FOR COMMITTEE MEMBERS
  const addCommitteeMember = (member: Omit<CommitteeMember, 'id' | 'stt'>) => {
    const newMember: CommitteeMember = {
      ...member,
      id: `cm-${Date.now()}`,
      stt: committee.length + 1,
    };
    setCommittee([...committee, newMember]);
  };

  const updateCommitteeMember = (updated: CommitteeMember) => {
    setCommittee(committee.map(m => (m.id === updated.id ? updated : m)));
  };

  const deleteCommitteeMember = (id: string) => {
    const filtered = committee.filter(m => m.id !== id);
    const reindexed = filtered.map((m, idx) => ({ ...m, stt: idx + 1 }));
    setCommittee(reindexed);
  };

  // CRUD FOR WITNESSES
  const addWitness = (witness: Omit<Witness, 'id' | 'stt'>) => {
    const newWitness: Witness = {
      ...witness,
      id: `w-${Date.now()}`,
      stt: witnesses.length + 1,
    };
    setWitnesses([...witnesses, newWitness]);
  };

  const updateWitness = (updated: Witness) => {
    setWitnesses(witnesses.map(w => (w.id === updated.id ? updated : w)));
  };

  const deleteWitness = (id: string) => {
    const filtered = witnesses.filter(w => w.id !== id);
    const reindexed = filtered.map((w, idx) => ({ ...w, stt: idx + 1 }));
    setWitnesses(reindexed);
  };

  // CRUD FOR CANDIDATES (3 LEVELS)
  const addCandidate = (candidate: Omit<Candidate, 'id' | 'stt' | 'voteCount' | 'votePercentage'>) => {
    const levelCandidates = candidates.filter(c => c.electionLevel === candidate.electionLevel);
    const nextStt = levelCandidates.length + 1;

    const newCandidate: Candidate = {
      ...candidate,
      id: `cand-${Date.now()}`,
      stt: nextStt,
      voteCount: 0,
      votePercentage: 0,
      votesType3: 0,
      votesType2: 0,
      votesType1: 0,
    };

    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);

    updateLevelConfig(candidate.electionLevel, {
      numCandidates: levelCandidates.length + 1,
    });
  };

  const updateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(candidates.map(c => (c.id === updatedCandidate.id ? updatedCandidate : c)));
  };

  const deleteCandidate = (id: string) => {
    const target = candidates.find(c => c.id === id);
    if (!target) return;

    const remaining = candidates.filter(c => c.id !== id);
    const levelCandidates = remaining.filter(c => c.electionLevel === target.electionLevel);
    const reindexedLevelCandidates = levelCandidates.map((c, idx) => ({ ...c, stt: idx + 1 }));

    const updated = [
      ...remaining.filter(c => c.electionLevel !== target.electionLevel),
      ...reindexedLevelCandidates,
    ];

    setCandidates(updated);

    updateLevelConfig(target.electionLevel, {
      numCandidates: reindexedLevelCandidates.length,
    });
  };

  // CRUD FOR VOTERS
  const addVoter = (newVoter: Omit<Voter, 'id' | 'stt'>) => {
    setVoters(prev => {
      const nextStt = prev.length + 1;
      const item: Voter = {
        ...newVoter,
        id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        stt: nextStt,
      };
      return [...prev, item];
    });
  };

  const updateVoter = (updated: Voter) => {
    setVoters(prev => prev.map(v => (v.id === updated.id ? updated : v)));
  };

  const deleteVoter = (id: string) => {
    setVoters(prev => {
      const filtered = prev.filter(v => v.id !== id);
      return filtered.map((v, idx) => ({ ...v, stt: idx + 1 }));
    });
  };

  const clearAllVoters = () => {
    setVoters([]);
  };

  // BATCH IMPORT EXCEL VOTERS
  const importVotersBatch = (newVotersList: Omit<Voter, 'id' | 'stt'>[]) => {
    setVoters(prev => {
      let currentStt = prev.length + 1;
      const items: Voter[] = newVotersList.map(v => ({
        ...v,
        id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        stt: currentStt++,
      }));
      return [...prev, ...items];
    });
  };

  const updateUnit = (newUnit: ElectionUnit) => {
    setUnit(newUnit);
  };

  const updateLevelConfig = (level: ElectionLevel, newConfig: Partial<ElectionLevelConfig>) => {
    setConfigs({
      ...configs,
      [level]: { ...configs[level], ...newConfig },
    });
  };

  return {
    unit,
    configs,
    committee,
    witnesses,
    candidates,
    voters,
    ballots,
    settings,
    setSettings,
    toggleVoterStatus,
    addBallot,
    undoLastBallot,
    resetBallotsForLevel,
    addVoter,
    updateVoter,
    deleteVoter,
    clearAllVoters,
    importVotersBatch,
    addCommitteeMember,
    updateCommitteeMember,
    deleteCommitteeMember,
    addWitness,
    updateWitness,
    deleteWitness,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    updateUnit,
    updateLevelConfig,
    setCommittee,
    setWitnesses,
  };
}
