-- ====================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR KIỂM PHIẾU BẦU CỬ 2026-2031
-- (Có hệ thống Đăng ký / Đăng nhập / Mã Kích Hoạt)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- BẢNG NGƯỜI DÙNG & TÀI KHOẢN (App Users)
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) DEFAULT '',
    is_activated BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BẢNG MÃ KÍCH HOẠT (Activation Codes)
CREATE TABLE IF NOT EXISTS activation_codes (
    code VARCHAR(50) PRIMARY KEY,
    description VARCHAR(255) DEFAULT 'Mã kích hoạt Tổ kiểm phiếu',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chèn mã kích hoạt mặc định
INSERT INTO activation_codes (code, description) VALUES
('BAUCU2026', 'Mã kích hoạt dùng thử hệ thống kiểm phiếu 2026')
ON CONFLICT (code) DO NOTHING;

-- 1. BẢNG CUỘC BẦU CỬ (Elections)
CREATE TABLE IF NOT EXISTS elections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL DEFAULT 'Bầu cử Đại biểu Quốc hội & HĐND các cấp nhiệm kỳ 2026 - 2031',
    term VARCHAR(50) NOT NULL DEFAULT 'XVI (2026 - 2031)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BẢNG CẤP BẦU CỬ (Councils)
CREATE TABLE IF NOT EXISTS councils (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    report_template VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 1
);

INSERT INTO councils (id, name, short_name, report_template, sort_order) VALUES
('quoc_hoi', 'Đại biểu Quốc hội khóa XVI', 'ĐBQH', 'Mau18', 1),
('hdnd_tinh', 'Đại biểu HĐND cấp Tỉnh/Thành phố', 'HĐND Tỉnh', 'Mau23', 2),
('hdnd_huyen', 'Đại biểu HĐND cấp Huyện/Quận/Thị xã', 'HĐND Huyện', 'Mau23', 3),
('hdnd_xa', 'Đại biểu HĐND cấp Xã/Phường/Thị trấn', 'HĐND Xã', 'Mau23', 4)
ON CONFLICT (id) DO NOTHING;

-- 3. BẢNG ĐƠN VỊ BẦU CỬ (Voting Units)
CREATE TABLE IF NOT EXISTS voting_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_name VARCHAR(255) NOT NULL,
    voting_area VARCHAR(255) NOT NULL,
    province VARCHAR(100) DEFAULT 'Thành phố Đà Nẵng',
    term VARCHAR(50) DEFAULT 'XVI',
    quoc_hoi_unit_no VARCHAR(50) DEFAULT '2',
    quoc_hoi_areas TEXT DEFAULT '',
    hdnd_tinh_unit_no VARCHAR(50) DEFAULT '6',
    hdnd_tinh_areas TEXT DEFAULT '',
    hdnd_xa_unit_no VARCHAR(50) DEFAULT '8',
    hdnd_xa_areas TEXT DEFAULT '',
    total_voters INT NOT NULL DEFAULT 1250,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BẢNG ỨNG CỬ VIÊN (Candidates)
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    council_id VARCHAR(50) REFERENCES councils(id) ON DELETE CASCADE,
    voting_unit_id UUID REFERENCES voting_units(id) ON DELETE CASCADE,
    stt INT NOT NULL DEFAULT 1,
    full_name VARCHAR(255) NOT NULL,
    birth_year INT,
    gender VARCHAR(20) DEFAULT 'Nam',
    current_position VARCHAR(255) DEFAULT '',
    ethnic VARCHAR(50) DEFAULT 'Kinh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. BẢNG SỐ LIỆU KIỂM PHIẾU (Vote Records)
CREATE TABLE IF NOT EXISTS vote_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voting_unit_id UUID REFERENCES voting_units(id) ON DELETE CASCADE,
    council_id VARCHAR(50) REFERENCES councils(id) ON DELETE CASCADE,
    total_voters INT NOT NULL DEFAULT 0,
    voters_voted INT NOT NULL DEFAULT 0,
    ballots_issued INT NOT NULL DEFAULT 0,
    ballots_collected INT NOT NULL DEFAULT 0,
    valid_ballots INT NOT NULL DEFAULT 0,
    invalid_ballots INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(voting_unit_id, council_id)
);

-- 6. BẢNG CHI TIẾT PHIẾU BẦU (Candidate Votes)
CREATE TABLE IF NOT EXISTS candidate_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vote_record_id UUID REFERENCES vote_records(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    vote_count INT NOT NULL DEFAULT 0,
    against_count INT NOT NULL DEFAULT 0,
    is_elected BOOLEAN DEFAULT FALSE,
    UNIQUE(vote_record_id, candidate_id)
);

-- RLS POLICIES
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Users" ON app_users FOR SELECT USING (true);
CREATE POLICY "Public Write Users" ON app_users FOR ALL USING (true);

CREATE POLICY "Public Read Codes" ON activation_codes FOR SELECT USING (true);

CREATE POLICY "Public Read Voting Units" ON voting_units FOR SELECT USING (true);
CREATE POLICY "Public Write Voting Units" ON voting_units FOR ALL USING (true);

CREATE POLICY "Public Read Candidates" ON candidates FOR SELECT USING (true);
CREATE POLICY "Public Write Candidates" ON candidates FOR ALL USING (true);

CREATE POLICY "Public Read Vote Records" ON vote_records FOR SELECT USING (true);
CREATE POLICY "Public Write Vote Records" ON vote_records FOR ALL USING (true);

CREATE POLICY "Public Read Candidate Votes" ON candidate_votes FOR SELECT USING (true);
CREATE POLICY "Public Write Candidate Votes" ON candidate_votes FOR ALL USING (true);
