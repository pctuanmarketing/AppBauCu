-- ============================================================
-- SCRIPT KHỞI TẠO DATABASE SUPABASE CHO HỆ THỐNG APP BẦU CỬ
-- ============================================================

-- 1. Bảng Đơn vị & Cấu hình bầu cử (election_units)
CREATE TABLE IF NOT EXISTS election_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province VARCHAR(255) NOT NULL DEFAULT 'Thành phố Đà Nẵng',
  term VARCHAR(50) NOT NULL DEFAULT 'XVI',
  quoc_hoi_unit_no INT DEFAULT 2,
  quoc_hoi_wards TEXT DEFAULT 'Đặc khu Hoàng Sa, Phường An Hải, Phường Sơn Trà...',
  hdnd_tinh_unit_no INT DEFAULT 6,
  hdnd_tinh_wards TEXT DEFAULT 'Xã Hòa Vang, Xã Hòa Tiến, Xã Bà Nà',
  hdnd_xa_unit_no INT DEFAULT 8,
  hdnd_xa_villages TEXT DEFAULT 'Nam Sơn, Lệ Sơn 2, An Trạch',
  voting_area_no INT DEFAULT 21,
  ward_name VARCHAR(255) DEFAULT 'Xã Hòa Tiến',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Cấu hình số lượng đại biểu từng cấp (election_level_configs)
CREATE TABLE IF NOT EXISTS election_level_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_code VARCHAR(50) NOT NULL UNIQUE, -- 'QUOC_HOI', 'HDND_TINH', 'HDND_XA'
  level_name VARCHAR(255) NOT NULL,
  total_voters INT DEFAULT 1369,
  num_candidates INT DEFAULT 5,
  num_representatives INT DEFAULT 3,
  ballots_received INT DEFAULT 1436,
  ballots_issued INT DEFAULT 1369,
  ballots_damaged INT DEFAULT 0,
  ballots_returned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Nhân sự Tổ bầu cử (committee_members)
CREATE TABLE IF NOT EXISTS committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- 'Tổ trưởng', 'Thư ký', 'Ủy viên'
  id_card VARCHAR(20),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Cử tri Chứng kiến (witnesses)
CREATE TABLE IF NOT EXISTS witnesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  id_card VARCHAR(20),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng Ứng cử viên (candidates)
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL, -- 'Nam', 'Nữ', 'Ông', 'Bà'
  dob VARCHAR(50),
  election_level VARCHAR(50) NOT NULL, -- 'QUOC_HOI', 'HDND_TINH', 'HDND_XA'
  vote_count INT DEFAULT 0,
  vote_percentage NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bảng Quản lý Cử tri (voters)
CREATE TABLE IF NOT EXISTS voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt INT NOT NULL,
  voter_card_no VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(10),
  dob VARCHAR(50),
  address VARCHAR(255) NOT NULL, -- Thôn / Tổ
  has_voted BOOLEAN DEFAULT FALSE,
  voted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bảng Nhật ký Kiểm phiếu (ballot_records)
CREATE TABLE IF NOT EXISTS ballot_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ballot_index INT NOT NULL,
  election_level VARCHAR(50) NOT NULL, -- 'QUOC_HOI', 'HDND_TINH', 'HDND_XA'
  is_valid BOOLEAN NOT NULL DEFAULT TRUE,
  struck_out_numbers VARCHAR(50), -- Chuỗi nhập, VD '134' hoặc '0'
  struck_out_candidate_ids JSONB,
  elected_candidate_ids JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bảng Tài khoản & Phân quyền (user_roles)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'EDITOR', -- 'ADMIN', 'EDITOR', 'VIEW'
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT ROW LEVEL SECURITY (RLS) HOẶC CHO PHÉP ANONYMOUS TRONG BẢN DEMO
ALTER TABLE election_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_level_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE witnesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ballot_records ENABLE ROW LEVEL SECURITY;

-- Tạo Policy công khai cho phép SELECT/INSERT/UPDATE (Cho môi trường triển khai nhanh)
CREATE POLICY "Public Read Access" ON election_units FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON election_units FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON election_level_configs FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON election_level_configs FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON committee_members FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON committee_members FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON witnesses FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON witnesses FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON candidates FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON candidates FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON voters FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON voters FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON ballot_records FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON ballot_records FOR ALL USING (true);
