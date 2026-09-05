# IPB Robotic Club (IRC) Website

This is a modern, dynamic, and responsive website for the IPB Robotic Club, built with Next.js 14, Tailwind CSS, and Supabase.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase
- **Forms**: Web3Forms

## Prerequisites
- Node.js 18.x or later
- A Supabase account and project
- A Web3Forms access key

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

### 3. Database Setup (Supabase)
1. Go to your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Copy the contents of `supabase/schema.sql` from this project.
4. Paste it into the SQL Editor and click **Run**.
5. This will create all necessary tables, set up Row Level Security (RLS), and insert initial mock data for Site Settings.

### 4. Create an Admin Account
To access the `/admin` dashboard, you need to create a user in Supabase:
1. Go to **Authentication** -> **Users** in your Supabase dashboard.
2. Click **Add User** -> **Create new user**.
3. Provide an email and password (e.g., `admin@example.com` / `securepassword`).
4. You can now use these credentials to log in at `http://localhost:3000/admin/login`.

### 5. Storage Buckets (Optional/Future implementation)
If you are integrating full file upload logic:
1. Go to **Storage** in Supabase.
2. Create a bucket named `images` and make it **Public**.

### 6. Development Server
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `src/app`: Next.js App Router pages (Public and Admin routes).
- `src/components/ui`: Reusable Tailwind UI components.
- `src/components/layout`: Navbar, Footer, and Admin Sidebar.
- `src/lib/supabase`: Supabase SSR client utilities.
- `supabase/schema.sql`: Database schema definition.

## Deployment
This Next.js app can be easily deployed to Vercel:
1. Push the code to GitHub.
2. Import the project in Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
4. Deploy!
