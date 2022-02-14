ALTER TABLE store_products 
ADD COLUMN `title_ar` VARCHAR(100) DEFAULT NULL  AFTER `title`,
ADD COLUMN `description_ar` TEXT DEFAULT NULL  AFTER `description`,
ADD COLUMN `image_ar` VARCHAR(150) DEFAULT NULL  AFTER `image`;