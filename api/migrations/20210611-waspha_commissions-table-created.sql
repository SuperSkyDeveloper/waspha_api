CREATE TABLE `waspha_commissions` (

  `createdAt` DATETIME DEFAULT NULL,

  `updatedAt` DATETIME DEFAULT NULL,

  `id` INT(11) NOT NULL AUTO_INCREMENT,

  `country` INT(11) DEFAULT NULL,

  `waspha_fee_delivery` DOUBLE DEFAULT 0,
  `waspha_fee_delivery_type` VARCHAR(20) DEFAULT 'percentage',
  `waspha_fee_pickup` DOUBLE DEFAULT 0,  
  `waspha_fee_pickup_type` VARCHAR(20) DEFAULT 'percentage',

  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;