-- ============================================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Create the notifications table (if it doesn't exist)
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  type text default 'info', -- info, success, warning, error
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.notifications enable row level security;

-- RLS Policies
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Allow service role (backend) to insert notifications
create policy "Service role can insert notifications"
  on public.notifications for insert
  with check (true);

-- Optional: index for faster queries
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);
