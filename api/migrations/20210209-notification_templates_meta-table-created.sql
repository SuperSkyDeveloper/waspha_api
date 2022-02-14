
CREATE TABLE `notification_templates_meta` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `notification_template_id` int(11) DEFAULT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `en` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  `updatedAt` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
