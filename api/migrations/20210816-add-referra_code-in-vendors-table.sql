ALTER TABLE vendors
ADD COLUMN `referral_code` VARCHAR(50) DEFAULT NULL  AFTER `device_token`;

