ALTER TABLE drivers
ADD COLUMN `referred_by` VARCHAR(50) DEFAULT NULL  AFTER `referral_code`;

