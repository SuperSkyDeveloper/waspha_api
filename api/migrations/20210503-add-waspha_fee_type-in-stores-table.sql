ALTER TABLE stores
ADD COLUMN `waspha_fee_pickup_type` VARCHAR(20) DEFAULT 'percentage'  AFTER `waspha_fee_pickup`,
ADD COLUMN `waspha_fee_delivery_type` VARCHAR(20) DEFAULT 'percentage'  AFTER `waspha_fee_delivery`;
