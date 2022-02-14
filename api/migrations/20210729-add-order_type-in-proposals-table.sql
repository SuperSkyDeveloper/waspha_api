ALTER TABLE proposals
ADD COLUMN `order_type` VARCHAR(20) DEFAULT 'normal'  AFTER `id`,
ADD COLUMN `pickup_location` TEXT DEFAULT NULL  AFTER `payment_reference`,
ADD COLUMN `delivery_location` TEXT DEFAULT NULL  AFTER `payment_reference`,
ADD COLUMN `package_charges` DOUBLE DEFAULT 0  AFTER `payment_reference`,
ADD COLUMN `waiting_toll` DOUBLE DEFAULT 0 AFTER `payment_reference`,
ADD COLUMN `store_id` INT(11) DEFAULT NULL AFTER `payment_reference`;

