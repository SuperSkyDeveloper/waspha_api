ALTER TABLE promo_codes
ADD COLUMN `apply_on` VARCHAR(50) DEFAULT 'subtotal'  AFTER `service_modes`;
