import { Candidate, CommitteeMember, ElectionLevelConfig, ElectionUnit } from '../types';

export function generatePrintProtocol(
  unit: ElectionUnit,
  config: ElectionLevelConfig,
  candidates: Candidate[],
  committeeMembers: CommitteeMember[],
  validBallotsCount: number,
  invalidBallotsCount: number
) {
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>BIÊN BẢN KIỂM PHIẾU BẦU CỬ - ${config.levelName}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.4; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-weight: bold; font-size: 15pt; text-transform: uppercase; margin-top: 10px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { border: 1px solid black; padding: 6px 8px; text-align: left; }
        .table th { font-weight: bold; text-align: center; background-color: #f2f2f2; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .signature-box { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
        .signature-item { width: 30%; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer;">🖨️ In Biên Bản / LƯU PDF</button>
      </div>

      <div class="header">
        <div><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></div>
        <div><strong>Độc lập - Tự do - Hạnh phúc</strong></div>
        <div style="margin-top: 10px;">---------------</div>
        <div class="title">BIÊN BẢN KIỂM PHIẾU BẦU CỬ</div>
        <div><strong>${config.levelName.toUpperCase()}</strong></div>
        <div>Khóa ${unit.term} - Khu vực bỏ phiếu số ${unit.votingAreaNo}, ${unit.wardName}, ${unit.province}</div>
      </div>

      <p>Hôm nay, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}, Tổ bầu cử số ${unit.votingAreaNo} đã tiến hành kiểm phiếu bầu cử ${config.levelName}.</p>

      <h3>I. THÔNG TIN CHUNG TỔ BẦU CỬ</h3>
      <ul>
        <li>Tổng số cử tri của khu vực bỏ phiếu: <strong>${config.totalVoters}</strong> cử tri.</li>
        <li>Số phiếu bầu Tổ bầu cử nhận vào: <strong>${config.ballotsReceived}</strong> phiếu.</li>
        <li>Số phiếu bầu Tổ bầu cử phát ra: <strong>${config.ballotsIssued}</strong> phiếu.</li>
        <li>Số phiếu thu vào (số cử tri đã đi bầu): <strong>${config.ballotsReturned}</strong> phiếu (Tỷ lệ: ${(config.totalVoters ? ((config.ballotsReturned / config.totalVoters) * 100).toFixed(2) : 0)}%).</li>
        <li>Số phiếu hợp lệ: <strong>${validBallotsCount}</strong> phiếu.</li>
        <li>Số phiếu không hợp lệ: <strong>${invalidBallotsCount}</strong> phiếu.</li>
        <li>Số đại biểu được bầu: <strong>${config.numRepresentatives}</strong> đại biểu.</li>
      </ul>

      <h3>II. KẾT QUẢ KIỂM PHIẾU CHO TỪNG ỨNG CỬ VIÊN</h3>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 50px;">STT</th>
            <th>Họ và tên ứng cử viên</th>
            <th style="width: 80px;">Giới tính</th>
            <th style="width: 100px;">Ngày sinh</th>
            <th style="width: 100px;">Số phiếu bầu</th>
            <th style="width: 90px;">Tỷ lệ %</th>
            <th style="width: 120px;">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${sortedCandidates.map((c, idx) => {
            const isElected = idx < config.numRepresentatives && c.voteCount > 0;
            return `
              <tr>
                <td class="text-center">${c.stt}</td>
                <td><strong>${c.fullName}</strong></td>
                <td class="text-center">${c.gender}</td>
                <td class="text-center">${c.dob}</td>
                <td class="text-center"><strong>${c.voteCount}</strong></td>
                <td class="text-center">${c.votePercentage}%</td>
                <td class="text-center" style="color: ${isElected ? 'green' : 'black'}; font-weight: ${isElected ? 'bold' : 'normal'}">
                  ${isElected ? 'TRÚNG CỬ' : 'Không trúng cử'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <h3>III. THÀNH VIÊN TỔ BẦU CỬ KÝ TÊN</h3>
      <div class="signature-box">
        <div class="signature-item">
          <p><strong>THƯ KÝ</strong></p>
          <br><br><br>
          <p><sup>(Ký, ghi rõ họ tên)</sup></p>
        </div>
        <div class="signature-item">
          <p><strong>ĐẠI DIỆN CỬ TRI CHỨNG KIẾN</strong></p>
          <br><br><br>
          <p><sup>(Ký, ghi rõ họ tên)</sup></p>
        </div>
        <div class="signature-item">
          <p><strong>TỔ TRƯỞNG TỔ BẦU CỬ</strong></p>
          <br><br><br>
          <p><sup>(Ký, ghi rõ họ tên)</sup></p>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
