-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_images
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url VARCHAR(512) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: team_members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(512),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  year INTEGER,
  description TEXT,
  image_url VARCHAR(512),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  tier VARCHAR(100) DEFAULT 'Previous',
  logo_url VARCHAR(512) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: galleries
CREATE TABLE IF NOT EXISTS galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  image_url VARCHAR(512) NOT NULL,
  caption VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_site_settings_modtime BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_team_members_modtime BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_achievements_modtime BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_sponsors_modtime BEFORE UPDATE ON sponsors FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_galleries_modtime BEFORE UPDATE ON galleries FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- RLS (Row Level Security)
-- 1. Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies for Public (Read-Only)
-- Everyone can select (read)
CREATE POLICY "Public profiles are viewable by everyone." ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone." ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public project images viewable by everyone." ON project_images FOR SELECT USING (true);
CREATE POLICY "Public team members viewable by everyone." ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public achievements viewable by everyone." ON achievements FOR SELECT USING (true);
CREATE POLICY "Public sponsors viewable by everyone." ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public galleries viewable by everyone." ON galleries FOR SELECT USING (true);
CREATE POLICY "Public gallery images viewable by everyone." ON gallery_images FOR SELECT USING (true);

-- 3. Create Policies for Authenticated Admin (CRUD)
-- Only authenticated users (admins) can modify data
-- Site Settings
CREATE POLICY "Admins can insert site_settings." ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update site_settings." ON site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete site_settings." ON site_settings FOR DELETE TO authenticated USING (true);

-- Projects
CREATE POLICY "Admins can insert projects." ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update projects." ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete projects." ON projects FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admins can insert project_images." ON project_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update project_images." ON project_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete project_images." ON project_images FOR DELETE TO authenticated USING (true);

-- Team Members
CREATE POLICY "Admins can insert team_members." ON team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update team_members." ON team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete team_members." ON team_members FOR DELETE TO authenticated USING (true);

-- Achievements
CREATE POLICY "Admins can insert achievements." ON achievements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update achievements." ON achievements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete achievements." ON achievements FOR DELETE TO authenticated USING (true);

-- Sponsors
CREATE POLICY "Admins can insert sponsors." ON sponsors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update sponsors." ON sponsors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete sponsors." ON sponsors FOR DELETE TO authenticated USING (true);

-- Galleries
CREATE POLICY "Admins can insert galleries." ON galleries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update galleries." ON galleries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete galleries." ON galleries FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admins can insert gallery_images." ON gallery_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update gallery_images." ON gallery_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete gallery_images." ON gallery_images FOR DELETE TO authenticated USING (true);

-- Initial Data for Site Settings
INSERT INTO site_settings (key, value) VALUES
('hero_title', 'Satu Jiwa, Kita Bisa!'),
('hero_subtitle', 'Empowered by Innovation'),
('about_description', 'IPB Robotic Club (IRC) is a functional organization under the mentoring of Directorate of Student Affairs (Ditmawa) IPB University through the Subdirectorate Development of Student Reputation and Achievement, also known as IPB Prestasi. IRC is a place for student competencies development in robotics, technology, and innovation fields, as well as strategic steps in supporting robotics research at IPB University.'),
('contact_address', 'Robotics Lab, Advanced Research Laboratory, Jl. Palem, IPB Dramaga Campus, Bogor 16680, Indonesia'),
('contact_email', 'ipbrobotic@apps.ipb.ac.id'),
('contact_instagram', '@irc.ipb'),
('contact_tiktok', '@ircipb'),
('contact_linkedin', 'IPB Robotic Club'),
('sponsor_bank_account', 'Bank BNI a/n Rektor IPB qc Kegiatan Kemahasiswaan IPB 138580960')
ON CONFLICT (key) DO NOTHING;
