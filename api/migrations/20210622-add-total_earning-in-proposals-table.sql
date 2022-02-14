ALTER TABLE proposals
ADD COLUMN `total_earning` DOUBLE DEFAULT 0  AFTER `promo_code_id`;

