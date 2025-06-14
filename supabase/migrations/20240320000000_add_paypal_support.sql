-- Add payment provider and PayPal-specific columns
ALTER TABLE payment_transactions
ADD COLUMN payment_provider TEXT NOT NULL DEFAULT 'paymob',
ADD COLUMN paypal_order_id TEXT,
ADD CONSTRAINT valid_payment_provider CHECK (payment_provider IN ('paymob', 'paypal'));

-- Add index for PayPal order ID
CREATE INDEX idx_payment_transactions_paypal_order_id ON payment_transactions(paypal_order_id);

-- Add comment to explain the payment provider field
COMMENT ON COLUMN payment_transactions.payment_provider IS 'The payment provider used for this transaction (paymob or paypal)';
COMMENT ON COLUMN payment_transactions.paypal_order_id IS 'The PayPal order ID for PayPal transactions'; 