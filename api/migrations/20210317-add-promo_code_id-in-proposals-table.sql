ALTER TABLE proposals
ADD COLUMN `promo_code_id` INT(11) DEFAULT NULL  AFTER `delivery_vehicle_id`;
