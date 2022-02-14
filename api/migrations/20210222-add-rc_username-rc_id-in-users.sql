ALTER TABLE users 
ADD COLUMN `rc_id` VARCHAR(100)  AFTER `wallet`,
ADD COLUMN `rc_username` VARCHAR(100)  AFTER `rc_id`;