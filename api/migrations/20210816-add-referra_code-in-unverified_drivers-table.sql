ALTER TABLE unverified_drivers
ADD COLUMN `referral_code` VARCHAR(50) DEFAULT NULL  AFTER `otp`;

