# 🗳️ HỆ THỐNG KIỂM PHIẾU & QUẢN LÝ BẦU CỬ ĐIỆN TỬ 3 CẤP (APP BẦU CỬ)

Phần mềm Quản lý Cử tri, Điểm danh Thẻ cử tri, Kiểm phiếu siêu tốc & Xuất Báo cáo Biên bản Bầu cử Điện tử 3 Cấp (Đại biểu Quốc hội, HĐND Cấp Tỉnh, HĐND Cấp Xã) theo chuẩn Luật Bầu cử Quốc gia và thể thức hành chính Nghị định 30/2020/NĐ-CP.

---

## 🌟 TÍNH NĂNG NỔI BẬT

### 1. 👥 Quản lý & Điểm danh Cử tri Trực tiếp (Voter Management)
- **Điểm danh Nhanh qua Thẻ Cử Tri**: Nhập/quét mã thẻ cử tri hoặc STT để thực hiện điểm danh.
- **Thống kê Giới tính & Tỷ lệ**: Tự động tổng hợp số cử tri Nam, Nữ, tỷ lệ cử tri đi bầu theo thời gian thực.
- **Phân rã Cử tri 2 Cấp / 3 Cấp**: Tự động phân định cử tri có quyền bầu cử 2 cấp (Quốc hội & Tỉnh) hoặc 3 cấp (Quốc hội, Tỉnh, Xã).
- **Cấu hình Khung giờ Bỏ phiếu (Voting Time Window & Auto-Lock)**: Cài đặt giờ mở hòm phiếu (mặc định 07:00) và đóng hòm phiếu (mặc định 19:00). Tự động khóa hệ thống nếu ngoài khung giờ (Admin có thể Bật/Tắt).

### 2. 🗳️ Kiểm Phiếu Siêu Tốc & Nhập Theo Lô (Ballot Counting)
- **Nhập Từng Phiếu Siêu Tốc (Single Entry)**: Nhập chuỗi chữ số bị gạch (VD: `134` là ứng viên STT 1, 3, 4 bị gạch phiếu; `0` là phiếu bị loại/không hợp lệ). Phím tắt `Enter 2 lần` nạp phiếu không cần chuột.
- **Nhập Theo Lô Hàng Loạt (Batch Entry Mode)**: Nạp hàng loạt phiếu cùng lựa chọn gạch tên kèm chip chọn nhanh lượng phiếu (`+5, +10, +25, +50, +100`).
- **Thuật toán Cảnh báo STT Không Tồn Tại (Strict STT Validation)**: Tự động phát hiện và khóa nạp phiếu nếu số thứ tự bị gạch vượt ngoài danh sách ứng cử viên cùng cấp.

### 3. 📊 Phân Rã & Tổng Hợp Kết Quả Bầu Cử 3 Cấp (Results Matrix)
- Thống kê chi tiết Ma trận phiếu bầu hợp lệ, phiếu không hợp lệ, lý do loại phiếu.
- Bảng xếp hạng ứng cử viên tự động xác định danh sách trúng cử (`🏆 TRÚNG CỬ`) dựa trên số đại biểu được bầu.

### 4. 📄 Xuất Báo Cáo & Biên Bản Chuẩn Quốc Gia (Report Exporting)
- **Biên bản Mẫu 18-HĐBC**: Biên bản kết quả kiểm phiếu bầu cử Đại biểu HĐND (File Word `.docx`).
- **Nghị quyết Mẫu 23-HĐBC**: Nghị quyết công bố danh sách trúng cử đại biểu HĐND (File Word `.docx`).
- **File Báo cáo Excel (.xlsx)**: Đa tab thống kê cử tri, danh sách ứng cử viên, ma trận phiếu bầu.

### 5. 🛡️ Phân Quyền & Bảo Mật Hệ Thống (System Admin & Security)
- **Phân quyền 3 Vai Trò**: `ADMIN` (Quản trị tối cao), `EDITOR` (Cán bộ kiểm phiếu), `VIEW` (Quan sát viên).
- **Phân công Kiểm phiếu theo Cấp (`assignedLevel`)**: Phân công cán bộ kiểm phiếu riêng biệt theo cấp Quốc hội, HĐND Tỉnh hoặc HĐND Xã.
- **Khôi phục Mật khẩu qua Email/SĐT (OTP Reset)**: Khôi phục mật khẩu bảo mật qua Email hoặc Số điện thoại với mã xác thực OTP 6 chữ số.
- **Chống Tấn Công Dò Mật Khẩu (Anti-Brute-Force Lockout)**: Tạm khóa 30 giây nếu đăng nhập sai 5 lần liên tiếp.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling & Visuals**: TailwindCSS, Vanilla CSS Animation, Lucide React Icons
- **State Management**: Custom React Hooks & Zustand / LocalStorage Persistence
- **Document Exporters**:
  - `docx` & `file-saver`: Xuất biên bản Word (.docx) chuẩn Mẫu 18-HĐBC & 23-HĐBC
  - `xlsx`: Xuất file báo cáo Excel (.xlsx) đa tab
- **Deployment**: Vercel Serverless Hosting

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN (LOCAL SETUP)

### Yêu cầu tiên quyết:
- Node.js (phiên bản 18.x trở lên)
- npm hoặc yarn

### Các bước thực hiện:

1. **Clone repository về máy**:
   ```bash
   git clone https://github.com/pctuanmarketing/AppBauCu.git
   cd AppBauCu
   ```

2. **Cài đặt thư viện phụ thuộc**:
   ```bash
   npm install
   ```

3. **Chạy dự án ở chế độ Development**:
   ```bash
   npm run dev
   ```
   Mở trình duyệt truy cập: `http://localhost:5173`

4. **Kiểm tra biên dịch & Build ứng dụng**:
   ```bash
   npm run build
   ```

5. **Đẩy mã nguồn lên Vercel (Deployment)**:
   ```powershell
   .\deploy_git.ps1
   ```

---

## 🔑 TÀI KHOẢN MẶC ĐỊNH & THỬ NGHIỆM

- **Tài khoản Quản trị Tối cao (Admin)**:
  - **Email**: `pctuanit@gmail.com`
  - **Số điện thoại**: `0916199945`
  - **Mật khẩu**: `123456` *(Có thể dùng chức năng Quên Mật Khẩu OTP để khôi phục)*

---

## 📜 GIẤY PHÉP & TÁC GIẢ

Phát triển bởi **Tổ Bầu Cử An Trạch - Hòa Tiến** & **Phạm Công Tuân**. Tất cả quyền được bảo lưu © 2026.
