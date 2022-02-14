CREATE TABLE `delivery_vehicle_charges` (

  `createdAt` DATETIME DEFAULT NULL,

  `updatedAt` DATETIME DEFAULT NULL,

  `id` INT(11) NOT NULL AUTO_INCREMENT,

  `country` INT(11) DEFAULT NULL,
  `delivery_vehicle` INT(11) DEFAULT NULL,

  `base_fee` DOUBLE DEFAULT 0,
  `fee_per_minute` DOUBLE DEFAULT 0,
  `fee_per_km` DOUBLE DEFAULT 0,
  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;