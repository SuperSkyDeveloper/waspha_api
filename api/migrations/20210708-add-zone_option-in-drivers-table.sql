ALTER TABLE drivers
ADD COLUMN `zone_option` VARCHAR(20) DEFAULT NULL  AFTER `loyalty_points`,
ADD COLUMN `free_zone_radius` DOUBLE DEFAULT NULL  AFTER `loyalty_points`;

