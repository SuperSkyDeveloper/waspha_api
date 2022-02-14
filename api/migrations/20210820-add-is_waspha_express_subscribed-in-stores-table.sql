ALTER TABLE stores
ADD COLUMN `is_waspha_express_subscribed` TINYINT(1) DEFAULT 0  AFTER `delivery_range`;

