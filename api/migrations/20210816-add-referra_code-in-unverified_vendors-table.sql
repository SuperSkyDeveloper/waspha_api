ALTER TABLE unverified_vendors
ADD COLUMN `referral_code` VARCHAR(50) DEFAULT NULL  AFTER `otp`;

