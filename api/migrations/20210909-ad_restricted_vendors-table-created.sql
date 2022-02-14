CREATE TABLE `ad_restricted_vendors` (
  
  `id` int NOT NULL AUTO_INCREMENT,
  `ad_id` varchar(50) DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;