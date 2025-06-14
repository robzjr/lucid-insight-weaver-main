-- Create trigger for referral tracking
create or replace function public.handle_referral_bonus()
returns trigger as $$
begin
  -- Check if this is a new referral bonus
  if NEW.paid_interpretations_remaining = 5 and OLD.paid_interpretations_remaining = 0 then
    -- Update referral count for the referrer
    update user_usage
    set referral_count = coalesce(referral_count, 0) + 1
    where user_id = (
      select referrer_id
      from referrals
      where referred_id = NEW.user_id
      limit 1
    );
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger
drop trigger if exists on_referral_bonus on user_usage;
create trigger on_referral_bonus
  after update on user_usage
  for each row
  execute function public.handle_referral_bonus();

-- Create referrals table if it doesn't exist
create table if not exists public.referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references auth.users(id) on delete cascade,
  referred_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(referred_id)
);

-- Enable RLS on referrals table
alter table public.referrals enable row level security;

-- Create policy to allow users to read their own referrals
create policy "Users can read their own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

-- Create policy to allow the service role to insert referrals
create policy "Service role can insert referrals"
  on public.referrals for insert
  to service_role
  with check (true);
