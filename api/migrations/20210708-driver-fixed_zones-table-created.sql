CREATE TABLE `driver_fixed_zones` (

  
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  
  `driver_id` INT(11) DEFAULT NULL,  
  `fixed_zone_id` INT(11) DEFAULT NULL,    
  
  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;