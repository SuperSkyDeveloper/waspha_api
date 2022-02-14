ALTER TABLE proposal_driver
ADD COLUMN `penalty_fee` DOUBLE DEFAULT 0  AFTER `status_id`;

