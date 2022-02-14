ALTER TABLE drivers 
ADD COLUMN `rc_id` VARCHAR(100)  AFTER `type`,
ADD COLUMN `rc_username` VARCHAR(100)  AFTER `rc_id`;