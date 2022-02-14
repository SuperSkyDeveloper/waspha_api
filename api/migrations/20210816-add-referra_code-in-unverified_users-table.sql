ALTER TABLE unverified_users
ADD COLUMN `referral_code` VARCHAR(50) DEFAULT NULL  AFTER `otp`;

