ALTER TABLE drivers
ADD COLUMN `is_zone_selected` TINYINT(1) DEFAULT 0  AFTER `zone_option`;

