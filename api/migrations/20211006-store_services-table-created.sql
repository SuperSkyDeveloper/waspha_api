CREATE TABLE `store_services` (

  `id` INT(11) NOT NULL AUTO_INCREMENT,

  `store` INT(11) DEFAULT NULL,  

  `waspha_box` TINYINT(1) DEFAULT 0,  
  `waspha_express` TINYINT(1) DEFAULT 0,  
  `delivery` TINYINT(1) DEFAULT 1,  
  `pickup` TINYINT(1) DEFAULT 1,  
  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;