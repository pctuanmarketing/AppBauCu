# 🇻🇳 HỆ THỐNG PHẦN MỀM KIỂM PHIẾU BẦU CỬ 2026 - 2031 (WEBAPP)
### ✍️ TÁC GIẢ: PHẠM CÔNG TUÂN

Ứng dụng WebApp Kiểm phiếu Bầu cử Đại biểu Quốc hội & Hội đồng Nhân dân các cấp (Nhiệm kỳ 2026 - 2031) được phát triển bởi **Tác giả Phạm Công Tuân**, chuyển đổi hoàn hảo từ phần mềm MS Access Desktop sang nền tảng Web hiện đại, sẵn sàng triển khai trên **Vercel** và **Supabase Cloud**.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Chuẩn 100% Giao diện MS Access thực tế:**
   - Thanh Menu Ribbon 2 tầng chuẩn MS Access (`File`, `1. Dữ liệu Bầu cử`, `2. Kiểm phiếu`, `3. Thống kê kết quả`, `Hệ Thống`, `Trợ giúp`).
   - Cửa sổ "THÔNG TIN ĐƠN VỊ BẦU CỬ" 3 tab (`.:: Đơn vị bầu cử`, `.:: Nhân sự tổ bầu cử`, `.:: Cử tri chứng kiến`).
   - Cửa sổ "DỮ LIỆU BẦU CỬ ĐẠI BIỂU QUỐC HỘI / HĐND".
   - Cửa sổ "KIỂM PHIẾU BẦU CỬ" với **Hiệu ứng Xem trước tô đỏ dòng bị gạch (Live Red Highlight)**.
   - Màn hình "THỐNG KÊ KẾT QUẢ" với **Thanh Progress Bar Gradient** và **Bảng Kiểm tra đối soát 2 bảng**.
2. **Quy trình Tài khoản 3 Bước:** Đăng ký -> Kích hoạt tài khoản (`BAUCU2026`) -> Đăng nhập.
3. **Nhập liệu & Kiểm tra quy tắc Thời gian thực (Realtime Validation):**
   - Nhập siêu nhanh bằng cách gõ chuỗi STT ứng viên bị gạch (Ví dụ: `135` + Enter 2 lần).
   - Tự động đối soát: `Phiếu thu vào = Phiếu hợp lệ + Phiếu không hợp lệ`.
4. **Kết xuất Biên bản Mẫu 18 & Mẫu 23 chuẩn HĐBC:**
   - Tự động tạo file Word (`.docx`) theo đúng mẫu quy định của Hội đồng Bầu cử Quốc gia.
   - Xuất file Excel (`.xlsx`) tổng hợp chi tiết kết quả kiểm phiếu.
5. **Hỗ trợ Supabase Cloud & Chế độ Offline:**
   - Lưu dữ liệu trực tiếp vào Supabase PostgreSQL Cloud khi có mạng.
   - Tự động lưu vào LocalStorage và sao lưu dữ liệu ra file `.json`.

---

## 🚀 HƯỚNG DẪN TRIỂN KHAI LÊN SUPABASE & VERCEL

### Bước 1: Khởi tạo Cơ sở dữ liệu trên Supabase
1. Đăng nhập vào [Supabase Console](https://supabase.com) và tạo dự án mới (`New Project`).
2. Vào mục **SQL Editor** trong bảng điều khiển Supabase.
3. Mở file `supabase_schema.sql` trong dự án này, dán toàn bộ nội dung vào SQL Editor và nhấn **RUN**.
4. Vào **Project Settings > API**, sao chép 2 thông số:
   - `Project URL`
   - `anon public key`

### Bước 2: Triển khai ứng dụng lên Vercel
1. Đẩy mã nguồn này lên GitHub / GitLab của bạn.
2. Đăng nhập vào [Vercel Console](https://vercel.com) và chọn **Add New Project**.
3. Import repository mã nguồn dự án.
4. Tại phần **Environment Variables**, thêm 2 biến môi trường:
   - `VITE_SUPABASE_URL`: (Project URL thu được ở Bước 1)
   - `VITE_SUPABASE_ANON_KEY`: (Anon Key thu được ở Bước 1)
5. Bấm **Deploy**. Sau khoảng 1 phút, ứng dụng của bạn sẽ sẵn sàng hoạt động tại tên miền Vercel (ví dụ: `app-kiem-phieu-2026.vercel.app`).
