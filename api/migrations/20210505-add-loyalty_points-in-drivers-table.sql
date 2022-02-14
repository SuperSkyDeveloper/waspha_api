ALTER TABLE drivers
ADD COLUMN `loyalty_points` DOUBLE DEFAULT 0  AFTER `delivery_mode_id`;

