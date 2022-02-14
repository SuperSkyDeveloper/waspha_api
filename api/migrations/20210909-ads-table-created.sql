CREATE TABLE `ads` (
  
  `id` int NOT NULL AUTO_INCREMENT,
  `country_id` int(11) DEFAULT NULL,  
  `is_requested` TINYINT(1) DEFAULT 0,
  `location` text DEFAULT NULL,
  `radius` double DEFAULT 0,  
  `media` text DEFAULT NULL,  
  `description` text DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,  
  `category_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  `service_modes` varchar(20) DEFAULT NULL,

  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;