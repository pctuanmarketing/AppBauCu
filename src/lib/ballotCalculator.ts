import { Candidate, ElectionLevelConfig } from '../types';

export interface BallotValidationResult {
  isValid: boolean;
  struckOutStts: number[];
  electedStts: number[];
  struckOutCandidates: Candidate[];
  electedCandidates: Candidate[];
  reason: string;
}

/**
 * Thuật toán phân tích phiếu bầu theo Luật Bầu cử Việt Nam:
 * 1. Nhập chuỗi số bị gạch (VD: '134' -> các STT 1, 3, 4 bị gạch)
 * 2. Ứng cử viên KHÔNG bị gạch -> Được bầu
 * 3. Phiếu KHÔNG HỢP LỆ khi:
 *    - Gõ '0' (Explicit invalid mark)
 *    - Gạch tên tất cả ứng cử viên (Số người được bầu = 0)
 *    - Bầu nhiều hơn số đại biểu được bầu (Số người được bầu > maxRepresentatives)
 * 4. Phiếu HỢP LỆ khi: 1 <= Số người được bầu <= maxRepresentatives
 */
export function calculateBallot(
  inputStruckOut: string,
  candidates: Candidate[],
  config: ElectionLevelConfig
): BallotValidationResult {
  const cleanInput = inputStruckOut.trim();

  // 1. Nhập '0' -> Đánh dấu không hợp lệ
  if (cleanInput === '0' || cleanInput === '') {
    return {
      isValid: false,
      struckOutStts: [],
      electedStts: [],
      struckOutCandidates: [],
      electedCandidates: [],
      reason: 'Phiếu không hợp lệ do hình thức / bị loại bởi Tổ bầu cử (Gõ 0)',
    };
  }

  // 2. Tách chuỗi chữ số thành danh sách STT bị gạch (VD: '134' hoặc '1, 3, 4' -> [1, 3, 4])
  const rawTokens = cleanInput.split(/[\s,]+/);
  const digits: number[] = [];

  for (const token of rawTokens) {
    if (!token) continue;
    // Nếu token có nhiều chữ số dính nhau (VD: "134"), phân rã thành từng chữ số STT
    if (/^\d+$/.test(token)) {
      if (token.length > 1 && !cleanInput.includes(' ') && !cleanInput.includes(',')) {
        for (const ch of token) {
          digits.push(parseInt(ch, 10));
        }
      } else {
        digits.push(parseInt(token, 10));
      }
    }
  }

  const struckOutStts = Array.from(new Set(digits));

  // Kiểm tra số STT nhập vào có tồn tại trong danh sách ứng cử viên cùng cấp hay không
  const availableStts = candidates.map(c => c.stt);
  const invalidStts = struckOutStts.filter(stt => stt !== 0 && !availableStts.includes(stt));

  if (invalidStts.length > 0) {
    return {
      isValid: false,
      struckOutStts: [],
      electedStts: [],
      struckOutCandidates: [],
      electedCandidates: [],
      reason: `Số thứ tự [${invalidStts.join(', ')}] không tồn tại trong danh sách ${candidates.length} ứng cử viên (Chấp nhận STT từ ${Math.min(...availableStts)} đến ${Math.max(...availableStts)})`,
    };
  }

  // Tìm danh sách ứng cử viên bị gạch & được bầu
  const struckOutCandidates: Candidate[] = [];
  const electedCandidates: Candidate[] = [];
  const electedStts: number[] = [];

  // Sort candidates by STT
  const sortedCandidates = [...candidates].sort((a, b) => a.stt - b.stt);

  for (const candidate of sortedCandidates) {
    if (struckOutStts.includes(candidate.stt)) {
      struckOutCandidates.push(candidate);
    } else {
      electedCandidates.push(candidate);
      electedStts.push(candidate.stt);
    }
  }

  // 3. Kiểm tra tính hợp lệ theo quy định pháp luật bầu cử
  let isValid = true;
  let reason = 'Phiếu hợp lệ';

  if (electedCandidates.length === 0) {
    isValid = false;
    reason = 'Phiếu không hợp lệ: Cử tri đã gạch tên tất cả ứng cử viên (0 người được bầu)';
  } else if (electedCandidates.length > config.numRepresentatives) {
    isValid = false;
    reason = `Phiếu không hợp lệ: Số người được bầu (${electedCandidates.length}) vượt quá số đại biểu được bầu (${config.numRepresentatives})`;
  }

  return {
    isValid,
    struckOutStts,
    electedStts,
    struckOutCandidates,
    electedCandidates,
    reason,
  };
}
