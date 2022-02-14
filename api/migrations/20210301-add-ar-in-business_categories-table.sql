ALTER TABLE business_categories 
ADD COLUMN `name_ar` VARCHAR(100) DEFAULT NULL  AFTER `name`,
ADD COLUMN `description_ar` TEXT DEFAULT NULL  AFTER `description`,
ADD COLUMN `image_ar` VARCHAR(150) DEFAULT NULL  AFTER `image`;