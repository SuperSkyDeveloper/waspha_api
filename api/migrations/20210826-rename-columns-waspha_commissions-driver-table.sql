ALTER TABLE waspha_commissions_driver 
CHANGE `waspha_fee` `waspha_fee_normal` DOUBLE,
CHANGE `waspha_fee_type` `waspha_fee_type_normal` VARCHAR(20),
ADD COLUMN `waspha_fee_traditional` DOUBLE,
ADD COLUMN `waspha_fee_type_traditional` VARCHAR(20);


