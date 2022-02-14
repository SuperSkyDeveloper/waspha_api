CREATE TABLE `category_timeouts` (

  `id` INT(11) NOT NULL AUTO_INCREMENT,

  `category` INT(11) DEFAULT NULL,
  `country` INT(11) DEFAULT NULL,

  `expiry_time` DOUBLE DEFAULT 0,
  `unit` VARCHAR(10) DEFAULT 'minutes',  
  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;