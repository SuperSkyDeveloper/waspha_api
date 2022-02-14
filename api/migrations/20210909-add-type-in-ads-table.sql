ALTER TABLE ads
ADD COLUMN `type` VARCHAR(20) DEFAULT 'popup_ad'  AFTER `country_id`;

