-- Create contacts table for storing contact form submissions
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for security
alter table contacts enable row level security;

-- Allow anyone to insert (since contact form is public)
create policy "Allow public inserts" on contacts
  for insert with check (true);

-- Optionally: Allow admin to view all
create policy "Allow authenticated users to read" on contacts
  for select using (auth.role() = 'authenticated');
