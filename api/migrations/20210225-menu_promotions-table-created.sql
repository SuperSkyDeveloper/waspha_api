CREATE TABLE `menu_promotions` (

  `createdAt` DATETIME DEFAULT NULL,

  `updatedAt` DATETIME DEFAULT NULL,
  `deletedAt` DATETIME DEFAULT NULL,

  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `type` VARCHAR(255) DEFAULT NULL,
  `expiry_time` DATETIME DEFAULT NULL,
  `extra_data` TEXT,

  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB DEFAULT CHARSET=utf8;