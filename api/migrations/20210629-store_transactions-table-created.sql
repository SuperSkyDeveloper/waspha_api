CREATE TABLE `store_transactions` (

  `createdAt` DATETIME DEFAULT NULL,

  `updatedAt` DATETIME DEFAULT NULL,
  `deletedAt` DATETIME DEFAULT NULL,

  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `store_id` INT(11) NOT NULL,
  `admin_id` INT(11) NOT NULL,
  
  `amount_paid` DOUBLE DEFAULT 0,
  `amount_received` DOUBLE DEFAULT 0, 

  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;