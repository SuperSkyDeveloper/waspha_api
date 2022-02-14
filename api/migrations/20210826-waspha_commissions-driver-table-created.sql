CREATE TABLE `waspha_commissions_driver` (

  `createdAt` DATETIME DEFAULT NULL,

  `updatedAt` DATETIME DEFAULT NULL,

  `id` INT(11) NOT NULL AUTO_INCREMENT,

  `country` INT(11) DEFAULT NULL,

  `waspha_fee` DOUBLE DEFAULT 0,
  `waspha_fee_type` VARCHAR(20) DEFAULT 'percentage',
  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;