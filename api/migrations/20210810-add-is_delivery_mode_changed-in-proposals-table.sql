ALTER TABLE proposals
ADD COLUMN `is_delivery_mode_changed` TINYINT(1) DEFAULT 0  AFTER `delivery_mode_id`;

