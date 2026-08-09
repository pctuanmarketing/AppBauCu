import { Candidate, CommitteeMember, ElectionLevelConfig, ElectionUnit, Witness } from '../types';

interface ExtendedCandidateStats extends Candidate {
  votesType3?: number;
  votesType2?: number;
  votesType1?: number;
}

export function generatePrintProtocol(
  unit: ElectionUnit,
  config: ElectionLevelConfig,
  candidates: ExtendedCandidateStats[],
  committeeMembers: CommitteeMember[],
  validBallotsCount: number,
  invalidBallotsCount: number,
  witnesses: Witness[] = []
) {
  const isQuocHoi = config.levelCode === 'QUOC_HOI';
  const isTinh = config.levelCode === 'HDND_TINH';
  const mauTitle = isQuocHoi ? 'MẪU SỐ 18-HĐBC' : 'MẪU SỐ 23-HĐBC';

  const levelFullName = isQuocHoi
    ? 'ĐẠI BIỂU QUỐC HỘI KHÓA XVI'
    : isTinh
    ? 'ĐẠI BIỂU HĐND TỈNH / THÀNH PHỐ'
    : 'ĐẠI BIỂU HĐND XÃ / PHƯỜNG / THỊ TRẤN';

  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const totalReturned = validBallotsCount + invalidBallotsCount;
  const turnOutPct = config.totalVoters > 0 ? ((totalReturned / config.totalVoters) * 100).toFixed(2) : '0.00';
  const validPct = totalReturned > 0 ? ((validBallotsCount / totalReturned) * 100).toFixed(2) : '0.00';
  const invalidPct = totalReturned > 0 ? ((invalidBallotsCount / totalReturned) * 100).toFixed(2) : '0.00';

  // Committee members breakdown
  const headMember = committeeMembers.find(m => m.position.toLowerCase().includes('tổ trưởng')) || committeeMembers[0];
  const secMember = committeeMembers.find(m => m.position.toLowerCase().includes('thư ký')) || committeeMembers[1];
  const otherMembers = committeeMembers.filter(m => m !== headMember && m !== secMember);

  // Witness list
  const witnessNames = witnesses.length > 0 ? witnesses.map(w => `${w.fullName} (${w.representedOrg || 'Cử tri'})`).join(', ') : 'Đại diện cử tri nhân dân';

  const currentDate = new Date();
  const dayStr = currentDate.getDate().toString().padStart(2, '0');
  const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = currentDate.getFullYear();

  const docHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="UTF-8">
      <title>BIÊN BẢN KIỂM PHIẾU BẦU CỬ - ${mauTitle}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm 2cm 2cm 2.5cm;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 13pt;
          line-height: 1.4;
          color: #000;
          padding: 10px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        
        .header-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        .header-table td {
          vertical-align: top;
          padding: 2px;
        }
        
        .doc-title {
          font-size: 15pt;
          font-weight: bold;
          text-align: center;
          margin-top: 15px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .doc-subtitle {
          font-size: 13pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 15px;
          text-transform: uppercase;
        }

        .table-data {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 15px;
        }
        .table-data th, .table-data td {
          border: 1px solid black;
          padding: 5px 7px;
          font-size: 12pt;
        }
        .table-data th {
          font-weight: bold;
          text-align: center;
          background-color: #f2f2f2;
        }

        .signature-grid {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }
        .signature-grid td {
          vertical-align: top;
          text-align: center;
          padding: 5px;
        }
        
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; background: #e0f2fe; padding: 12px; border-radius: 8px; border: 1px solid #0284c7; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 13px; font-weight: bold; color: #0369a1;">
          📄 MẪU BÁO CÁO CHÍNH THỨC: ${mauTitle} - BẦU CỬ ${levelFullName}
        </span>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.print()" style="padding: 8px 16px; font-size: 13px; font-weight: bold; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer;">
            🖨️ In Biên Bản / LƯU PDF
          </button>
          <button onclick="downloadWordDoc()" style="padding: 8px 16px; font-size: 13px; font-weight: bold; background: #16a34a; color: white; border: none; border-radius: 6px; cursor: pointer;">
            💾 Tải Tệp Word (.doc)
          </button>
        </div>
      </div>

      <!-- HEADER CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM -->
      <table class="header-table">
        <tr>
          <td style="width: 45%; text-align: center;">
            <div style="font-size: 11pt;">TỔ BẦU CỬ SỐ <strong>${unit.votingAreaNo}</strong></div>
            <div style="font-size: 11pt;"><strong>${unit.wardName.toUpperCase()}</strong></div>
            <div style="font-size: 10pt; font-style: italic;">(${mauTitle})</div>
          </td>
          <td style="width: 55%; text-align: center;">
            <div style="font-size: 12pt;"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></div>
            <div style="font-size: 12pt;"><strong>Độc lập - Tự do - Hạnh phúc</strong></div>
            <div style="font-size: 11pt; margin-top: 2px;">-------------------------</div>
          </td>
        </tr>
      </table>

      <div class="doc-title">BIÊN BẢN KIỂM PHIẾU BẦU CỬ</div>
      <div class="doc-subtitle">${levelFullName}</div>
      <div class="text-center" style="font-style: italic; margin-bottom: 15px;">
        Khu vực bỏ phiếu số ${unit.votingAreaNo}, đơn vị bầu cử: ${unit.hdndXaVillages}<br>
        Thuộc ${unit.wardName}, ${unit.province}
      </div>

      <p style="text-indent: 1cm;">
        Hôm nay, vào lúc 19 giờ 00 phút, ngày ${dayStr} tháng ${monthStr} năm ${yearStr}, Tổ bầu cử số ${unit.votingAreaNo} đã tiến hành kiểm phiếu bầu cử ${levelFullName}.
      </p>

      <div style="font-weight: bold; margin-top: 10px;">I. THÀNH PHẦN TỔ BẦU CỬ GỒM CÓ:</div>
      <ol style="margin-top: 5px; padding-left: 25px;">
        <li>Ông/Bà: <strong>${headMember ? headMember.fullName : '..........................'}</strong> - Chức vụ: Tổ trưởng Tổ bầu cử</li>
        <li>Ông/Bà: <strong>${secMember ? secMember.fullName : '..........................'}</strong> - Chức vụ: Thư ký Tổ bầu cử</li>
        ${otherMembers.map((m, i) => `<li>Ông/Bà: <strong>${m.fullName}</strong> - Ủy viên Tổ bầu cử</li>`).join('')}
        <li>Đại diện cử tri chứng kiến kiểm phiếu: <strong>${witnessNames}</strong></li>
      </ol>

      <div style="font-weight: bold; margin-top: 15px;">II. TÌNH HÌNH CỬ TRI VÀ SỐ PHIẾU BẦU CỬ:</div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 10px;">
        <tr>
          <td style="padding: 3px 0;">1. Tổng số cử tri của khu vực bỏ phiếu:</td>
          <td style="width: 150px; text-align: right;"><strong>${config.totalVoters.toLocaleString('vi-VN')}</strong> cử tri</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">2. Số phiếu bầu cử Tổ bầu cử nhận vào:</td>
          <td style="text-align: right;"><strong>${config.ballotsReceived.toLocaleString('vi-VN')}</strong> phiếu</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">3. Số phiếu bầu cử Tổ bầu cử phát ra:</td>
          <td style="text-align: right;"><strong>${config.ballotsIssued.toLocaleString('vi-VN')}</strong> phiếu</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">4. Số phiếu bầu cử thu vào (Số cử tri đã đi bầu):</td>
          <td style="text-align: right;"><strong>${totalReturned.toLocaleString('vi-VN')}</strong> phiếu (${turnOutPct}%)</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">5. Số phiếu bầu thừa (chưa phát ra) và hỏng:</td>
          <td style="text-align: right;"><strong>${config.ballotsDamaged.toLocaleString('vi-VN')}</strong> phiếu</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">6. Số phiếu bầu hợp lệ:</td>
          <td style="text-align: right;"><strong>${validBallotsCount.toLocaleString('vi-VN')}</strong> phiếu (${validPct}%)</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">7. Số phiếu bầu không hợp lệ:</td>
          <td style="text-align: right;"><strong>${invalidBallotsCount.toLocaleString('vi-VN')}</strong> phiếu (${invalidPct}%)</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">8. Số đại biểu ấn định được bầu:</td>
          <td style="text-align: right;"><strong>${config.numRepresentatives}</strong> đại biểu</td>
        </tr>
      </table>

      <div style="font-weight: bold; margin-top: 15px;">III. KẾT QUẢ KIỂM PHIẾU CHO TỪNG ỨNG CỬ VIÊN:</div>
      <table class="table-data">
        <thead>
          <tr>
            <th style="width: 45px;">STT</th>
            <th>Họ và tên người ứng cử</th>
            <th style="width: 75px;">Giới tính</th>
            <th style="width: 95px;">Ngày sinh</th>
            <th style="width: 100px;">Số phiếu bầu</th>
            <th style="width: 85px;">Tỷ lệ %</th>
            <th style="width: 100px;">Kết quả</th>
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
                <td class="text-center"><strong>${c.voteCount.toLocaleString('vi-VN')}</strong></td>
                <td class="text-center">${c.votePercentage}%</td>
                <td class="text-center" style="font-weight: bold; color: ${isElected ? '#15803d' : '#334155'};">
                  ${isElected ? 'TRÚNG CỬ' : 'Không trúng cử'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="font-weight: bold; margin-top: 15px;">IV. DANH SÁCH NHỮNG NGƯỜI TRÚNG CỬ (Sắp xếp theo thứ tự số phiếu giảm dần):</div>
      <ol style="margin-top: 5px; padding-left: 25px;">
        ${sortedCandidates.slice(0, config.numRepresentatives).map((c, idx) => `
          <li style="margin-bottom: 4px;">
            <strong>${c.fullName}</strong> - Sinh ngày: ${c.dob} - Thu được: <strong>${c.voteCount.toLocaleString('vi-VN')}</strong> phiếu (${c.votePercentage}%)
          </li>
        `).join('')}
      </ol>

      <p style="margin-top: 15px;">
        Biên bản này được lập thành 03 bản, đọc cho toàn thể Tổ bầu cử nghe và cùng thống nhất ký tên dưới đây.
      </p>

      <table class="signature-grid">
        <tr>
          <td style="width: 33%;">
            <strong>THƯ KÝ TỔ BẦU CỬ</strong><br>
            <span style="font-size: 10pt; font-style: italic;">(Ký và ghi rõ họ tên)</span>
            <br><br><br><br>
            <strong>${secMember ? secMember.fullName : '...................................'}</strong>
          </td>
          <td style="width: 33%;">
            <strong>CỬ TRI CHỨNG KIẾN</strong><br>
            <span style="font-size: 10pt; font-style: italic;">(Ký và ghi rõ họ tên)</span>
            <br><br><br><br>
            <strong>${witnesses.length > 0 ? witnesses[0].fullName : '...................................'}</strong>
          </td>
          <td style="width: 34%;">
            <strong>TỔ TRƯỞNG TỔ BẦU CỬ</strong><br>
            <span style="font-size: 10pt; font-style: italic;">(Ký, ghi rõ họ tên và đóng dấu)</span>
            <br><br><br><br>
            <strong>${headMember ? headMember.fullName : '...................................'}</strong>
          </td>
        </tr>
      </table>

      <script>
        function downloadWordDoc() {
          var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>BienBan</title></head><body>";
          var footer = "</body></html>";
          var sourceHTML = header + document.body.innerHTML + footer;
          var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
          var fileDownload = document.createElement("a");
          document.body.appendChild(fileDownload);
          fileDownload.href = source;
          fileDownload.download = '${mauTitle}_${config.levelCode}_${unit.wardName.replace(/\\s+/g, '_')}.doc';
          fileDownload.click();
          document.body.removeChild(fileDownload);
        }
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(docHtml);
    printWindow.document.close();
  }
}
