ALTER TABLE vendor_notifications
ADD COLUMN `is_viewed` TINYINT(1) DEFAULT 0  AFTER `is_read`;
