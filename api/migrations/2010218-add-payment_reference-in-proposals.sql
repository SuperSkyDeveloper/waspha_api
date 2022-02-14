ALTER TABLE proposals
ADD COLUMN `payment_reference` VARCHAR(30)  AFTER `payment_method`;