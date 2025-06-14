-- Create user_usage table if it doesn't exist
create table if not exists user_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  paid_interpretations_remaining integer default 0,
  referral_count integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create unique index on user_id
create unique index if not exists user_usage_user_id_idx on user_usage(user_id);

-- Create RLS policies for user_usage
alter table user_usage enable row level security;

create policy "Users can read their own usage"
  on user_usage for select
  using (auth.uid() = user_id);

create policy "Service role can insert user usage"
  on user_usage for insert
  to service_role
  with check (true);

create policy "Service role can update user usage"
  on user_usage for update
  to service_role
  using (true);

-- Function to increment referral count for referrer
create or replace function increment_referral_count()
returns trigger as $$
begin
  update user_usage
  set referral_count = referral_count + 1
  where user_id = NEW.referrer_id;
  return NEW;
end;
$$ language plpgsql security definer;
