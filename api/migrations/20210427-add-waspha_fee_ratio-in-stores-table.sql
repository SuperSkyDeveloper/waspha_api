ALTER TABLE stores
ADD COLUMN `waspha_fee_ratio` DOUBLE DEFAULT 5  AFTER `proposal_selection_time`;
