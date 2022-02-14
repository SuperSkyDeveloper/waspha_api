CREATE TABLE `fixed_zone_coordinates` (

  
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  
  `fixed_zone_id` INT(11) DEFAULT NULL,  
  `latitude` DOUBLE DEFAULT 0,
  `longitude` DOUBLE DEFAULT 0,

  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,


  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;