# 📋 Baki Khata (বাকি খাতা) - Digital Ledger SaaS

A modern, multi-user SaaS application for shopkeepers to track customer dues ("Baki") digitally. Built with **Next.js** and **Supabase**, this platform ensures data security and isolation for every shop owner.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Key Features

- **🔐 Secure Authentication**: Standard Email/Password login powered by Supabase Auth.
- **🏢 Multi-User SaaS**: Every user gets their own private dashboard. Data is strictly isolated using Row Level Security (RLS).
- **☁️ Cloud Sync**: Data is stored securely in the cloud, accessible from any device.
- **💸 Transaction Tracking**: Record dues, mark as paid, and view transaction history.
- **📊 Smart Summaries**: Dashboard insights on Total Dues, Total Collected, and Active Customers.
- **📱 Responsive Design**: Works perfectly on Mobile, Tablet, and Desktop.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Rakibulislam-emon/BakiKhata.git
cd BakiKhata
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to set up the table and security:

```sql
-- 1. Create Table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  amount numeric not null,
  is_paid boolean default false,
  date text not null,
  notes text,
  is_hidden_from_recent boolean default false,
  user_id uuid references auth.users(id) default auth.uid()
);

-- 2. Enable Security
alter table public.transactions enable row level security;

-- 3. Create Security Policies (RLS)
create policy "Users can view their own transactions"
on public.transactions for select using ( auth.uid() = user_id );

create policy "Users can insert their own transactions"
on public.transactions for insert with check ( auth.uid() = user_id );

create policy "Users can update their own transactions"
on public.transactions for update using ( auth.uid() = user_id );

create policy "Users can delete their own transactions"
on public.transactions for delete using ( auth.uid() = user_id );
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🖼️ Screenshots

_Add your screenshots here_

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
