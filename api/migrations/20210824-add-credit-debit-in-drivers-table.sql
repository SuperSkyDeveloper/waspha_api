ALTER TABLE drivers
ADD COLUMN `credit_amount` DOUBLE DEFAULT 0  AFTER `loyalty_points`,
ADD COLUMN `debit_amount` DOUBLE DEFAULT 0  AFTER `loyalty_points`;

