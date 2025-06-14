-- Create a function to process referral in a transaction
create or replace function process_referral_transaction(
  p_referrer_id uuid,
  p_referred_id uuid
) returns void as $$
begin
  -- Add record to referrals table
  insert into referrals (referrer_id, referred_id, status)
  values (p_referrer_id, p_referred_id, 'completed');

  -- Update referrer's stats
  update user_usage
  set paid_interpretations_remaining = paid_interpretations_remaining + 5,
      referral_count = referral_count + 1,
      updated_at = now()
  where user_id = p_referrer_id;

  -- Update referred user's stats
  update user_usage
  set paid_interpretations_remaining = paid_interpretations_remaining + 5,
      updated_at = now()
  where user_id = p_referred_id;
end;
$$ language plpgsql;
