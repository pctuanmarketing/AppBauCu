import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { Candidate, Council, VoteRecord, VotingUnit, CandidateVote } from '../types';

export const exportDocxReport = async (
  council: Council,
  unit: VotingUnit,
  record: VoteRecord,
  candidates: Candidate[],
  candidateVotes: CandidateVote[]
) => {
  const isMau18 = council.reportTemplate === 'Mau18';
  const docTitle = isMau18
    ? 'BIÊN BẢN XÁC ĐỊNH KẾT QUẢ BẦU CỬ ĐẠI BIỂU QUỐC HỘI KHÓA XVI'
    : `BIÊN BẢN XÁC ĐỊNH KẾT QUẢ BẦU CỬ ĐẠI BIỂU HỘI ĐỒNG NHÂN DÂN ${council.name.toUpperCase()}`;

  const mauText = isMau18 ? 'Mẫu số 18/HĐBC' : 'Mẫu số 23/HĐBC-HĐND';

  const rows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: 'STT', alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: 'Họ và tên ứng cử viên', alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: 'Số phiếu bầu (Đồng ý)', alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: 'Tỷ lệ (%)', alignment: AlignmentType.CENTER })] }),
      ]
    }),
    ...candidates.map((c, idx) => {
      const v = candidateVotes.find(vote => vote.candidateId === c.id);
      const voteCount = v ? v.voteCount : 0;
      const percent = record.validBallots > 0 ? ((voteCount / record.validBallots) * 100).toFixed(2) : '0.00';
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: `${idx + 1}`, alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: c.fullName })] }),
          new TableCell({ children: [new Paragraph({ text: `${voteCount.toLocaleString('vi-VN')} phiếu`, alignment: AlignmentType.RIGHT })] }),
          new TableCell({ children: [new Paragraph({ text: `${percent}%`, alignment: AlignmentType.RIGHT })] }),
        ]
      });
    })
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: mauText, italic: true, bold: true, size: 22 })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n', bold: true, size: 26 }),
              new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc\n\n', bold: true, underline: {}, size: 24 })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${docTitle}\n`, bold: true, size: 28 }),
              new TextRun({ text: `Tại Khu vực bỏ phiếu: ${unit.votingArea}\n`, italic: true, size: 24 }),
              new TextRun({ text: `Thuộc ${unit.commune}, ${unit.district}, ${unit.province}\n\n`, italic: true, size: 24 })
            ]
          }),

          new Paragraph({ text: '1. SỐ LIỆU TỔNG HỢP CỬ TRI VÀ PHIẾU BẦU:', bold: true, size: 24 }),
          new Paragraph({ text: `- Tổng số cử tri của khu vực bỏ phiếu: ${record.totalVoters.toLocaleString('vi-VN')} cử tri.` }),
          new Paragraph({ text: `- Số cử tri đã tham gia bỏ phiếu: ${record.votersVoted.toLocaleString('vi-VN')} cử tri (${((record.votersVoted / (record.totalVoters || 1)) * 100).toFixed(2)}%).` }),
          new Paragraph({ text: `- Số phiếu phát ra: ${record.ballotsIssued.toLocaleString('vi-VN')} phiếu.` }),
          new Paragraph({ text: `- Số phiếu thu vào: ${record.ballotsCollected.toLocaleString('vi-VN')} phiếu.` }),
          new Paragraph({ text: `- Số phiếu hợp lệ: ${record.validBallots.toLocaleString('vi-VN')} phiếu.` }),
          new Paragraph({ text: `- Số phiếu không hợp lệ: ${record.invalidBallots.toLocaleString('vi-VN')} phiếu.` }),
          new Paragraph({ text: '\n2. KẾT QUẢ PHIẾU BẦU CHO TỪNG ỨNG CỬ VIÊN:', bold: true, size: 24 }),

          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ text: '\n3. GHI CHÚ VÀ XÁC NHẬN:', bold: true, size: 24 }),
          new Paragraph({ text: record.notes || 'Biên bản đã được các thành viên Tổ kiểm phiếu thống nhất nghiệm thu.' }),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `\nLập ngày ..... tháng ..... năm 2026\n`, italic: true }),
              new TextRun({ text: 'TỔ TRƯỞNG TỔ KIỂM PHIẾU\n', bold: true }),
              new TextRun({ text: '(Ký, ghi rõ họ tên)\n\n\n', italic: true })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${isMau18 ? 'Mau18_BienBan_DBQH' : 'Mau23_BienBan_HDND'}_${council.id}.docx`);
};
