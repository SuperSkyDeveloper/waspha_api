ALTER TABLE proposals
ADD COLUMN `old_delivery_fee` DOUBLE DEFAULT 0  AFTER `delivery_fee`;

