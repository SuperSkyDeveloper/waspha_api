ALTER TABLE drivers
ADD COLUMN `is_email_verified` TINYINT(1) DEFAULT 1  AFTER `email`,
ADD COLUMN `is_contact_verified` TINYINT(1) DEFAULT 1  AFTER `contact`,
ADD COLUMN `unverified_email` VARCHAR(255) DEFAULT NULL AFTER `total_earning`,
ADD COLUMN `unverified_country_code` VARCHAR(6) DEFAULT NULL AFTER `total_earning`,
ADD COLUMN `unverified_contact` VARCHAR(255) DEFAULT NULL AFTER `total_earning`,
ADD COLUMN `verify_email_otp` double DEFAULT NULL AFTER `total_earning`,
ADD COLUMN `verify_contact_otp` double DEFAULT NULL AFTER `total_earning`;


