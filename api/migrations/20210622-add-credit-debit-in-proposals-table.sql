ALTER TABLE proposals
ADD COLUMN `credit_amount` DOUBLE DEFAULT 0  AFTER `promo_code_id`,
ADD COLUMN `debit_amount` DOUBLE DEFAULT 0  AFTER `promo_code_id`;

