CREATE TABLE `ad_restricted_users` (
  
  `id` int NOT NULL AUTO_INCREMENT,
  `ad_id` varchar(50) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;