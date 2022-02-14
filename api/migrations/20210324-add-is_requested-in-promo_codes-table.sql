ALTER TABLE promo_codes
ADD COLUMN `is_requested` TINYINT(1) DEFAULT 0  AFTER `promo_code`;
