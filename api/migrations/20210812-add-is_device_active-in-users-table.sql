ALTER TABLE users
ADD COLUMN `is_device_active` TINYINT(1) DEFAULT 0  AFTER `id`;

