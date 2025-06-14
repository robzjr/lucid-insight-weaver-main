-- Add PayPal support to payment_transactions table
ALTER TABLE payment_transactions
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'paymob' CHECK (payment_provider IN ('paymob', 'paypal')),
ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
ADD COLUMN IF NOT EXISTS amount_cents INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS interpretations_granted INTEGER NOT NULL DEFAULT 0;

-- Add index for PayPal order ID lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_paypal_order_id ON payment_transactions(paypal_order_id);

-- Add comments for new columns
COMMENT ON COLUMN payment_transactions.payment_provider IS 'The payment provider used for this transaction (paymob or paypal)';
COMMENT ON COLUMN payment_transactions.paypal_order_id IS 'The PayPal order ID for PayPal transactions';
COMMENT ON COLUMN payment_transactions.amount_cents IS 'The transaction amount in cents';
COMMENT ON COLUMN payment_transactions.interpretations_granted IS 'Number of dream interpretations granted with this purchase';

-- Migrate existing data
UPDATE payment_transactions
SET amount_cents = amount * 100,
    interpretations_granted = interpretations
WHERE amount_cents = 0;

-- Drop old columns if they exist
ALTER TABLE payment_transactions
DROP COLUMN IF EXISTS amount,
DROP COLUMN IF EXISTS interpretations; 