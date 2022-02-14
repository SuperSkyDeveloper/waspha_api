ALTER TABLE vendors 
ADD COLUMN `rc_id` VARCHAR(100)  AFTER `loyalty_points`,
ADD COLUMN `rc_username` VARCHAR(100)  AFTER `rc_id`;