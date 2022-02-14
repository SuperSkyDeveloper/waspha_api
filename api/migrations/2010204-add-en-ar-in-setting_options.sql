ALTER TABLE setting_options
ADD COLUMN `en` TEXT  AFTER `value`,
ADD COLUMN `ar` TEXT AFTER `value`;