ALTER TABLE driver_faqs
ADD COLUMN `title_ar` TEXT AFTER `title`,
ADD COLUMN `description_ar` TEXT AFTER `description`;
