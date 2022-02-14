CREATE TABLE `waspha_countries` (

  `id` INT(11) NOT NULL AUTO_INCREMENT,

  `country_id` INT(11) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,

  PRIMARY KEY (`id`),

  UNIQUE KEY `id` (`id`)

) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;