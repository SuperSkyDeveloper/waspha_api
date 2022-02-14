CREATE TABLE `ad_restricted_drivers` (
  
  `id` int NOT NULL AUTO_INCREMENT,
  `ad_id` varchar(50) DEFAULT NULL,
  `driver_id` int DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;