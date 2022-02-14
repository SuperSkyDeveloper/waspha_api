
/*Table structure for table `admin_country` */

DROP TABLE IF EXISTS `admin_country`;

CREATE TABLE `admin_country` (
  `id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `admin_country` */

/*Table structure for table `admins` */

DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `contact` (`contact`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `admins` */

insert  into `admins`(`createdAt`,`updatedAt`,`id`,`name`,`email`,`contact`,`password`,`language`,`deletedAt`,`role_id`) values 
('2020-09-10 18:41:15','2020-09-10 18:41:11',1,'Super Admin','admin@mail.com','12345654','$2a$12$wqKW2g7dF2W/nc8tkgiLSuwLCFQJCPQ5SqAU3qUlo7RrwAxgcHLUa','en',NULL,11);

/*Table structure for table `archive` */

DROP TABLE IF EXISTS `archive`;

CREATE TABLE `archive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` bigint(20) DEFAULT NULL,
  `fromModel` varchar(255) DEFAULT NULL,
  `originalRecord` longtext,
  `originalRecordId` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `archive` */

/*Table structure for table `business_categories` */

DROP TABLE IF EXISTS `business_categories`;

CREATE TABLE `business_categories` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `deletedAt` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

/*Data for the table `business_categories` */

insert  into `business_categories`(`createdAt`,`updatedAt`,`id`,`parent_id`,`name`,`slug`,`image`,`description`,`deletedAt`,`store_id`) values 
('2021-01-14 14:47:14','2021-01-14 14:47:14',10,NULL,'Fast food',NULL,'https://waspha.s3.amazonaws.com/categories/UwxbMiDEli.png','Amazing food ',NULL,8),
('2021-01-14 14:50:53','2021-01-14 14:50:53',11,NULL,'Soft Drinks',NULL,'https://waspha.s3.amazonaws.com/categories/UAFrcCqDEr.png','Drinks',NULL,8),
('2021-01-14 16:40:21','2021-01-14 16:40:21',12,NULL,'Grocery',NULL,'https://waspha.s3.amazonaws.com/categories/pqfFu7gGVK.png','All Grocery items are available here ',NULL,11),
('2021-01-14 16:42:12','2021-01-14 16:42:12',13,NULL,'Electronics ',NULL,'https://waspha.s3.amazonaws.com/categories/eRtqDYGcDN.png','All Electronics items are available here.',NULL,11),
('2021-01-14 16:47:06','2021-01-14 16:47:06',14,12,'Oil',NULL,'https://waspha.s3.amazonaws.com/categories/7kf8yPKFKL.png','Cooking Oil',NULL,11),
('2021-01-14 16:49:02','2021-01-14 16:49:02',15,12,'Dairy Products',NULL,'https://waspha.s3.amazonaws.com/categories/pV9mEg4fVM.png','Dairy products',NULL,11),
('2021-01-14 16:51:29','2021-01-14 16:51:29',16,NULL,'Fragrance',NULL,'https://waspha.s3.amazonaws.com/categories/lhG8PzZTjA.png','All Fragrance ',NULL,11),
('2021-01-14 17:14:03','2021-01-14 17:14:03',17,12,'Vegetables ',NULL,'https://waspha.s3.amazonaws.com/categories/UlxlYNW6Uh.png','All Fresh Vegetables',NULL,11),
('2021-01-15 07:00:32','2021-01-15 07:00:32',18,NULL,'Medicine ',NULL,'https://waspha.s3.amazonaws.com/categories/2jRGUSsaVL.png','prescribed medicines ',NULL,10);

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=latin1;

/*Data for the table `categories` */

insert  into `categories`(`createdAt`,`updatedAt`,`id`,`parent_id`,`name`,`slug`,`image`,`description`,`deletedAt`) values 
('2020-09-08 15:39:06','2020-09-16 14:13:37',1,NULL,'Pharmacy','pharmacy','https://waspha.s3.amazonaws.com/categories/Zs1Go6vrGH.png','Pharmacy is the clinical health science that links medical science with chemistry and it is charged with the discovery, production, disposal, safe and effective use, and control of medications and drugs.',NULL),
('2020-09-08 18:17:03','2020-09-16 14:14:27',2,NULL,'Cosmetics','cosmetics','https://waspha.s3.amazonaws.com/categories/mNbxjB1byl.png','Cosmetics are products you apply to your body to clean it, make it more attractive, or change the way it looks.',NULL),
('2020-09-08 18:17:29','2020-09-16 14:15:04',3,NULL,'Food','food','https://waspha.s3.amazonaws.com/categories/g4ztTlN1ed.png','Never tasteless, disgusting, or nauseating. Delicious meals are tasty, appetizing, scrumptious, yummy, luscious, delectable, mouth-watering, fit for a king, delightful, lovely, wonderful, pleasant, enjoyable, appealing, enchanting, charming. You wouldn\'t call delicious that what is tasteless or unpleasant',NULL),
('2020-09-08 18:20:29','2021-01-14 14:25:05',4,NULL,'General','general','https://waspha.s3.amazonaws.com/categories/Yt9jABlOMg.png','General Categories',NULL),
('2021-01-14 14:22:54','2021-01-14 14:22:54',84,1,' Medicine','medicine','https://waspha.s3.amazonaws.com/categories/DZ2P6DLo3o.png',NULL,NULL),
('2021-01-14 14:26:29','2021-01-14 14:26:29',85,3,'Drinks','drinks','https://waspha.s3.amazonaws.com/categories/Tgp0sqhPle.png',NULL,NULL),
('2021-01-14 14:27:11','2021-01-14 14:27:11',86,2,'Skin care','skin_care','https://waspha.s3.amazonaws.com/categories/kDVPxLeuio.png',NULL,NULL),
('2021-01-14 14:27:50','2021-01-14 14:27:50',87,4,'Bakery','bakery','https://waspha.s3.amazonaws.com/categories/xhwW8NkhOi.png',NULL,NULL),
('2021-01-18 20:23:57','2021-01-18 20:23:57',88,NULL,'ac','ac','https://waspha.s3.amazonaws.com/categories/Ea6nN67Jn7.png','aaa',NULL);

/*Table structure for table `contact_us` */

DROP TABLE IF EXISTS `contact_us`;

CREATE TABLE `contact_us` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` double DEFAULT NULL,
  `user_role` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `contact_us` */

/*Table structure for table `countries` */

DROP TABLE IF EXISTS `countries`;

CREATE TABLE `countries` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_code` varchar(255) DEFAULT NULL,
  `en` varchar(255) DEFAULT NULL,
  `ar` varchar(255) DEFAULT NULL,
  `currency_code` varchar(255) DEFAULT NULL,
  `dial_code` varchar(255) DEFAULT NULL,
  `flag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=latin1;

/*Data for the table `countries` */

insert  into `countries`(`createdAt`,`updatedAt`,`id`,`country_code`,`en`,`ar`,`currency_code`,`dial_code`,`flag`) values 
('2020-08-18 16:01:39','2020-12-21 17:48:04',1,'AF','Afghanistan','?????????','AFN','+93','https://hadhir.s3.amazonaws.com/countries/NFfj3sar0H.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:04',2,'AL','Albania','???????','ALL','+355','https://hadhir.s3.amazonaws.com/countries/LP3tHKAoVf.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:04',3,'DZ','Algeria','???????','DZD','+213','https://hadhir.s3.amazonaws.com/countries/fgliy9h1Ce.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:04',4,'AD','Andorra','??????','EUR','+376','https://hadhir.s3.amazonaws.com/countries/DFfvOsqjak.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:04',5,'AO','Angola','??????','AOA','+244','https://hadhir.s3.amazonaws.com/countries/7T9Z7vSEeX.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:04',6,'AG','Antigua and Barbuda','??????? ????????','XCD','+1268','https://hadhir.s3.amazonaws.com/countries/YCG7hwmtl3.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:04',7,'AR','Argentina','?????????','ARS','+54','https://hadhir.s3.amazonaws.com/countries/8m6JITXH3T.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',8,'AM','Armenia','???????','AMD','+374','https://hadhir.s3.amazonaws.com/countries/wjFmREfx0C.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',9,'AU','Australia','????????','AUD','+61','https://hadhir.s3.amazonaws.com/countries/n9zASlEFq5.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',10,'AT','Austria','??????','EUR','+43','https://hadhir.s3.amazonaws.com/countries/KmD0duZ1Sd.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',11,'AZ','Azerbaijan','????????','AZN','+994','https://hadhir.s3.amazonaws.com/countries/ce6yXXM1IM.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',12,'BS','Bahamas','???????','BSD','+1 242','https://hadhir.s3.amazonaws.com/countries/LHcw3opv6f.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',13,'BH','Bahrain','???????','BHD','+973','https://hadhir.s3.amazonaws.com/countries/1xQTBLvRbc.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',14,'BD','Bangladesh','????????','BDT','+880','https://hadhir.s3.amazonaws.com/countries/Vdk6ADgtYy.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',15,'BB','Barbados','????????','BBD','+1 246','https://hadhir.s3.amazonaws.com/countries/e1xnSPSF9E.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',16,'BY','Belarus','????? ???????','BYR','+375','https://hadhir.s3.amazonaws.com/countries/eEL8EPMUFm.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',17,'BE','Belgium','??????','EUR','+32','https://hadhir.s3.amazonaws.com/countries/QqXCO4AQnD.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',18,'BZ','Belize','????','BZD','+501','https://hadhir.s3.amazonaws.com/countries/NvHDPm3zhd.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',19,'BJ','Benin','????','XOF','+229','https://hadhir.s3.amazonaws.com/countries/71HstdAyBg.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',20,'BT','Bhutan','?????','BTN','+975','https://hadhir.s3.amazonaws.com/countries/XLqh0GFyOW.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',21,'BO','Bolivia (Plurinational State of)','???????','BOB','+591','https://hadhir.s3.amazonaws.com/countries/LIWYyNxqan.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',22,'BA','Bosnia and Herzegovina','??????? ???????','BAM','+387','https://hadhir.s3.amazonaws.com/countries/aGVQwZ3Fu5.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',23,'BW','Botswana','????????','BWP','+267','https://hadhir.s3.amazonaws.com/countries/gwaBNG8rDl.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',24,'BR','Brazil','????????','BRL','+55','https://hadhir.s3.amazonaws.com/countries/CMzHKHs4Bd.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',25,'BN','Brunei Darussalam','??????','BND','+673','https://hadhir.s3.amazonaws.com/countries/vTFZnahCkO.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',26,'BG','Bulgaria','???????','BGN','+359','https://hadhir.s3.amazonaws.com/countries/1po4KOb7YN.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',27,'BF','Burkina Faso','??????? ????','XOF','+226','https://hadhir.s3.amazonaws.com/countries/e9UENjk9WK.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',28,'BI','Burundi','???????','BIF','+257','https://hadhir.s3.amazonaws.com/countries/toFkW24FuO.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',29,'CV','Cabo Verde','???????','CVE','+238','https://hadhir.s3.amazonaws.com/countries/In975HdTRN.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',30,'KH','Cambodia','?????????','KHR','+855','https://hadhir.s3.amazonaws.com/countries/vA4AbLzxQ4.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:05',31,'CM','Cameroon','????','XAF','+237','https://hadhir.s3.amazonaws.com/countries/XkoGopvapZ.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',32,'CA','Canada','????? ??????','CAD','+1','https://hadhir.s3.amazonaws.com/countries/LJKVaKzAXe.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',33,'CF','Central African Republic','??????? ??????? ??????','XAF','+236','https://hadhir.s3.amazonaws.com/countries/r3lfTBgg23.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',34,'TD','Chad','????','XAF','+235','https://hadhir.s3.amazonaws.com/countries/IYd2EvjmvI.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',35,'CL','Chile','?????','CLP','+56','https://hadhir.s3.amazonaws.com/countries/3Q5roQFoOr.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',36,'CN','China','?????','CNY','+86','https://hadhir.s3.amazonaws.com/countries/GYJ46uxauD.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',37,'CO','Colombia','????????','COP','+57','https://hadhir.s3.amazonaws.com/countries/ykmQaKS3bF.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',38,'KM','Comoros','??? ?????','KMF','+269','https://hadhir.s3.amazonaws.com/countries/457WdchQMa.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',39,'CG','Congo','??????? ???????','XAF','+242','https://hadhir.s3.amazonaws.com/countries/ZDnVVt9MG6.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',40,'CD','Congo, Democratic Republic of the','??????? ??????? ???????????','CDF','+243','https://hadhir.s3.amazonaws.com/countries/xRdCVSgCRR.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',41,'CR','Costa Rica','?????????','CRC','+506','https://hadhir.s3.amazonaws.com/countries/AZGH83SNxP.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',42,'CI','Côte dIvoire','???? ?????','XOF','+225','https://hadhir.s3.amazonaws.com/countries/MAa8k8lG8F.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',43,'HR','Croatia','???????','HRK','+385','https://hadhir.s3.amazonaws.com/countries/0vpMvwDEyc.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',44,'CU','Cuba','????','CUP','+53','https://hadhir.s3.amazonaws.com/countries/eJa6O6RwBt.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',45,'CY','Cyprus','????','EUR','+357','https://hadhir.s3.amazonaws.com/countries/8zLI2TDxGl.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',46,'CZ','Czechia','??????? ??????','CZK','+420','https://hadhir.s3.amazonaws.com/countries/K3ZsLCvgFJ.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',47,'DK','Denmark','????????','DKK','+45','https://hadhir.s3.amazonaws.com/countries/NnZBXBSCTj.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',48,'DJ','Djibouti','??????','DJF','+253','https://hadhir.s3.amazonaws.com/countries/Qs58teePFC.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',49,'DM','Dominica','????????','XCD','+1 767','https://hadhir.s3.amazonaws.com/countries/z5ojBZy1p2.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',50,'DO','Dominican Republic','??????? ???????????','DOP','+1 849','https://hadhir.s3.amazonaws.com/countries/XgM6GL3spK.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',51,'EC','Ecuador','?????????','USD','+593','https://hadhir.s3.amazonaws.com/countries/IATKjCrsLK.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',52,'EG','Egypt','???','EGP','+20','https://hadhir.s3.amazonaws.com/countries/9LCNQU4sNM.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',53,'SV','El Salvador','?????????','USD','+503','https://hadhir.s3.amazonaws.com/countries/q8BkQJM21A.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:06',54,'GQ','Equatorial Guinea','????? ??????????','XAF','+240','https://hadhir.s3.amazonaws.com/countries/3wMqyjLCno.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',55,'ER','Eritrea','???????','ERN','+291','https://hadhir.s3.amazonaws.com/countries/TxjZ5kYLo3.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',56,'EE','Estonia','???????','EUR','+372','https://hadhir.s3.amazonaws.com/countries/CEUyFzQJfP.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',57,'SZ','Eswatini','???????','SZL','+268','https://hadhir.s3.amazonaws.com/countries/RZFJeSSPsN.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',58,'ET','Ethiopia','????','ETB','+251','https://hadhir.s3.amazonaws.com/countries/joJX0QZQOA.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',59,'FJ','Fiji','??????','FJD','+679','https://hadhir.s3.amazonaws.com/countries/aDAOhl0xKa.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',60,'FI','Finland','?????','EUR','+358','https://hadhir.s3.amazonaws.com/countries/CS9QUrwv0I.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',61,'FR','France','???????','EUR','+33','https://hadhir.s3.amazonaws.com/countries/O20ohoVUn1.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',62,'GA','Gabon','??????','XAF','+241','https://hadhir.s3.amazonaws.com/countries/x5td4a5Fy0.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',63,'GM','Gambia','??????','GMD','+220','https://hadhir.s3.amazonaws.com/countries/0pE8csf5dS.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',64,'GE','Georgia','???????','GEL','+995','https://hadhir.s3.amazonaws.com/countries/aAW8Lbwa5q.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',65,'DE','Germany','????','EUR','+49','https://hadhir.s3.amazonaws.com/countries/X250teEssJ.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',66,'GH','Ghana','???????','GHS','+233','https://hadhir.s3.amazonaws.com/countries/hFLE3DLDTo.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',67,'GR','Greece','???????','EUR','+30','https://hadhir.s3.amazonaws.com/countries/74HEva7iDN.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',68,'GD','Grenada','?????????','XCD','+1 473','https://hadhir.s3.amazonaws.com/countries/3v8XjXCQdb.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',69,'GT','Guatemala','?????','GTQ','+502','https://hadhir.s3.amazonaws.com/countries/f3LAAWgp05.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',70,'GN','Guinea','????? ?????','GNF','+224','https://hadhir.s3.amazonaws.com/countries/TQSDQDWtZG.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',71,'GW','Guinea-Bissau','?????','XOF','+245','https://hadhir.s3.amazonaws.com/countries/Js2S838tgB.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',72,'GY','Guyana','?????','GYD','+595','https://hadhir.s3.amazonaws.com/countries/hZ4qzAcURw.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',73,'HT','Haiti','???????','HTG','+509','https://hadhir.s3.amazonaws.com/countries/DluLfAEcyO.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:07',74,'HN','Honduras','?????','HNL','+504','https://hadhir.s3.amazonaws.com/countries/BbzfiLPg06.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',75,'HU','Hungary','???????','HUF','+36','https://hadhir.s3.amazonaws.com/countries/T0q8fwVXjB.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',76,'IS','Iceland','?????','ISK','+354','https://hadhir.s3.amazonaws.com/countries/hplyyc4NxZ.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',77,'IN','India','?????????','INR','+91','https://hadhir.s3.amazonaws.com/countries/Mfg4NuXLMe.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',78,'ID','Indonesia','?????','IDR','+62','https://hadhir.s3.amazonaws.com/countries/Y57aumYjxC.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',79,'IR','Iran (Islamic Republic of)','??????','IRR','+98','https://hadhir.s3.amazonaws.com/countries/jpF2hRy5y6.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',80,'IQ','Iraq','???????','IQD','+964','https://hadhir.s3.amazonaws.com/countries/qyMFVNjnoq.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',81,'IE','Ireland','???????','EUR','+353','https://hadhir.s3.amazonaws.com/countries/yHVCQ8VKX1.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',82,'IL','Israel','???????','ILS','+972','https://hadhir.s3.amazonaws.com/countries/6KwYzxTuRt.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',83,'IT','Italy','???????','EUR','+39','https://hadhir.s3.amazonaws.com/countries/S3x2efJjKX.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',84,'JM','Jamaica','???????','JMD','+1 876','https://hadhir.s3.amazonaws.com/countries/IF56nV2ux9.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',85,'JP','Japan','??????','JPY','+81','https://hadhir.s3.amazonaws.com/countries/E0lKQBhbLa.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',86,'JO','Jordan','?????????','JOD','+962','https://hadhir.s3.amazonaws.com/countries/yDgZmAqsOO.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',87,'KZ','Kazakhstan','?????','KZT','+7 7','https://hadhir.s3.amazonaws.com/countries/48l3B1r8Hv.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',88,'KE','Kenya','????????','KES','+254','https://hadhir.s3.amazonaws.com/countries/56zUHtiYk4.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',89,'KI','Kiribati','????? ????????','AUD','+686','https://hadhir.s3.amazonaws.com/countries/8DHWeNTUaA.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',90,'KP','Korea (Democratic Peoples Republic of)','????? ????????','KPW','+850','https://hadhir.s3.amazonaws.com/countries/Yjev2OwFUp.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',91,'KR','Korea, Republic of','??????','KRW','+82','https://hadhir.s3.amazonaws.com/countries/vBhA5DkQA6.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',92,'KW','Kuwait','??????????','KWD','+965','https://hadhir.s3.amazonaws.com/countries/ddGqbIygUP.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',93,'KG','Kyrgyzstan','????','KGS','+996','https://hadhir.s3.amazonaws.com/countries/K2QFDkY201.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',94,'LA','Lao Peoples Democratic Republic','??????','LAK','+856','https://hadhir.s3.amazonaws.com/countries/cCPQMDuyV7.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',95,'LV','Latvia','?????','EUR','+371','https://hadhir.s3.amazonaws.com/countries/F3faETtPzX.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',96,'LB','Lebanon','??????','LBP','+961','https://hadhir.s3.amazonaws.com/countries/pKU4csiXhv.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',97,'LS','Lesotho','???????','LSL','+266','https://hadhir.s3.amazonaws.com/countries/YgjB1zPdLy.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:08',98,'LR','Liberia','?????','LRD','+231','https://hadhir.s3.amazonaws.com/countries/5aCPI1ZdaC.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',99,'LY','Libya','??????????','LYD','+218','https://hadhir.s3.amazonaws.com/countries/8du1EbsHQh.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',100,'LI','Liechtenstein','????????','CHF','+423','https://hadhir.s3.amazonaws.com/countries/JQkTA299T1.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',101,'LT','Lithuania','?????????','EUR','+370','https://hadhir.s3.amazonaws.com/countries/tVsMpgpzyy.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',102,'LU','Luxembourg','???????','EUR','+352','https://hadhir.s3.amazonaws.com/countries/TpBxokFIeK.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',103,'MG','Madagascar','??????','MGA','+261','https://hadhir.s3.amazonaws.com/countries/4n2eaTAYte.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',104,'MW','Malawi','??????','MWK','+265','https://hadhir.s3.amazonaws.com/countries/zetlT48xOz.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',105,'MY','Malaysia','???????','MYR','+60','https://hadhir.s3.amazonaws.com/countries/IzKjQJq57f.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',106,'MV','Maldives','??? ????????','MVR','+960','https://hadhir.s3.amazonaws.com/countries/JavDxntpfB.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',107,'ML','Mali','????','XOF','+223','https://hadhir.s3.amazonaws.com/countries/Wx7zqLCPIU.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',108,'MT','Malta','?????','EUR','+356','https://hadhir.s3.amazonaws.com/countries/xtVCuavaIH.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',109,'MH','Marshall Islands','??? ??????','USD','+692','https://hadhir.s3.amazonaws.com/countries/0EkwwH4pK0.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',110,'MR','Mauritania','?????????','MRO','+222','https://hadhir.s3.amazonaws.com/countries/45kpVX25xn.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',111,'MU','Mauritius','????????','MUR','+230','https://hadhir.s3.amazonaws.com/countries/YOSzZOIITi.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',112,'MX','Mexico','???????','MXN','+52','https://hadhir.s3.amazonaws.com/countries/e2hyChXXS6.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',113,'FM','Micronesia (Federated States of)','?????? ?????????? ???????','USD','+691','https://hadhir.s3.amazonaws.com/countries/oC8jSSI9DP.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',114,'MD','Moldova, Republic of','??????','MDL','+373','https://hadhir.s3.amazonaws.com/countries/BJUVn267jV.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',115,'MC','Monaco','???????','EUR','+377','https://hadhir.s3.amazonaws.com/countries/07ysw57EQr.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',116,'MN','Mongolia','??????','MNT','+976','https://hadhir.s3.amazonaws.com/countries/9l7Bumkt5W.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',117,'ME','Montenegro','???????','EUR','+382','https://hadhir.s3.amazonaws.com/countries/4zXK6C6uV6.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',118,'MA','Morocco','????? ??????','MAD','+212','https://hadhir.s3.amazonaws.com/countries/IwMoCxT3zb.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',119,'MZ','Mozambique','???????','MZN','+258','https://hadhir.s3.amazonaws.com/countries/sY18m8qyDK.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',120,'MM','Myanmar','???????','MMK','+95','https://hadhir.s3.amazonaws.com/countries/Qa84powMrY.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',121,'NA','Namibia','???????','NAD','+264','https://hadhir.s3.amazonaws.com/countries/vGMBQ1SAC4.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',122,'NR','Nauru','?????','AUD','+674','https://hadhir.s3.amazonaws.com/countries/sCCBZ3u9Z6.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',123,'NP','Nepal','?????','NPR','+977','https://hadhir.s3.amazonaws.com/countries/b2DpcxZpag.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',124,'NL','Netherlands','??????','EUR','+31','https://hadhir.s3.amazonaws.com/countries/Ep6ycMQeT2.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',125,'NZ','New Zealand','?????????','NZD','+64','https://hadhir.s3.amazonaws.com/countries/96tEoy1dtR.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',126,'NI','Nicaragua','?????????','NIO','+505','https://hadhir.s3.amazonaws.com/countries/960ubwBOuj.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',127,'NE','Niger','??????','XOF','+227','https://hadhir.s3.amazonaws.com/countries/ddMkYms0Kj.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',128,'NG','Nigeria','???????','NGN','+234','https://hadhir.s3.amazonaws.com/countries/eoUSz5nS0P.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:09',129,'MK','North Macedonia','???????','MKD','+389','https://hadhir.s3.amazonaws.com/countries/CyxOEmm9hO.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',130,'NO','Norway','????','NOK','+47','https://hadhir.s3.amazonaws.com/countries/NuWIvQHR2a.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',131,'OM','Oman','???????','OMR','+968','https://hadhir.s3.amazonaws.com/countries/jMuHFOoUEC.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',132,'PK','Pakistan','?????','PKR','+92','https://hadhir.s3.amazonaws.com/countries/CGGqX1yHdE.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',133,'PW','Palau','????','USD','+680','https://hadhir.s3.amazonaws.com/countries/XyWpqWGXil.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',134,'PA','Panama','????? ????? ???????','PAB','+507','https://hadhir.s3.amazonaws.com/countries/3gYjt3Fogs.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',135,'PG','Papua New Guinea','????????','PGK','+675','https://hadhir.s3.amazonaws.com/countries/QQhoyZ5FMT.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',136,'PY','Paraguay','????','PYG','+595','https://hadhir.s3.amazonaws.com/countries/go5yecmfXO.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',137,'PE','Peru','???????','PEN','+51','https://hadhir.s3.amazonaws.com/countries/SV7ZbdtBGv.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',138,'PH','Philippines','??????','PHP','+63','https://hadhir.s3.amazonaws.com/countries/HTnRUscQ2M.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',139,'PL','Poland','????????','PLN','+48','https://hadhir.s3.amazonaws.com/countries/WqVAkFchmG.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',140,'PT','Portugal','???','EUR','+351','https://hadhir.s3.amazonaws.com/countries/EsmfiVTBSu.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',141,'QA','Qatar','???????','QAR','+974','https://hadhir.s3.amazonaws.com/countries/zOYSJPf0Ug.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:10',142,'RO','Romania','?????','RON','+40','https://hadhir.s3.amazonaws.com/countries/GT8o6r9UbG.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',143,'RU','Russian Federation','??????','RUB','+7','https://hadhir.s3.amazonaws.com/countries/0ckMXVdFWQ.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',144,'RW','Rwanda','???? ???? ??????','RWF','+250','https://hadhir.s3.amazonaws.com/countries/4MuPpDP24s.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',145,'KN','Saint Kitts and Nevis','???? ?????','XCD','+1 869','https://hadhir.s3.amazonaws.com/countries/S5JanAwuQz.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',146,'LC','Saint Lucia','???? ?????? ???????????','XCD','+1 758','https://hadhir.s3.amazonaws.com/countries/p38DKEMM9Y.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',147,'VC','Saint Vincent and the Grenadines','?????','XCD','+1 784','https://hadhir.s3.amazonaws.com/countries/DiTYFbTmTP.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',148,'WS','Samoa','??? ??????','WST','+685','https://hadhir.s3.amazonaws.com/countries/ya7XosmIkz.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',149,'SM','San Marino','??? ???? ????????','EUR','+378','https://hadhir.s3.amazonaws.com/countries/PRPxThHzXe.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',150,'ST','Sao Tome and Principe','????????','STD','+239','https://hadhir.s3.amazonaws.com/countries/Hb2XWumdCb.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',151,'SA','Saudi Arabia','???????','SAR','+966','https://hadhir.s3.amazonaws.com/countries/hcC1es7qnf.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',152,'SN','Senegal','?????','XOF','+221','https://hadhir.s3.amazonaws.com/countries/rqMTIY7Z3z.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',153,'RS','Serbia','????','RSD','+381','https://hadhir.s3.amazonaws.com/countries/CI4T434wCr.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',154,'SC','Seychelles','????????','SCR','+248','https://hadhir.s3.amazonaws.com/countries/VMl4Ex6zbY.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',155,'SL','Sierra Leone','????????','SLL','+232','https://hadhir.s3.amazonaws.com/countries/gozgnKZkuW.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',156,'SG','Singapore','????????','SGD','+65','https://hadhir.s3.amazonaws.com/countries/m5GOofIzEj.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',157,'SK','Slovakia','????????','EUR','+421','https://hadhir.s3.amazonaws.com/countries/53Xbf1iKYR.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',158,'SI','Slovenia','??? ??????','EUR','+386','https://hadhir.s3.amazonaws.com/countries/NrYn1C6AYh.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',159,'SB','Solomon Islands','???????','SBD','+677','https://hadhir.s3.amazonaws.com/countries/hU8DlCzayF.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',160,'SO','Somalia','???? ???????','SOS','+252','https://hadhir.s3.amazonaws.com/countries/mYRfQnFl0z.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',161,'ZA','South Africa','???? ???????','ZAR','+27','https://hadhir.s3.amazonaws.com/countries/xkPrwk1AeC.png'),
('2020-08-18 16:01:39','2020-12-21 16:39:38',162,'SS','South Sudan','???????','SSP',NULL,'https://hadhir.s3.amazonaws.com/countries/6MfxhBAOm2.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',163,'ES','Spain','????????','EUR','+34','https://hadhir.s3.amazonaws.com/countries/nuiCHTyk3y.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',164,'LK','Sri Lanka','???????','LKR','+94','https://hadhir.s3.amazonaws.com/countries/vCCowBl94K.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',165,'SD','Sudan','???????','SDG','+249','https://hadhir.s3.amazonaws.com/countries/i35Iw2tYvh.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:11',166,'SR','Suriname','????????','SRD','+597','https://hadhir.s3.amazonaws.com/countries/iD3ZSmVaCB.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',167,'SE','Sweden','??????','SEK','+46','https://hadhir.s3.amazonaws.com/countries/pzpnyrqVd5.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',168,'CH','Switzerland','??????','CHF','+41','https://hadhir.s3.amazonaws.com/countries/7LVMsROUSF.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',169,'SY','Syrian Arab Republic','?????','SYP','+963','https://hadhir.s3.amazonaws.com/countries/p7qCFRXPgz.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',170,'TJ','Tajikistan','?????????','TJS','+992','https://hadhir.s3.amazonaws.com/countries/13AmPV8FYN.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',171,'TZ','Tanzania, United Republic of','???????','TZS','+255','https://hadhir.s3.amazonaws.com/countries/HePKJxrbxA.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',172,'TH','Thailand','???????','THB','+66','https://hadhir.s3.amazonaws.com/countries/YvS3GAVZAY.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',173,'TL','Timor-Leste','????? ???????','USD','+670','https://hadhir.s3.amazonaws.com/countries/u52dpFhkcv.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',174,'TG','Togo','????','XOF','+228','https://hadhir.s3.amazonaws.com/countries/IlopcPyBOW.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',175,'TO','Tonga','?????','TOP','+676','https://hadhir.s3.amazonaws.com/countries/bYn4IJYZV1.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',176,'TT','Trinidad and Tobago','???????? ???????','TTD','+1 868','https://hadhir.s3.amazonaws.com/countries/GLELJGfYU7.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',177,'TN','Tunisia','????','TND','+216','https://hadhir.s3.amazonaws.com/countries/RQbpCC1hDb.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',178,'TR','Turkey','?????','TRY','+90','https://hadhir.s3.amazonaws.com/countries/ZS1hun2iXF.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',179,'TM','Turkmenistan','??????????','TMT','+993','https://hadhir.s3.amazonaws.com/countries/ejf59TAGZu.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',180,'TV','Tuvalu','??????','AUD','+688','https://hadhir.s3.amazonaws.com/countries/5YRDppKkQo.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',181,'UG','Uganda','??????','UGX','+256','https://hadhir.s3.amazonaws.com/countries/S0BsHlfOvU.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',182,'UA','Ukraine','????????','UAH','+380','https://hadhir.s3.amazonaws.com/countries/gAMUJkOnEs.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',183,'AE','United Arab Emirates','???????? ??????? ???????','AED','+971','https://hadhir.s3.amazonaws.com/countries/i2HwaohBQD.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',184,'GB','United Kingdom of Great Britain and Northern Ireland','??????? ???????','GBP','+44','https://hadhir.s3.amazonaws.com/countries/SZ6yxVos8L.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',185,'US','United States of America','???????? ???????','USD','+1','https://hadhir.s3.amazonaws.com/countries/IqZ1o7ltqL.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',186,'UY','Uruguay','??????????','UYU','+598','https://hadhir.s3.amazonaws.com/countries/Aq96RWkCyP.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',187,'UZ','Uzbekistan','?????????','UZS','+998','https://hadhir.s3.amazonaws.com/countries/lwDokai4Uc.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:12',188,'VU','Vanuatu','???????','VUV','+678','https://hadhir.s3.amazonaws.com/countries/nKmiEzbG9T.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:13',189,'VE','Venezuela (Bolivarian Republic of)','???????','VEF','+58','https://hadhir.s3.amazonaws.com/countries/RGMWTqebV6.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:13',190,'VN','Viet Nam','??????','VND','+84','https://hadhir.s3.amazonaws.com/countries/q5ErJ3Appa.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:13',191,'YE','Yemen','?????','YER','+967','https://hadhir.s3.amazonaws.com/countries/zj1SCum7Nz.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:13',192,'ZM','Zambia','??????','ZMW','+260','https://hadhir.s3.amazonaws.com/countries/SzJC7cHyHR.png'),
('2020-08-18 16:01:39','2020-12-21 17:48:13',193,'ZW','Zimbabwe','????????','ZWL','+263','https://hadhir.s3.amazonaws.com/countries/NviWQN5Jt6.png');

/*Table structure for table `delivery_modes` */

DROP TABLE IF EXISTS `delivery_modes`;

CREATE TABLE `delivery_modes` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `color_image` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `delivery_modes` */

insert  into `delivery_modes`(`createdAt`,`updatedAt`,`id`,`name`,`display_name`,`title`,`subtitle`,`image`,`color_image`,`deletedAt`) values 
('2020-10-31 06:36:48','2020-10-31 06:36:54',1,'online','Online Delivery Guy','Online','Delivery Guy','https://waspha.s3.amazonaws.com/delivery_modes/Rew0xEjmCA.png','https://waspha.s3.amazonaws.com/delivery_modes/Rew0xEjmCA.png',NULL),
('2020-10-31 06:36:58','2020-10-31 06:37:02',2,'offline','Offline Delivery Guy','Offline','Delivery Guy','https://waspha.s3.amazonaws.com/delivery_modes/NWwg9a8zQB.png','(NULL)https://waspha.s3.amazonaws.com/delivery_modes/NWwg9a8zQB.png',NULL),
('2020-10-31 06:37:07','2020-10-31 06:37:12',3,'waspha_express','Waspha Express','Waspha','Express','https://waspha.s3.amazonaws.com/delivery_modes/Io4R8s30Zh.png','https://waspha.s3.amazonaws.com/delivery_modes/Io4R8s30Zh.png',NULL);

/*Table structure for table `delivery_vehicles` */

DROP TABLE IF EXISTS `delivery_vehicles`;

CREATE TABLE `delivery_vehicles` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `color_image` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `delivery_vehicles` */

insert  into `delivery_vehicles`(`createdAt`,`updatedAt`,`id`,`name`,`display_name`,`title`,`subtitle`,`image`,`color_image`,`deletedAt`) values 
('2020-09-09 18:03:40','2020-09-09 18:03:37',1,'bike','Bike','Bike',NULL,'https://waspha.s3.amazonaws.com/vehicles/s2SOQZ6xH6.png','https://waspha.s3.amazonaws.com/vehicles/3u7Ad78leX.png',NULL),
('2020-09-09 18:03:43','2020-09-09 18:03:46',2,'car','Car','Car',NULL,'https://waspha.s3.amazonaws.com/vehicles/s7WxWS2QhC.png','https://waspha.s3.amazonaws.com/vehicles/FN9QH5cSVm.png',NULL),
('2020-09-09 18:03:49','2020-09-09 18:03:54',3,'truck','Truck','Truck',NULL,'https://waspha.s3.amazonaws.com/vehicles/w68EmQFCmh.png','https://waspha.s3.amazonaws.com/vehicles/s4lH9l46qE.png',NULL),
('2020-09-09 18:03:49','2020-09-09 18:03:54',4,'bicycle','Bicycle','Bicycle',NULL,'https://waspha.s3.amazonaws.com/vehicles/IPNuFi0ZCa.png','https://waspha.s3.amazonaws.com/vehicles/IPNuFi0ZCa.png',NULL),
('2020-09-09 18:03:49','2020-09-09 18:03:54',5,'walk_in','Walk In','Walk In',NULL,'https://waspha.s3.amazonaws.com/vehicles/CWqmL8oiET.png','https://waspha.s3.amazonaws.com/vehicles/CWqmL8oiET.png',NULL);

/*Table structure for table `driver_country` */

DROP TABLE IF EXISTS `driver_country`;

CREATE TABLE `driver_country` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Data for the table `driver_country` */

insert  into `driver_country`(`createdAt`,`updatedAt`,`id`,`driver_id`,`country_id`) values 
('2021-01-14 16:36:32','2021-01-14 16:36:32',6,24,132),
('2021-01-14 20:11:58','2021-01-14 20:11:58',7,25,132),
('2021-01-14 20:21:22','2021-01-14 20:24:38',8,26,132),
('2021-01-15 07:56:30','2021-01-15 16:22:59',9,30,132),
('2021-01-15 16:33:25','2021-01-15 16:33:25',10,333,132);

/*Table structure for table `driver_notifications` */

DROP TABLE IF EXISTS `driver_notifications`;

CREATE TABLE `driver_notifications` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` double DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` varchar(255) DEFAULT NULL,
  `extra_data` text,
  `notification_type` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

/*Data for the table `driver_notifications` */

insert  into `driver_notifications`(`createdAt`,`updatedAt`,`id`,`template_id`,`title`,`body`,`extra_data`,`notification_type`,`deletedAt`,`driver_id`,`is_read`) values 
('2021-01-14 19:38:11','2021-01-14 19:38:11',5,NULL,'Order Request','You have received an order request','{\"id\":7,\"expiry_time\":\"2021-01-14T19:40:11.000Z\"}','order_request_received',NULL,25,0),
('2021-01-14 19:51:34','2021-01-14 19:51:34',6,NULL,'Order Request','You have received an order request','{\"id\":7,\"expiry_time\":\"2021-01-14T19:40:11.000Z\"}','order_request_received',NULL,25,0),
('2021-01-14 19:53:10','2021-01-14 19:53:10',7,NULL,'Order Request','You have received an order request','{\"id\":7,\"expiry_time\":\"2021-01-14T19:40:11.000Z\"}','order_request_received',NULL,25,0),
('2021-01-14 20:12:30','2021-01-14 20:12:30',8,NULL,'Order Request','You have received an order request','{\"id\":8,\"expiry_time\":\"2021-01-14T20:14:30.000Z\"}','order_request_received',NULL,26,0),
('2021-01-14 20:21:47','2021-01-14 20:21:47',9,NULL,'Order Request','You have received an order request','{\"id\":8,\"expiry_time\":\"2021-01-14T20:14:30.000Z\"}','order_request_received',NULL,26,0),
('2021-01-15 02:38:28','2021-01-15 02:38:28',10,NULL,'Order Request','You have received an order request','{\"id\":7,\"expiry_time\":\"2021-01-14T14:40:11.000Z\"}','order_request_received',NULL,25,0),
('2021-01-15 02:42:30','2021-01-15 02:42:30',11,NULL,'Order Request','You have received an order request','{\"id\":10,\"expiry_time\":\"2021-01-14T21:44:27.000Z\"}','order_request_received',NULL,25,0),
('2021-01-15 02:44:28','2021-01-15 02:44:28',12,NULL,'Order Request','You have received an order request','{\"id\":10,\"expiry_time\":\"2021-01-14T21:44:27.000Z\"}','order_request_received',NULL,25,0),
('2021-01-15 02:44:48','2021-01-15 02:44:48',13,NULL,'Order Request','You have received an order request','{\"id\":10,\"expiry_time\":\"2021-01-14T21:44:27.000Z\"}','order_request_received',NULL,25,0),
('2021-01-15 08:01:22','2021-01-15 08:01:22',14,NULL,'Order Request','You have received an order request','{\"id\":13,\"expiry_time\":\"2021-01-15T08:03:22.000Z\"}','order_request_received',NULL,30,0),
('2021-01-15 09:10:49','2021-01-15 09:10:49',15,NULL,'Order Request','You have received an order request','{\"id\":14,\"expiry_time\":\"2021-01-15T09:12:49.000Z\"}','order_request_received',NULL,30,0);

/*Table structure for table `driver_reviews_ratings` */

DROP TABLE IF EXISTS `driver_reviews_ratings`;

CREATE TABLE `driver_reviews_ratings` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `review` text,
  `rating` double DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Data for the table `driver_reviews_ratings` */

insert  into `driver_reviews_ratings`(`createdAt`,`updatedAt`,`id`,`review`,`rating`,`deletedAt`,`order_id`,`driver_id`,`user_id`,`store_id`) values 
('2021-01-15 07:41:17','2021-01-15 07:41:17',13,'Speedy delivery',5,NULL,32,29,NULL,8);

/*Table structure for table `drivers` */

DROP TABLE IF EXISTS `drivers`;

CREATE TABLE `drivers` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `otp` double DEFAULT NULL,
  `vehicle_name` varchar(255) DEFAULT NULL,
  `number_plate` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `delivery_mode_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `contact` (`contact`)
) ENGINE=InnoDB AUTO_INCREMENT=334 DEFAULT CHARSET=latin1;

/*Data for the table `drivers` */

insert  into `drivers`(`createdAt`,`updatedAt`,`id`,`name`,`email`,`country_code`,`contact`,`password`,`otp`,`vehicle_name`,`number_plate`,`status`,`avatar`,`gender`,`language`,`is_online`,`address`,`lat`,`lng`,`document`,`type`,`device_token`,`deletedAt`,`store_id`,`vehicle_id`,`delivery_mode_id`) values 
('2021-01-14 16:36:09','2021-01-14 20:11:40',24,'Salman','salman@mail.com','+92','3002312157','$2a$12$zoj7zs1RzTxZ1QO.vzUWEuIOL/0MU6278jFJush54y5Z5mY3hRWrO',NULL,NULL,NULL,1,'https://waspha.s3.amazonaws.com/drivers/qRaUiloIrg.png',NULL,'en',0,NULL,26.549999,31.700001,NULL,'online','cKVQ_kTNTa2oMYU98WbAlm:APA91bEEJ7LgUWsqE6fkC0a9F2S3oOuYMwRHDAJ5m0Iw122Nag3iLBXSnC_IbG83mRSx08w2EIrrocEero6Lf5-BQ3aNVSYy9TCJZvnBIy7t8rbNNEbO6kghUyBL_OVz5smFgYmqWEGT',NULL,11,5,NULL),
('2021-01-14 19:21:47','2021-01-14 20:24:22',25,'Ali','ali@mail.com','+92','3329551625','$2a$12$IPFbAswsg8NnW4zzl8YiAujZqonxBrndAvHeZZ.I5.IxEUXjafFWW',NULL,NULL,NULL,1,'https://waspha.s3.amazonaws.com/drivers/WxkexiDYgo.png',NULL,'en',1,NULL,26.549999,31.700001,NULL,'online','cKVQ_kTNTa2oMYU98WbAlm:APA91bEEJ7LgUWsqE6fkC0a9F2S3oOuYMwRHDAJ5m0Iw122Nag3iLBXSnC_IbG83mRSx08w2EIrrocEero6Lf5-BQ3aNVSYy9TCJZvnBIy7t8rbNNEbO6kghUyBL_OVz5smFgYmqWEGT',NULL,8,5,NULL),
('2021-01-14 20:09:38','2021-01-15 08:04:45',26,'Kashif','kashif@mail.com','+92','3312539119','$2a$12$rMXqjeMdAQqV.kh0BGBq8e7A4w4AkOmOo6tV7qEnDALNx.FIUgqCG',NULL,'Honda','Ax23',1,'https://waspha.s3.amazonaws.com/drivers/lKZ20lYPa4.png',NULL,'en',0,NULL,26.549999,31.700001,NULL,'online','cKVQ_kTNTa2oMYU98WbAlm:APA91bEEJ7LgUWsqE6fkC0a9F2S3oOuYMwRHDAJ5m0Iw122Nag3iLBXSnC_IbG83mRSx08w2EIrrocEero6Lf5-BQ3aNVSYy9TCJZvnBIy7t8rbNNEbO6kghUyBL_OVz5smFgYmqWEGT',NULL,11,1,NULL),
('2021-01-14 20:10:58','2021-01-14 20:10:58',27,'Akif',NULL,'+92','3002312150',NULL,NULL,NULL,NULL,1,'https://waspha.s3.amazonaws.com/drivers/fFOC9ybDcX.png',NULL,'en',0,NULL,26.549999,31.700001,NULL,'offline',NULL,NULL,11,4,NULL),
('2021-01-15 07:20:11','2021-01-15 07:20:11',28,'Salman',NULL,'+92','3002312159',NULL,NULL,'Honda','243',1,'https://waspha.s3.amazonaws.com/drivers/5RickG6ENU.png',NULL,'en',0,NULL,26.549999,31.700001,NULL,'offline',NULL,NULL,15,1,NULL),
('2021-01-15 07:38:57','2021-01-15 07:38:57',29,'Aqib',NULL,'+92','3314258997',NULL,NULL,'Habib','1234',1,'https://waspha.s3.amazonaws.com/drivers/b1Dnt6EIbi.png',NULL,'en',0,NULL,26.549999,31.700001,NULL,'offline',NULL,NULL,8,1,NULL),
('2021-01-15 07:54:25','2021-01-15 16:27:15',31,'Hamza','hamza@mail.com','+92','3349551600','$2a$12$FbX80M9t1/CyUCkqzDlu/Oi4QeyuDem8AfIfabidnXyDt7SpoMnS.',NULL,NULL,NULL,1,'https://waspha.s3.amazonaws.com/drivers/1ikYTobBBH.png',NULL,'en',0,NULL,NULL,NULL,NULL,'online','cJZwDavSCUTRuqF7sRVECf:APA91bHAq9KxoSV6EO64P6yGb4CCzOvGWxtDX0tXbLMNRqim_z1icf_wkqenLWIQhYQyi3q9958Rk3yQY6AR4m_UbFkazozybGy8ptjSiq3enfGBvoGdqN0q2A8KP_N6JoCRfuZzJi4E',NULL,13,1,NULL),
('2021-01-15 07:54:25','2021-01-19 17:03:20',32,'Ahmar','ahmar@mail.com','+92','3135418068','$2a$12$FbX80M9t1/CyUCkqzDlu/Oi4QeyuDem8AfIfabidnXyDt7SpoMnS.',2128,NULL,NULL,1,'https://waspha.s3.amazonaws.com/drivers/1ikYTobBBH.png',NULL,'en',0,NULL,NULL,NULL,NULL,'online','cJZwDavSCUTRuqF7sRVECf:APA91bHAq9KxoSV6EO64P6yGb4CCzOvGWxtDX0tXbLMNRqim_z1icf_wkqenLWIQhYQyi3q9958Rk3yQY6AR4m_UbFkazozybGy8ptjSiq3enfGBvoGdqN0q2A8KP_N6JoCRfuZzJi4E',NULL,13,1,NULL),
('2021-01-15 07:54:25','2021-01-15 16:36:20',333,'Amir111','amir@mail.com','+92','3349551625','$2a$12$FbX80M9t1/CyUCkqzDlu/Oi4QeyuDem8AfIfabidnXyDt7SpoMnS.',NULL,NULL,NULL,1,'https://waspha.s3.amazonaws.com/drivers/1ikYTobBBH.png',NULL,'en',1,NULL,24.9048014,67.0780556,NULL,'online','cJZwDavSCUTRuqF7sRVECf:APA91bHAq9KxoSV6EO64P6yGb4CCzOvGWxtDX0tXbLMNRqim_z1icf_wkqenLWIQhYQyi3q9958Rk3yQY6AR4m_UbFkazozybGy8ptjSiq3enfGBvoGdqN0q2A8KP_N6JoCRfuZzJi4E',NULL,8,4,NULL);

/*Table structure for table `faqs` */

DROP TABLE IF EXISTS `faqs`;

CREATE TABLE `faqs` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

/*Data for the table `faqs` */

insert  into `faqs`(`createdAt`,`updatedAt`,`id`,`title`,`description`) values 
('2020-09-10 18:44:30','2020-09-10 18:44:30',1,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:03','2020-09-10 18:45:03',2,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:05','2020-09-10 18:45:05',3,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:06','2020-09-10 18:45:06',4,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:07','2020-09-10 18:45:07',5,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:08','2020-09-10 18:45:08',6,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:09','2020-09-10 18:45:09',7,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:09','2020-09-10 18:45:09',8,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:10','2020-09-10 18:45:10',9,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:11','2020-09-10 18:45:11',10,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:45:11','2020-09-10 18:45:11',11,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb'),
('2020-09-10 18:59:26','2020-09-10 18:59:26',12,'afjf dfdf dhfh','sjdsdjn sdjsdnjd jdfnjdbfjdfbdfbhdb');

/*Table structure for table `order_statuses` */

DROP TABLE IF EXISTS `order_statuses`;

CREATE TABLE `order_statuses` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_placed` datetime DEFAULT NULL,
  `proposal_sent` datetime DEFAULT NULL,
  `order_accepted` datetime DEFAULT NULL,
  `order_picked` datetime DEFAULT NULL,
  `order_prepared` datetime DEFAULT NULL,
  `order_delivered` datetime DEFAULT NULL,
  `proposal_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

/*Data for the table `order_statuses` */

insert  into `order_statuses`(`createdAt`,`updatedAt`,`id`,`order_placed`,`proposal_sent`,`order_accepted`,`order_picked`,`order_prepared`,`order_delivered`,`proposal_id`) values 
('2021-01-14 18:53:12','2021-01-14 18:53:12',7,'2021-01-14 18:51:04','2021-01-14 18:53:12',NULL,NULL,NULL,NULL,11),
('2021-01-14 19:01:24','2021-01-14 19:01:24',8,'2021-01-14 18:59:45','2021-01-14 19:01:23',NULL,NULL,NULL,NULL,12),
('2021-01-14 19:04:55','2021-01-14 19:04:55',9,'2021-01-14 19:03:29','2021-01-14 19:04:55',NULL,NULL,NULL,NULL,13),
('2021-01-14 19:18:23','2021-01-14 19:19:07',10,'2021-01-14 19:16:52','2021-01-14 19:18:23','2021-01-14 19:19:07',NULL,NULL,NULL,14),
('2021-01-14 19:19:22','2021-01-14 19:19:22',11,'2021-01-14 19:17:42','2021-01-14 19:19:22',NULL,NULL,NULL,NULL,15),
('2021-01-14 19:19:44','2021-01-14 19:19:44',12,'2021-01-14 19:12:56','2021-01-14 19:19:44',NULL,NULL,NULL,NULL,16),
('2021-01-14 19:35:02','2021-01-14 19:39:24',13,'2021-01-14 19:26:24','2021-01-14 19:35:02','2021-01-14 19:39:23',NULL,NULL,NULL,17),
('2021-01-14 19:57:47','2021-01-14 19:57:47',14,'2021-01-14 19:57:24','2021-01-14 19:57:47',NULL,NULL,NULL,NULL,18),
('2021-01-14 20:02:08','2021-01-14 20:12:45',15,'2021-01-14 19:59:50','2021-01-14 20:02:08','2021-01-14 20:06:25','2021-01-14 20:12:45',NULL,NULL,19),
('2021-01-14 20:02:47','2021-01-14 20:02:47',16,'2021-01-14 19:57:05','2021-01-14 20:02:47',NULL,NULL,NULL,NULL,20),
('2021-01-14 20:04:24','2021-01-14 20:05:40',17,'2021-01-14 20:00:46','2021-01-14 20:04:22','2021-01-14 20:05:39',NULL,NULL,NULL,21),
('2021-01-14 20:05:03','2021-01-14 20:06:04',18,'2021-01-14 20:00:20','2021-01-14 20:05:03','2021-01-14 20:06:04',NULL,NULL,NULL,22),
('2021-01-14 20:06:13','2021-01-15 07:54:54',19,'2021-01-14 20:04:39','2021-01-14 20:06:13','2021-01-14 20:06:44','2021-01-15 07:54:53',NULL,NULL,23),
('2021-01-14 20:35:46','2021-01-14 20:35:46',20,'2021-01-14 20:34:58','2021-01-14 20:35:46',NULL,NULL,NULL,NULL,24),
('2021-01-14 21:20:06','2021-01-14 21:20:06',21,'2021-01-14 21:19:12','2021-01-14 21:20:06',NULL,NULL,NULL,NULL,25),
('2021-01-14 21:23:59','2021-01-14 21:23:59',22,'2021-01-14 21:23:00','2021-01-14 21:23:59',NULL,NULL,NULL,NULL,26),
('2021-01-14 21:25:24','2021-01-14 21:25:24',23,'2021-01-14 21:24:48','2021-01-14 21:25:24',NULL,NULL,NULL,NULL,27),
('2021-01-14 21:28:16','2021-01-14 21:28:16',24,'2021-01-14 21:27:50','2021-01-14 21:28:16',NULL,NULL,NULL,NULL,28),
('2021-01-14 21:31:43','2021-01-14 21:31:43',25,'2021-01-14 21:30:45','2021-01-14 21:31:43',NULL,NULL,NULL,NULL,29),
('2021-01-14 21:33:15','2021-01-14 21:33:15',26,'2021-01-14 21:32:48','2021-01-14 21:33:15',NULL,NULL,NULL,NULL,30),
('2021-01-15 07:32:24','2021-01-15 07:34:48',27,'2021-01-15 07:29:10','2021-01-15 07:32:24','2021-01-15 07:34:48',NULL,NULL,NULL,31),
('2021-01-15 07:33:07','2021-01-15 07:40:39',28,'2021-01-15 07:26:52','2021-01-15 07:33:07','2021-01-15 07:34:04','2021-01-15 07:40:38',NULL,'2021-01-15 07:40:38',32),
('2021-01-15 07:59:52','2021-01-15 08:00:43',29,'2021-01-15 07:59:15','2021-01-15 07:59:51','2021-01-15 08:00:43',NULL,NULL,NULL,33),
('2021-01-15 09:13:29','2021-01-15 09:13:29',30,'2021-01-15 09:11:34','2021-01-15 09:13:28',NULL,NULL,NULL,NULL,34),
('2021-01-15 17:23:29','2021-01-15 17:23:29',31,'2021-01-15 17:22:54','2021-01-15 17:23:27',NULL,NULL,NULL,NULL,11),
('2021-01-15 17:29:10','2021-01-15 17:29:22',32,'2021-01-15 17:28:57','2021-01-15 17:29:07','2021-01-15 17:29:22',NULL,NULL,NULL,1),
('2021-01-15 18:30:09','2021-01-15 18:30:09',33,'2021-01-15 18:29:00','2021-01-15 18:30:07',NULL,NULL,NULL,NULL,1),
('2021-01-15 18:30:50','2021-01-15 18:34:30',34,'2021-01-15 18:30:33','2021-01-15 18:30:48','2021-01-15 18:31:29',NULL,'2021-01-15 18:34:29',NULL,2);

/*Table structure for table `permission_role` */

DROP TABLE IF EXISTS `permission_role`;

CREATE TABLE `permission_role` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `permission_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `permission_role` */

/*Table structure for table `permissions` */

DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permissions` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `table` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `permissions` */

/*Table structure for table `proposal_driver` */

DROP TABLE IF EXISTS `proposal_driver`;

CREATE TABLE `proposal_driver` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` double DEFAULT NULL,
  `proposal_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `proposal_driver` */

/*Table structure for table `proposal_driver_reasons` */

DROP TABLE IF EXISTS `proposal_driver_reasons`;

CREATE TABLE `proposal_driver_reasons` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reasons` text,
  `description` text,
  `proposal_driver_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `proposal_driver_reasons` */

/*Table structure for table `proposal_items` */

DROP TABLE IF EXISTS `proposal_items`;

CREATE TABLE `proposal_items` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `tax_ratio` double DEFAULT NULL,
  `requirements` text,
  `remarks` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `remarks_image` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `proposal_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `proposal_items` */

insert  into `proposal_items`(`createdAt`,`updatedAt`,`id`,`title`,`price`,`quantity`,`tax_ratio`,`requirements`,`remarks`,`image`,`remarks_image`,`deletedAt`,`proposal_id`,`product_id`) values 
('2021-01-15 18:30:09','2021-01-15 18:30:09',1,'Zinger burger',50,3,5,'Zinger burger with mayonnaise ','I will provide a delicious zinger burger',NULL,'https://waspha.s3.amazonaws.com/proposal-items/xPvptQ6IF0.png',NULL,1,NULL),
('2021-01-15 18:30:09','2021-01-15 18:30:09',2,'Chicken nuggets',15,12,10,'Some chicken nuggets','I will provide you delicious chicken nuggets','https://waspha.s3.amazonaws.com/proposal-items/gxn0PurL2o.png',NULL,NULL,1,NULL),
('2021-01-15 18:30:50','2021-01-15 18:30:50',3,'Zinger burger',50,3,5,'Zinger burger with mayonnaise ','I will provide a delicious zinger burger',NULL,'https://waspha.s3.amazonaws.com/proposal-items/QYX11CqEhm.png',NULL,2,NULL),
('2021-01-15 18:30:50','2021-01-15 18:30:50',4,'Chicken nuggets',15,12,10,'Some chicken nuggets','I will provide you delicious chicken nuggets','https://waspha.s3.amazonaws.com/proposal-items/VRRJ4CvbDj.png',NULL,NULL,2,NULL);

/*Table structure for table `proposal_revised_items` */

DROP TABLE IF EXISTS `proposal_revised_items`;

CREATE TABLE `proposal_revised_items` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` double DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `remarks_image` varchar(255) DEFAULT NULL,
  `proposal_item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `proposal_revised_items` */

/*Table structure for table `proposals` */

DROP TABLE IF EXISTS `proposals`;

CREATE TABLE `proposals` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delivery_fee` double DEFAULT NULL,
  `eta` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `proposal_prep_time` double DEFAULT NULL,
  `proposal_selection_time` double DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  `is_revised` tinyint(1) DEFAULT NULL,
  `revision_number` double DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `rfp_store_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `delivery_mode_id` int(11) DEFAULT NULL,
  `delivery_vehicle_id` int(11) DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `proposals` */

insert  into `proposals`(`createdAt`,`updatedAt`,`id`,`delivery_fee`,`eta`,`type`,`proposal_prep_time`,`proposal_selection_time`,`is_read`,`is_revised`,`revision_number`,`deletedAt`,`rfp_store_id`,`status_id`,`delivery_mode_id`,`delivery_vehicle_id`,`payment_method`) values 
('2021-01-15 18:30:07','2021-01-15 18:30:20',1,10,'2021-01-16T23:00:00.000Z','delivery',30,20,0,0,0,NULL,5,1,2,1,NULL),
('2021-01-15 18:30:48','2021-01-15 18:34:30',2,10,'2021-01-16T23:00:00.000Z','pickup',30,20,0,0,0,NULL,6,25,2,1,'cash_on_delivery');

/*Table structure for table `request_for_proposal_items` */

DROP TABLE IF EXISTS `request_for_proposal_items`;

CREATE TABLE `request_for_proposal_items` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `description` text,
  `requirements` text,
  `additional_notes` text,
  `image` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `rfp_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Data for the table `request_for_proposal_items` */

insert  into `request_for_proposal_items`(`createdAt`,`updatedAt`,`id`,`name`,`quantity`,`description`,`requirements`,`additional_notes`,`image`,`deletedAt`,`rfp_id`,`product_id`) values 
('2021-01-15 17:28:58','2021-01-15 17:28:58',1,'Item 1',3,NULL,NULL,'dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/fjBNp58Wbe.png',NULL,1,NULL),
('2021-01-15 17:28:59','2021-01-15 17:28:59',2,'Item 2',12,NULL,'I need 12 item 2','dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/oQiHhL1yp5.png',NULL,1,NULL),
('2021-01-15 18:03:36','2021-01-15 18:03:36',3,'Item 1',3,NULL,NULL,'dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/Ouji4uQuDF.png',NULL,1,NULL),
('2021-01-15 18:03:37','2021-01-15 18:03:37',4,'Item 2',12,NULL,'I need 12 item 2','dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/RatgLrXtQE.png',NULL,1,NULL),
('2021-01-15 18:04:06','2021-01-15 18:04:06',5,'Item 1',3,NULL,NULL,'dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/uNYWv9faHp.png',NULL,2,NULL),
('2021-01-15 18:04:07','2021-01-15 18:04:07',6,'Item 2',12,NULL,'I need 12 item 2','dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/Ks5g9u1R5z.png',NULL,2,NULL),
('2021-01-15 18:29:02','2021-01-15 18:29:02',7,'Item 1',3,NULL,NULL,'dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/4bA7U3kWcJ.png',NULL,3,NULL),
('2021-01-15 18:29:03','2021-01-15 18:29:03',8,'Item 2',12,NULL,'I need 12 item 2','dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/376rjJnxw1.png',NULL,3,NULL),
('2021-01-15 18:30:34','2021-01-15 18:30:34',9,'Item 1',3,NULL,NULL,'dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/hBHyPORLw6.png',NULL,4,NULL),
('2021-01-15 18:30:36','2021-01-15 18:30:36',10,'Item 2',12,NULL,'I need 12 item 2','dsvsdfs dfvdsfcsdf','https://waspha.s3.amazonaws.com/rfp-items/uGCFrYGkQ8.png',NULL,4,NULL);

/*Table structure for table `request_for_proposal_store` */

DROP TABLE IF EXISTS `request_for_proposal_store`;

CREATE TABLE `request_for_proposal_store` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_read` tinyint(1) DEFAULT NULL,
  `is_specific` tinyint(1) DEFAULT NULL,
  `rfp_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

/*Data for the table `request_for_proposal_store` */

insert  into `request_for_proposal_store`(`createdAt`,`updatedAt`,`id`,`is_read`,`is_specific`,`rfp_id`,`store_id`,`status_id`) values 
('2021-01-15 18:03:38','2021-01-15 18:03:38',1,0,1,1,13,1),
('2021-01-15 18:04:10','2021-01-15 18:04:10',2,0,0,2,8,23),
('2021-01-15 18:09:41','2021-01-15 18:09:41',3,0,0,2,13,23),
('2021-01-15 18:14:10','2021-01-15 18:14:10',4,0,0,2,15,1),
('2021-01-15 18:29:03','2021-01-15 18:30:20',5,0,1,3,13,2),
('2021-01-15 18:30:36','2021-01-15 18:30:58',6,0,1,4,13,2);

/*Table structure for table `rfp_queue` */

DROP TABLE IF EXISTS `rfp_queue`;

CREATE TABLE `rfp_queue` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `last_run_at` datetime DEFAULT NULL,
  `last_step` double DEFAULT NULL,
  `last_radius` double DEFAULT NULL,
  `rfp_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `rfp_queue` */

insert  into `rfp_queue`(`createdAt`,`updatedAt`,`id`,`last_run_at`,`last_step`,`last_radius`,`rfp_id`) values 
('2021-01-15 18:04:10','2021-01-15 18:14:10',1,'2021-01-15 18:14:10',6,100,2);

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1;

/*Data for the table `roles` */

insert  into `roles`(`createdAt`,`updatedAt`,`id`,`name`,`display_name`,`deletedAt`) values 
('2020-10-13 13:31:38','2020-10-14 08:08:20',11,'super_admin','Super Admin',NULL),
('2020-10-13 13:36:37','2020-11-06 12:36:06',21,'admin','Admin',NULL),
('2020-10-15 07:06:28','2020-10-15 07:06:28',51,'vt_admin','VT Admin',NULL);

/*Table structure for table `settings` */

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `value` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

/*Data for the table `settings` */

insert  into `settings`(`createdAt`,`updatedAt`,`id`,`key`,`display_name`,`value`) values 
('2020-09-15 17:46:10','2020-09-15 17:46:13',1,'vendor_reason1','Vendor Reson 1','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'),
('2020-09-15 17:46:16','2020-09-15 17:46:19',2,'vendor_reason2','Vendor Reason 2','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'),
('2020-09-15 17:46:23','2020-09-15 17:46:26',3,'vendor_reason3','Vendor Reason 3','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'),
('2020-09-15 17:46:10','2020-09-15 17:46:13',11,'driver_reason1','Vendor Reson 1','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'),
('2020-09-15 17:46:10','2020-09-15 17:46:13',21,'driver_reason2','Vendor Reson 1','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'),
('2020-09-15 17:46:10','2020-09-15 17:46:13',31,'driver_reason3','Vendor Reson 1','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s');

/*Table structure for table `statuses` */

DROP TABLE IF EXISTS `statuses`;

CREATE TABLE `statuses` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;

/*Data for the table `statuses` */

insert  into `statuses`(`createdAt`,`updatedAt`,`id`,`slug`,`description`,`deletedAt`) values 
('2020-09-09 12:57:14','2020-09-09 12:57:17',1,'pending','Pending',NULL),
('2020-09-09 12:57:21','2020-09-09 12:57:24',2,'accepted','Accepted',NULL),
('2020-09-09 12:57:27','2020-09-09 12:57:30',3,'completed','Completed',NULL),
('2020-09-09 12:57:35','2020-09-09 12:57:39',4,'rejected','Rejected',NULL),
('2020-09-09 12:57:42','2020-09-09 12:57:45',5,'deleted','Deleted',NULL),
('2020-09-11 18:34:53','2020-09-11 18:34:50',6,'confirmation_pending','Confirmation pending',NULL),
('2020-10-23 17:09:13','2020-10-23 17:09:10',7,'assigned','Assigned',NULL),
('2020-10-23 17:09:16','2020-10-23 17:09:19',8,'cancelled','Cancelled',NULL),
('2020-10-26 14:20:39','2020-10-26 14:20:43',9,'at_pickup','At Pickup',NULL),
('2020-10-26 14:20:47','2020-10-26 14:20:50',10,'picked_up','Picked Up',NULL),
('2020-10-26 14:22:13','2020-10-26 14:22:16',11,'delivery_started','Delivery Started',NULL),
('2020-10-26 14:22:20','2020-10-26 14:22:22',12,'at_delivery','At Delivery',NULL),
('2020-10-26 14:22:25','2020-10-26 14:22:27',13,'delivery_confirmed','Delivery Confirmed',NULL),
('2020-10-26 14:22:30','2020-10-26 14:22:33',14,'payment_received','Payment received',NULL),
('2020-10-26 15:46:00','2020-10-26 15:46:03',15,'delivered','Delivered',NULL),
('2020-10-28 11:41:04','2020-10-28 11:41:07',16,'assigned_online','Assigned online',NULL),
('2020-10-28 11:41:10','2020-10-28 11:41:13',17,'assigned_offline','Assigned offline',NULL),
('2020-10-28 15:38:47','2020-10-28 15:38:49',18,'assigned_waspha','Assigned waspha',NULL),
('2020-11-17 12:50:28','2020-11-17 12:50:31',19,'upcoming','Upcoming',NULL),
('2020-11-17 12:50:34','2020-11-17 12:50:37',20,'current','Current',NULL),
('2020-11-17 12:50:41','2020-11-17 12:50:45',21,'past','Past',NULL),
('2020-11-18 16:45:37','2020-11-18 16:45:40',22,'require_queue','Require queue',NULL),
('2020-11-18 16:57:38','2020-11-18 16:57:41',23,'expired','Expired',NULL),
('2020-11-19 14:23:47','2020-11-19 14:23:51',24,'closed','Closed',NULL),
('2020-11-19 14:23:47','2020-11-19 14:23:51',25,'prepared','Prepared',NULL),
('2020-11-19 14:23:47','2020-11-19 14:23:51',26,'revised','Revised',NULL);

/*Table structure for table `store_products` */

DROP TABLE IF EXISTS `store_products`;

CREATE TABLE `store_products` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

/*Data for the table `store_products` */

insert  into `store_products`(`createdAt`,`updatedAt`,`id`,`title`,`description`,`image`,`is_featured`,`deletedAt`,`store_id`,`category_id`,`subcategory_id`) values 
('2021-01-14 14:54:45','2021-01-14 14:54:45',22,'pizza','extra cheese','https://waspha.s3.amazonaws.com/products/xKgACPcMGU.png',0,NULL,8,10,NULL),
('2021-01-14 16:53:54','2021-01-14 16:53:54',23,'Ma joie','wonderful perfume','https://waspha.s3.amazonaws.com/products/zhTQeWKFPj.png',0,NULL,11,16,NULL),
('2021-01-14 16:54:37','2021-01-14 16:54:37',24,'Versace','wonderful perfume','https://waspha.s3.amazonaws.com/products/lVsH3Whxyc.png',0,NULL,11,16,NULL),
('2021-01-14 16:55:44','2021-01-14 16:55:44',25,'Vera Wang ','Vera Wang Princes ','https://waspha.s3.amazonaws.com/products/M6wC5Uv2zH.png',0,NULL,11,16,NULL),
('2021-01-14 16:57:06','2021-01-14 16:57:06',26,'Katz Bread','Whole Grain Bread','https://waspha.s3.amazonaws.com/products/QAwsQJsIXg.png',0,NULL,11,15,NULL),
('2021-01-14 16:57:56','2021-01-14 16:59:42',27,'Peanut Butter','Peanut Butter','https://waspha.s3.amazonaws.com/products/n0q7ucodUn.png',1,NULL,11,15,NULL),
('2021-01-14 16:58:51','2021-01-14 16:58:51',28,'Eggs ','Pack of 12 eggs','https://waspha.s3.amazonaws.com/products/upOdyH1NTo.png',0,NULL,11,15,NULL),
('2021-01-14 16:59:32','2021-01-14 16:59:32',29,'Milk','1 Liter Pack','https://waspha.s3.amazonaws.com/products/HM1TDkCUuO.png',0,NULL,11,15,NULL),
('2021-01-14 17:21:12','2021-01-14 17:21:12',30,'Carrot','Pack of 1 kg.','https://waspha.s3.amazonaws.com/products/CwzNLqpXJw.png',0,NULL,11,17,NULL),
('2021-01-14 17:21:41','2021-01-14 17:21:41',31,'Potato','Pack pf 5 kg.','https://waspha.s3.amazonaws.com/products/8vG3z6AQIU.png',0,NULL,11,17,NULL),
('2021-01-14 17:22:18','2021-01-14 17:22:18',32,'Chilli','Pack of half KG.','https://waspha.s3.amazonaws.com/products/YscXNfv39z.png',0,NULL,11,17,NULL),
('2021-01-14 17:26:39','2021-01-14 17:26:39',33,'Canolive','3 KG Bottle','https://waspha.s3.amazonaws.com/products/fASlMDQdLU.png',0,NULL,11,14,NULL),
('2021-01-14 17:27:09','2021-01-14 17:27:09',34,'Flora Oil','3 KG bottle','https://waspha.s3.amazonaws.com/products/EO2E91hj0B.png',0,NULL,11,14,NULL),
('2021-01-14 17:28:38','2021-01-14 17:28:38',35,'Butter Cookies','Best Cookies ','https://waspha.s3.amazonaws.com/products/pYPCifOm9y.png',1,NULL,11,12,NULL),
('2021-01-14 17:31:09','2021-01-14 17:31:09',36,'Soft Drinks ','Soft Drinks','https://waspha.s3.amazonaws.com/products/nLcsjG9gCd.png',0,NULL,11,12,NULL),
('2021-01-14 17:33:06','2021-01-14 17:33:06',37,'Orange Juice','Orange Juice ','https://waspha.s3.amazonaws.com/products/lmyseScAlL.png',0,NULL,11,NULL,NULL),
('2021-01-15 07:02:21','2021-01-15 07:02:21',38,'Advil','Best in fever and pain ','https://waspha.s3.amazonaws.com/products/bnPa4Ba1AJ.png',1,NULL,10,18,NULL),
('2021-01-15 07:03:39','2021-01-15 07:03:39',39,'Cibcos','Cough Syrup','https://waspha.s3.amazonaws.com/products/f3mJwTgm2D.png',0,NULL,10,18,NULL),
('2021-01-15 07:05:29','2021-01-15 07:05:29',40,'Aceperv','Paracetamol','https://waspha.s3.amazonaws.com/products/XkkphuCsQg.png',0,NULL,10,18,NULL);

/*Table structure for table `store_reviews_ratings` */

DROP TABLE IF EXISTS `store_reviews_ratings`;

CREATE TABLE `store_reviews_ratings` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `review` text,
  `rating` double DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Data for the table `store_reviews_ratings` */

insert  into `store_reviews_ratings`(`createdAt`,`updatedAt`,`id`,`review`,`rating`,`deletedAt`,`store_id`,`order_id`,`user_id`,`driver_id`) values 
('2021-01-14 20:17:36','2021-01-14 20:17:36',9,NULL,5,NULL,11,21,44,NULL),
('2021-01-15 07:36:59','2021-01-15 07:36:59',10,NULL,3,NULL,8,31,44,NULL);

/*Table structure for table `store_subcategory` */

DROP TABLE IF EXISTS `store_subcategory`;

CREATE TABLE `store_subcategory` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;

/*Data for the table `store_subcategory` */

insert  into `store_subcategory`(`createdAt`,`updatedAt`,`id`,`store_id`,`subcategory_id`) values 
('2021-01-14 14:32:29','2021-01-14 14:32:29',44,8,3),
('2021-01-14 15:15:19','2021-01-14 15:15:19',45,9,84),
('2021-01-14 15:26:21','2021-01-14 15:26:21',46,10,84),
('2021-01-14 15:34:58','2021-01-14 15:34:58',47,11,4),
('2021-01-14 15:42:37','2021-01-14 15:42:37',48,12,4),
('2021-01-14 14:32:29','2021-01-14 14:32:29',49,8,85),
('2021-01-14 15:34:58','2021-01-14 15:34:58',50,11,87),
('2021-01-14 15:42:37','2021-01-14 15:42:37',51,12,87),
('2021-01-14 17:58:13','2021-01-14 17:58:13',52,13,3),
('2021-01-14 17:58:13','2021-01-14 17:58:13',53,13,85),
('2021-01-14 19:00:31','2021-01-14 19:00:31',54,14,87),
('2021-01-14 19:00:31','2021-01-14 19:00:31',55,14,4),
('2021-01-14 19:03:53','2021-01-14 19:03:53',56,15,85),
('2021-01-14 19:03:53','2021-01-14 19:03:53',57,15,3);

/*Table structure for table `store_timings` */

DROP TABLE IF EXISTS `store_timings`;

CREATE TABLE `store_timings` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` varchar(255) DEFAULT NULL,
  `from` datetime DEFAULT NULL,
  `to` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `store_timings` */

/*Table structure for table `test_table` */

DROP TABLE IF EXISTS `test_table`;

CREATE TABLE `test_table` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `location` point DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `test_table` */

/*Table structure for table `tokens` */

DROP TABLE IF EXISTS `tokens`;

CREATE TABLE `tokens` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` double DEFAULT NULL,
  `token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4130 DEFAULT CHARSET=latin1;

/*Data for the table `tokens` */

insert  into `tokens`(`createdAt`,`updatedAt`,`id`,`user_id`,`token`) values 
('2021-01-14 12:56:34','2021-01-14 12:56:34',4048,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJBbGV4aXMgQ2FydGVyIiwiZW1haWwiOiJhbGV4aXNjYXJ0ZXIuMDA0MTdAZ21haWwuY29tIiwidW5pcXVlX2lkIjoiZWUyODk3YjAtNTY2Ny0xMWViLTk4OTgtNGIzNTgxMTUyYmQ0IiwiaWF0IjoxNjEwNjI4OTk0fQ.AlsNAh3Fh98JgucZEvqq0_yMpErgaArTzs3Ck_-bgu8'),
('2021-01-14 12:58:43','2021-01-14 12:58:43',4049,43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMsIm5hbWUiOiJBc2hhciIsImVtYWlsIjoiYXNoYXJzYXJ3YXIxODZAZ21haWwuY29tIiwidW5pcXVlX2lkIjoiM2FlZTM3ZDAtNTY2OC0xMWViLTk4OTgtNGIzNTgxMTUyYmQ0IiwiaWF0IjoxNjEwNjI5MTIzfQ.pKnrEhnnrLLbOy2Qh4AYBaKswGZKDL_PHMUxxoVSpS0'),
('2021-01-14 13:20:15','2021-01-14 13:20:15',4050,461,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYxLCJuYW1lIjoiU2FsbWEgQWxpIiwiZW1haWwiOiJzYWxtYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIzZDJhZGEwMC01NjZiLTExZWItOTg5OC00YjM1ODExNTJiZDQiLCJpYXQiOjE2MTA2MzA0MTV9.CcA94TwFpbt_0MfCHxxhCUchUt6BmqMUOu-Ws6jjOGY'),
('2021-01-14 13:28:32','2021-01-14 13:28:32',4051,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI2NGY0OTdhMC01NjZjLTExZWItOTg5OC00YjM1ODExNTJiZDQiLCJpYXQiOjE2MTA2MzA5MTF9.2MqZxgFND_0iiyDBDLBtm1s0bRZETZy3XxqKWas0ulM'),
('2021-01-14 14:13:22','2021-01-14 14:13:22',4052,462,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYyLCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJhOGE1NTRjMC01NjcyLTExZWItOTg5OC00YjM1ODExNTJiZDQiLCJpYXQiOjE2MTA2MzM2MDJ9.rtww0vY5VnJGl09QDoJwfiayJMN6UnMIqLY-7FxxMVc'),
('2021-01-14 14:18:54','2021-01-14 14:18:54',4053,463,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYzLCJuYW1lIjoic2hhaGVlciBhbGkiLCJlbWFpbCI6InNoYWhlZXJhbGlAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI2ZWJkYzM5MC01NjczLTExZWItOTg5OC00YjM1ODExNTJiZDQiLCJpYXQiOjE2MTA2MzM5MzR9.Pav6GQZs21OHq126xbDr2DMQYwyJqTSkNi5A7-hoJRo'),
('2021-01-14 14:19:08','2021-01-14 14:19:08',4054,464,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY0LCJuYW1lIjoiTXVoYW1tYWQgU2lkZGlxdWUgdXIgUmVobWFuIiwiZW1haWwiOiJzaWRkaXF1ZS5xYXppOTI5MkBnbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI3NmRhZjE2MC01NjczLTExZWItOTg5OC00YjM1ODExNTJiZDQiLCJpYXQiOjE2MTA2MzM5NDh9.Lvlm1r_iA0GH-o17aqdiWLVPdibby2wKLHx9TMTY54w'),
('2021-01-14 14:22:14','2021-01-14 14:22:14',4055,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1cGVyIEFkbWluIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImU1ZjZkYTAwLTU2NzMtMTFlYi05ODk4LTRiMzU4MTE1MmJkNCIsImlhdCI6MTYxMDYzNDEzNH0.Es1Mb4rd4NSlyKrnQKlo7g9O5P6LHzVe5CpFwWuU0w0'),
('2021-01-14 14:30:34','2021-01-14 14:30:34',4056,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIwZmRmY2UyMC01Njc1LTExZWItOTg5OC00YjM1ODExNTJiZDQiLCJpYXQiOjE2MTA2MzQ2MzR9.Nt94rA2Wjl1j-pC81qtBo510oXPfM1fe4_vVZGAca7Y'),
('2021-01-14 15:14:02','2021-01-14 15:14:02',4057,466,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY2LCJuYW1lIjoiYWJyYXIgYWhtZWQiLCJlbWFpbCI6ImFicmFyYWhtZWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIyMjJmOGQ4MC01NjdiLTExZWItYWQ4OS02NzhiMjM2ZDNiZTEiLCJpYXQiOjE2MTA2MzcyNDF9.4VaOm4-9cKYEGU0kIAzcn9leFTSWTGaCX6IhFbpZHGU'),
('2021-01-14 15:20:23','2021-01-14 15:20:23',4058,467,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY3LCJuYW1lIjoiWnViYWlyIiwiZW1haWwiOiJ6dWJhaXJAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIwNTJiMDE1MC01NjdjLTExZWItYWQ4OS02NzhiMjM2ZDNiZTEiLCJpYXQiOjE2MTA2Mzc2MjJ9.Dz3tkCzAewBkkruLDfASy4naiLxvRuNAEday2oHksQY'),
('2021-01-14 15:21:56','2021-01-14 15:21:56',4059,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1cGVyIEFkbWluIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6IjNjOTdkOTEwLTU2N2MtMTFlYi1hZDg5LTY3OGIyMzZkM2JlMSIsImlhdCI6MTYxMDYzNzcxNX0.PaPAQ1aYolzAa7yrPIR2qfOh31PkaNq4ZfCrRQSNhHY'),
('2021-01-14 15:33:30','2021-01-14 15:33:30',4060,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJkYTZlMTQwMC01NjdkLTExZWItYWQ4OS02NzhiMjM2ZDNiZTEiLCJpYXQiOjE2MTA2Mzg0MTB9.rkKY3iAN1nQMeDEyN1XhxbqHhwcB-0PiplZjaG8jxlM'),
('2021-01-14 15:40:34','2021-01-14 15:40:34',4061,469,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY5LCJuYW1lIjoiU2FmZWVyIiwiZW1haWwiOiJzYWZlZXJAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJkNmQzNDQ5MC01NjdlLTExZWItYWQ4OS02NzhiMjM2ZDNiZTEiLCJpYXQiOjE2MTA2Mzg4MzN9.tUyMmGPmbZUWDK7STEtwLwp7O3IS1YLVQnfmtbl6ALc'),
('2021-01-14 15:42:17','2021-01-14 15:42:17',4062,470,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcwLCJuYW1lIjoiTXVoYW1tYWQgU2lkZGlxdWUgdXIgUmVobWFuIiwiZW1haWwiOiJzaWRkaXF1ZS5xYXppOTI5MkBnbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIxNDljZmM4MC01NjdmLTExZWItYWQ4OS02NzhiMjM2ZDNiZTEiLCJpYXQiOjE2MTA2Mzg5Mzd9.ImXF8CgaYuQInAAx8mYgZQ2gcmB4i59VqHA3Q569tL4'),
('2021-01-14 15:49:55','2021-01-14 15:49:55',4063,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIyNWE0OWRjMC01NjgwLTExZWItYWQ4OS02NzhiMjM2ZDNiZTEiLCJpYXQiOjE2MTA2MzkzOTV9.shwVE_6weFcZeQ1ZobSD_ri3I-dJ7nsIbTQboTlyqUA'),
('2021-01-14 15:59:08','2021-01-14 15:59:08',4064,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI2ZjEzNTU0MC01NjgxLTExZWItYWQ4OS02NzhiMjM2ZDNiZTEiLCJpYXQiOjE2MTA2Mzk5NDd9.vzJeu1hgaZT638gOKFtfie2sau4_L7S2pdZ5q-AfcfI'),
('2021-01-14 16:09:46','2021-01-14 16:09:46',4065,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJlYjE5YjVjMC01NjgyLTExZWItYjgwYy03MTUxNzAwNzY2NTQiLCJpYXQiOjE2MTA2NDA1ODV9.kYdjn0cdGVo0F7IKSBDYAiW0J5eE7XOpwCXPSfq7rM4'),
('2021-01-14 16:20:38','2021-01-14 16:20:38',4066,45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDUsIm5hbWUiOiJUYWJhc3N1bSBXYWppZCIsImVtYWlsIjoidGFiYXNzdW13YWppZDIwMDVAZ21haWwuY29tIiwidW5pcXVlX2lkIjoiNmZjOGUyNDAtNTY4NC0xMWViLWI4MGMtNzE1MTcwMDc2NjU0IiwiaWF0IjoxNjEwNjQxMjM3fQ.LseSOcLpGmgu7jpjR9zPny00CpgO-YsA0RLkkHgUA-c'),
('2021-01-14 16:34:00','2021-01-14 16:34:00',4067,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI0ZTJjZmUzMC01Njg2LTExZWItYjgwYy03MTUxNzAwNzY2NTQiLCJpYXQiOjE2MTA2NDIwNDB9.2SIQeRSvESyV8RXlfPE-lGsxqmuAgLAPeOSu5G9kJNE'),
('2021-01-14 16:36:32','2021-01-14 16:36:32',4068,24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsIm5hbWUiOiJTYWxtYW4iLCJlbWFpbCI6InNhbG1hbkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImE4ZTZkYTgwLTU2ODYtMTFlYi1iODBjLTcxNTE3MDA3NjY1NCIsImlhdCI6MTYxMDY0MjE5Mn0.KUQ8ObsDkGFUGphYZJhUffBH2Jhzn49KSFE7C2we9sk'),
('2021-01-14 17:29:17','2021-01-14 17:29:17',4069,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIwNzZiOWQ1MC01NjhlLTExZWItYmUwYi03ZDQ1NTZmMzNiMTMiLCJpYXQiOjE2MTA2NDUzNTd9.hd67eNyYKSRt2JAGPKPia7nLzBOLXdCc-XP9ZDk2PJQ'),
('2021-01-14 17:29:53','2021-01-14 17:29:53',4070,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIxYzU1ZWM3MC01NjhlLTExZWItYmUwYi03ZDQ1NTZmMzNiMTMiLCJpYXQiOjE2MTA2NDUzOTJ9.1MaHh54oYqtmYsCC4M7DEPJIIKYiT01hCEVwsw-TD2M'),
('2021-01-14 17:33:56','2021-01-14 17:33:56',4071,469,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY5LCJuYW1lIjoiU2FmZWVyIiwiZW1haWwiOiJzYWZlZXJAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJhZDU2OTcxMC01NjhlLTExZWItYmUwYi03ZDQ1NTZmMzNiMTMiLCJpYXQiOjE2MTA2NDU2MzV9.VpZ0ZPlu8C20J5x4qpvhoLYV_IYjZbsxezLbXv-SZT8'),
('2021-01-14 17:43:20','2021-01-14 17:43:20',4072,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJmZDVkNjMwMC01NjhmLTExZWItYmUwYi03ZDQ1NTZmMzNiMTMiLCJpYXQiOjE2MTA2NDYxOTl9.XDqyQ8zQmQaudvcWTpSjEysRpn2VVvKGCwvhZk-R5s4'),
('2021-01-14 17:47:01','2021-01-14 17:47:01',4073,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI4MTM5ZjJiMC01NjkwLTExZWItYmUwYi03ZDQ1NTZmMzNiMTMiLCJpYXQiOjE2MTA2NDY0MjB9.lvCeYeTxMEh_Jjam_zGWK-n6rovB1mFacCy4PNuMGdw'),
('2021-01-14 17:51:47','2021-01-14 17:51:47',4074,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIyYjgzNjQ5MC01NjkxLTExZWItYmUwYi03ZDQ1NTZmMzNiMTMiLCJpYXQiOjE2MTA2NDY3MDZ9.gqmLaFDri8cGlBpFwu9wCsPXh_d7Cor1HU5OyC5JJzY'),
('2021-01-14 17:51:59','2021-01-14 17:51:59',4075,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIzMzAwYThlMC01NjkxLTExZWItYmUwYi03ZDQ1NTZmMzNiMTMiLCJpYXQiOjE2MTA2NDY3MTl9.pDlWiYMEUB0LwB53TuQn4kzoblcPvQKOn11ytV-Pd9o'),
('2021-01-14 17:57:45','2021-01-14 17:57:45',4076,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIwMGViY2YwMC01NjkyLTExZWItYWYyOS00MTdhM2E1ODE3MmEiLCJpYXQiOjE2MTA2NDcwNjR9.vdKrL6s9j4gdZ1UONhhptJDn6wfRzYFGFN0Y5slAKXs'),
('2021-01-14 18:33:51','2021-01-14 18:33:51',4077,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIwYzRmYWExMC01Njk3LTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NDkyMzF9.PJS279qOmf-xy63ZntWaeI1JpR9coxnPMCkW3HU_0sE'),
('2021-01-14 18:36:29','2021-01-14 18:36:29',4078,467,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY3LCJuYW1lIjoiWnViYWlyIiwiZW1haWwiOiJ6dWJhaXJAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI2YTk0MGNiMC01Njk3LTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NDkzODl9.GA1jgtOwTG8pCqXYCILt7U-hP-0v46uBAq4PQ-TYJIc'),
('2021-01-14 18:39:18','2021-01-14 18:39:18',4079,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJjZWQ0MWNiMC01Njk3LTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NDk1NTd9.CcfhVql1Rjb5-QL-OfNZGxvsIR05zBYiLF3KlM4pD2k'),
('2021-01-14 18:45:42','2021-01-14 18:45:42',4080,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJiM2RkNjFlMC01Njk4LTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NDk5NDF9.UGYAFfCmrGZPBJgNqiX8HEUpg17DgiZxWY1q_mP-x9E'),
('2021-01-14 18:48:11','2021-01-14 18:48:11',4081,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIwY2M4YmZjMC01Njk5LTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NTAwOTB9.gfutoQnsVLkMDfXGV7DSTwN4Zrsw3_sGeaKaM9hC5HI'),
('2021-01-14 18:48:40','2021-01-14 18:48:40',4082,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIxZGY1MWM4MC01Njk5LTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NTAxMTl9.vAawuXcO9XP2e1cKCo2BeyTtofYCs_519T-xdiROMRU'),
('2021-01-14 18:51:47','2021-01-14 18:51:47',4083,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI4ZDQ1ZDBjMC01Njk5LTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NTAzMDZ9.PiQzkCeV7A4GpYNB0jVD268d_NvhQm0ISk-hHKtnQZM'),
('2021-01-14 18:59:11','2021-01-14 18:59:11',4084,471,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcxLCJuYW1lIjoiTWFheiIsImVtYWlsIjoibWFhekBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6Ijk2NjJlY2YwLTU2OWEtMTFlYi1iOGVmLTFkNzNmMzUzNTRiMiIsImlhdCI6MTYxMDY1MDc1MX0.viiZe9sbV4l0oI-hzVu-7NuzKH9nzyIyqftra7w4xBA'),
('2021-01-14 23:59:35','2021-01-14 23:59:35',4085,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJhNDVkYjhkMC01NjlhLTExZWItYWQyZS1iMTZlYjVkYWIyNmQiLCJpYXQiOjE2MTA2NTA3NzR9.FVqI-BvJpSbOJDBKi3R7FH289ZO922VtVQNhdq9lACU'),
('2021-01-14 19:02:20','2021-01-14 19:02:20',4086,472,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcyLCJuYW1lIjoiRGFuaXNoIEFsaSIsImVtYWlsIjoiZGFuaXNoQG1haWwuY29tIiwidW5pcXVlX2lkIjoiMDcxMTgzODAtNTY5Yi0xMWViLWI4ZWYtMWQ3M2YzNTM1NGIyIiwiaWF0IjoxNjEwNjUwOTQwfQ.xhz8YAk3fpeD11tRc0EfWiDUqeTVC4LwhwX_Jx-TPic'),
('2021-01-14 19:04:59','2021-01-14 19:04:59',4087,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI2NTdjMGJjMC01NjliLTExZWItYjhlZi0xZDczZjM1MzU0YjIiLCJpYXQiOjE2MTA2NTEwOTh9.yHDTEXl5AylSnsaDyiWE43vY9L45FrX7qO0-p-y8uWI'),
('2021-01-15 00:06:07','2021-01-15 00:06:07',4088,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1cGVyIEFkbWluIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6IjhlMDAzNTMwLTU2OWItMTFlYi1hYjY0LTY5MmI4OWI3MWQ4ZiIsImlhdCI6MTYxMDY1MTE2Nn0.nURcFE-wcxYZl2IYI9I4Va7BsLZMJg73vCLSbrVkLAM'),
('2021-01-14 19:18:56','2021-01-14 19:18:56',4089,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI1ODY0ODkxMC01NjlkLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTE5MzV9.89q11LC1L4HjNvwDEKPV_bOgWUYhN_0aAZxXxp34oI0'),
('2021-01-14 19:26:24','2021-01-14 19:26:24',4090,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI2MzRhZjM5MC01NjllLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTIzODN9.ZXLsREpMnP38d-6MsbOnW09yzN81gNblEEd73QePthE'),
('2021-01-14 19:29:43','2021-01-14 19:29:43',4091,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJkYTQ1NTM1MC01NjllLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTI1ODN9.nCoRdXchvgXU71X1MS3C73ENQ8uvGHu_Oi-c_rIuhxE'),
('2021-01-14 19:30:45','2021-01-14 19:30:45',4092,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJmZWUxNDYxMC01NjllLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTI2NDR9.Ek66rZLxdmXKTUdqOuHwEvIZCctvDIrBjabamDnyC-8'),
('2021-01-14 19:31:03','2021-01-14 19:31:03',4093,470,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcwLCJuYW1lIjoiTXVoYW1tYWQgU2lkZGlxdWUgdXIgUmVobWFuIiwiZW1haWwiOiJzaWRkaXF1ZS5xYXppOTI5MkBnbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIwOTk3OTU1MC01NjlmLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTI2NjJ9.p9gK2MLztS7itQZ4Gp4lRJBbJQrQbjKd7ZSAag6x4P8'),
('2021-01-14 19:56:38','2021-01-14 19:56:38',4094,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI5ZDA0MmY4MC01NmEyLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTQxOTh9.M-Pu3eKoqxdydRVhE0tCKRc-UjxRg6SuwAWySNZY2yw'),
('2021-01-14 19:58:34','2021-01-14 19:58:34',4095,46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsIm5hbWUiOiJNdWhhbW1hZCBTaWRkaXF1ZSB1ciBSZWhtYW4iLCJlbWFpbCI6InNpZGRpcXVlLnFhemk5MjkyQGdtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImUyMzBlZDAwLTU2YTItMTFlYi1hZmZjLTEzNDcwYzIxOGRlZCIsImlhdCI6MTYxMDY1NDMxNH0.uz_118mr3Cn3WdXjhWDzd1k9r9IgAHCnk5H9y9qH2y0'),
('2021-01-14 20:01:29','2021-01-14 20:01:29',4096,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI0YTFhN2QwMC01NmEzLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTQ0ODh9.CNZSj3fPPjSyHzo5RuFdEJ5Mx5QB5RD_9VTYx2nZuEk'),
('2021-01-14 20:02:01','2021-01-14 20:02:01',4097,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI1ZDc1Nzk5MC01NmEzLTExZWItYWZmYy0xMzQ3MGMyMThkZWQiLCJpYXQiOjE2MTA2NTQ1MjF9.vTDR9XyVE5KMio7nM3hEStI5GQdVnT-A3PgRHXiglAE'),
('2021-01-14 20:11:58','2021-01-14 20:11:58',4098,25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsIm5hbWUiOiJBbGkiLCJlbWFpbCI6ImFsaUBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImMxMTBjOGEwLTU2YTQtMTFlYi04MzlkLTIzNGI2ZjI5NWQ1MCIsImlhdCI6MTYxMDY1NTExN30.XxTU7TcfFWAyUUthC0UEJ6Ii1gm8RR-dhq8DaTD6n-M'),
('2021-01-14 20:21:22','2021-01-14 20:21:22',4099,26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsIm5hbWUiOiJLYXNoaWYiLCJlbWFpbCI6Imthc2hpZkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6IjExMjA0NzIwLTU2YTYtMTFlYi1iZWVhLTRmODU0MmIwMDMyZSIsImlhdCI6MTYxMDY1NTY4MX0.UuvSOEuKEtqL2ay3DmwpieXnrdPiBfojfEAd3EEyN7U'),
('2021-01-14 20:24:38','2021-01-14 20:24:38',4100,26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsIm5hbWUiOiJLYXNoaWYiLCJlbWFpbCI6Imthc2hpZkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6Ijg2MWQwMjIwLTU2YTYtMTFlYi1iZWVhLTRmODU0MmIwMDMyZSIsImlhdCI6MTYxMDY1NTg3N30.wZxPZMJNAhL0CSNO5N8VImDGCK7YQ_RHNWhCewZiICQ'),
('2021-01-14 20:35:02','2021-01-14 20:35:02',4101,46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsIm5hbWUiOiJNdWhhbW1hZCBTaWRkaXF1ZSB1ciBSZWhtYW4iLCJlbWFpbCI6InNpZGRpcXVlLnFhemk5MjkyQGdtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImZhNDQ3NjUwLTU2YTctMTFlYi1iZWVhLTRmODU0MmIwMDMyZSIsImlhdCI6MTYxMDY1NjUwMn0.T_3Zecxc7OipZuEHQIIIsNFLB--2Ki59A3dR1nJb_ro'),
('2021-01-14 21:34:26','2021-01-14 21:34:26',4102,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI0NmExNmZmMC01NmIwLTExZWItYTBlNy1hNTg3M2YwOTUzMDMiLCJpYXQiOjE2MTA2NjAwNjZ9.VAl03ZfRnz3NLn9Ka5cyvzlq0ZU1UtueuT_yRbALNcw'),
('2021-01-14 21:36:07','2021-01-14 21:36:07',4103,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI4MmE3Y2QwMC01NmIwLTExZWItYTBlNy1hNTg3M2YwOTUzMDMiLCJpYXQiOjE2MTA2NjAxNjd9.0Rl2foXx1IqfRODoIHRZdn_uH8Om4pJ4wYnkKGEsF2I'),
('2021-01-15 02:35:59','2021-01-15 02:35:59',4104,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI3ZTFhNTVhMC01NmIwLTExZWItYWIxZC1kN2NhNGYyMDgxMDkiLCJpYXQiOjE2MTA2NjAxNTl9.V8sGDagmqks8Zyj_8Mveqam3KpjVQf74x-8hBOjJCFo'),
('2021-01-14 22:16:52','2021-01-14 22:16:52',4105,473,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDczLCJuYW1lIjoiTWFyaWJldGggQ2FzdGVlbCIsImVtYWlsIjoibWFyaWJldGhjYXN0ZWVsLjk0MjY0QGdtYWlsLmNvbSIsInVuaXF1ZV9pZCI6IjM0MDc2YWIwLTU2YjYtMTFlYi1hMGU3LWE1ODczZjA5NTMwMyIsImlhdCI6MTYxMDY2MjYxMn0.UbH5UeoWF9kuRtiJes8Ec-5Kl38KMRflIWp39VnfYmU'),
('2021-01-14 22:20:11','2021-01-14 22:20:11',4106,473,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDczLCJuYW1lIjoiTWFyaWJldGggQ2FzdGVlbCIsImVtYWlsIjoibWFyaWJldGhjYXN0ZWVsLjk0MjY0QGdtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImFhNjAzMzQwLTU2YjYtMTFlYi1hMGU3LWE1ODczZjA5NTMwMyIsImlhdCI6MTYxMDY2MjgxMH0.cTpaC7bXR6OcrvQtQqB_VKbjgC2iA1dF_UyZDyVrnRQ'),
('2021-01-15 06:53:21','2021-01-15 06:53:21',4107,47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcsIm5hbWUiOiJIYXJyaXMgS2hhbiIsImVtYWlsIjoiaGFyaXNAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI1YWJiYzg3MC01NmZlLTExZWItODFlOS0zMTVjM2YxMTE5MDciLCJpYXQiOjE2MTA2OTM2MDB9.58ZhWaO4hBXbypNTq1E0MEMvDuGAHTeKwc7geI8dW58'),
('2021-01-15 06:59:25','2021-01-15 06:59:25',4108,467,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY3LCJuYW1lIjoiWnViYWlyIiwiZW1haWwiOiJ6dWJhaXJAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIzMzdhZDdmMC01NmZmLTExZWItODFlOS0zMTVjM2YxMTE5MDciLCJpYXQiOjE2MTA2OTM5NjR9.GLmZkuen4IgAGm00MVjBXO2CzzdCaEjogd7hsTnYs1w'),
('2021-01-15 07:11:54','2021-01-15 07:11:54',4109,471,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcxLCJuYW1lIjoiTWFheiIsImVtYWlsIjoibWFhekBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImYxZjhjMTAwLTU3MDAtMTFlYi04MWU5LTMxNWMzZjExMTkwNyIsImlhdCI6MTYxMDY5NDcxM30.n5WS9QDx3MDB6lGz4BEYcKPQbVUAP5RPLSlFJtiJ-No'),
('2021-01-15 07:12:54','2021-01-15 07:12:54',4110,472,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcyLCJuYW1lIjoiRGFuaXNoIEFsaSIsImVtYWlsIjoiZGFuaXNoQG1haWwuY29tIiwidW5pcXVlX2lkIjoiMTYxZDEyYzAtNTcwMS0xMWViLTgxZTktMzE1YzNmMTExOTA3IiwiaWF0IjoxNjEwNjk0Nzc0fQ.lk8oGcLjCih8un0f84LIee3dK135rbZSOfgfYbmiaYs'),
('2021-01-15 07:14:00','2021-01-15 07:14:00',4111,472,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcyLCJuYW1lIjoiRGFuaXNoIEFsaSIsImVtYWlsIjoiZGFuaXNoQG1haWwuY29tIiwidW5pcXVlX2lkIjoiM2Q3NjllZTAtNTcwMS0xMWViLTgxZTktMzE1YzNmMTExOTA3IiwiaWF0IjoxNjEwNjk0ODQwfQ.u3x75N6a1epUE9yrLBAb6OyGlhbUYl5-jeUiOSa7ZgY'),
('2021-01-15 07:24:45','2021-01-15 07:24:45',4112,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJiZGJlZWVkMC01NzAyLTExZWItODFlOS0zMTVjM2YxMTE5MDciLCJpYXQiOjE2MTA2OTU0ODR9._si2JyrRheEVnUABT03Mw0C1pdHSGbllhLl92j8lX4g'),
('2021-01-15 07:25:57','2021-01-15 07:25:57',4113,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJlODkzMjJjMC01NzAyLTExZWItODFlOS0zMTVjM2YxMTE5MDciLCJpYXQiOjE2MTA2OTU1NTZ9.9YYmEyHGK4TtDSC6ltfBLW8AgTlhMyXyvrbD3riadqI'),
('2021-01-15 07:56:30','2021-01-15 07:56:30',4114,30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsIm5hbWUiOiJBbWlyIiwiZW1haWwiOiJhbWlyQG1haWwuY29tIiwidW5pcXVlX2lkIjoiMmNmYmQwMjAtNTcwNy0xMWViLWIyZTUtZGY5Yzk4YzNlYjk2IiwiaWF0IjoxNjEwNjk3Mzg5fQ.aabOjdQh3eUbaxdBiq_mwOsXsX9HGjY5qXL3uqQqago'),
('2021-01-15 08:05:07','2021-01-15 08:05:07',4115,30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsIm5hbWUiOiJBbWlyIiwiZW1haWwiOiJhbWlyQG1haWwuY29tIiwidW5pcXVlX2lkIjoiNjExODlkMTAtNTcwOC0xMWViLWIyZTUtZGY5Yzk4YzNlYjk2IiwiaWF0IjoxNjEwNjk3OTA2fQ.D6Qy3d0pOTXeBHpq8uBY04iUV37TFrSAouF4l-BefD4'),
('2021-01-15 08:52:10','2021-01-15 08:52:10',4116,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1cGVyIEFkbWluIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImY0MjdjZGEwLTU3MGUtMTFlYi1iMmU1LWRmOWM5OGMzZWI5NiIsImlhdCI6MTYxMDcwMDczMH0.pneHa__T40NWIu_RjtZyScelXB5XDV-XIzTynX17tkI'),
('2021-01-15 08:55:14','2021-01-15 08:55:14',4117,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1cGVyIEFkbWluIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6IjYxN2VmYmQwLTU3MGYtMTFlYi1iMmU1LWRmOWM5OGMzZWI5NiIsImlhdCI6MTYxMDcwMDkxM30.rPzM2ZF9m9iLAgvIcEE1PIn4m49I85oBqohBxfkXA84'),
('2021-01-15 08:57:43','2021-01-15 08:57:43',4118,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJiYTNkZjI4MC01NzBmLTExZWItYjJlNS1kZjljOThjM2ViOTYiLCJpYXQiOjE2MTA3MDEwNjJ9.myJ5dH5tPBXvJyPjb7PnMfLVgjwBMjaHlzpzgQUfiYg'),
('2021-01-15 09:01:05','2021-01-15 09:01:05',4119,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIzMzE4YWIwMC01NzEwLTExZWItYjJlNS1kZjljOThjM2ViOTYiLCJpYXQiOjE2MTA3MDEyNjV9.U2XpJoOiFQONdAur8aGxSoHjNj18qh2oLj9FWJISrU0'),
('2021-01-15 14:04:54','2021-01-15 14:04:54',4120,465,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY1LCJuYW1lIjoiU2hhYW4iLCJlbWFpbCI6InNoYW5AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJiYjE4MzA3MC01NzEwLTExZWItYjZmZS0yNTM0NDU2ZDBhZmEiLCJpYXQiOjE2MTA3MDE0OTN9.GcyuvEOTn4OXJfWYbapH08hz3mupRoxj31JFo17pBLo'),
('2021-01-15 14:09:29','2021-01-15 14:09:29',4121,470,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcwLCJuYW1lIjoiTXVoYW1tYWQgU2lkZGlxdWUgdXIgUmVobWFuIiwiZW1haWwiOiJzaWRkaXF1ZS5xYXppOTI5MkBnbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI1Zjk1ZGU5MC01NzExLTExZWItYjZmZS0yNTM0NDU2ZDBhZmEiLCJpYXQiOjE2MTA3MDE3Njl9.06DLT4x2yySxVIzTLGVIWhftRXlZ-cYdXeZaa_bjWTw'),
('2021-01-15 09:10:14','2021-01-15 09:10:14',4122,470,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcwLCJuYW1lIjoiTXVoYW1tYWQgU2lkZGlxdWUgdXIgUmVobWFuIiwiZW1haWwiOiJzaWRkaXF1ZS5xYXppOTI5MkBnbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI3YTIwYzJjMC01NzExLTExZWItYjJlNS1kZjljOThjM2ViOTYiLCJpYXQiOjE2MTA3MDE4MTR9.Bp_S8pa79At9pJQaSaChwyJb-26pchjjmzs1Tcy8lPI'),
('2021-01-15 09:12:39','2021-01-15 09:12:39',4123,468,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY4LCJuYW1lIjoiSGFzaGltIiwiZW1haWwiOiJoYXNoaW1AbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiJkMGQ0ZjU1MC01NzExLTExZWItYjJlNS1kZjljOThjM2ViOTYiLCJpYXQiOjE2MTA3MDE5NTl9.A1C9iDqVPe_EgwA9LpmjBaPZTV39kRYpr3sVwXgpysA'),
('2021-01-15 15:00:09','2021-01-15 15:00:09',4124,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiI3MzVlYjNmMC01NzE4LTExZWItYjIyZC1mMTczOThjODY0NTIiLCJpYXQiOjE2MTA3MDQ4MDl9.Y6yAl1W3nlooM3akTCUWeCHkh0E3ZEci-nh26CThZ7I'),
('2021-01-15 16:22:59','2021-01-15 16:22:59',4125,30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsIm5hbWUiOiJBbWlyIiwiZW1haWwiOiJhbWlyQG1haWwuY29tIiwidW5pcXVlX2lkIjoiMDU2OWExYTAtNTcyNC0xMWViLTg0ZjQtMTk5YWFiZmRhMGI3IiwiaWF0IjoxNjEwNzA5Nzc4fQ.7OW-PaoX8WL_8-7YToo5NhzYeiHYANrYk_VHV7AjBV8'),
('2021-01-15 16:33:25','2021-01-15 16:33:25',4126,333,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzMzLCJuYW1lIjoiQW1pcjExMSIsImVtYWlsIjoiYW1pckBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6IjdhY2M3YzAwLTU3MjUtMTFlYi05NDE1LWUxMjU5MGM5MDllMSIsImlhdCI6MTYxMDcxMDQwNX0.mCr4DO5M6YUcLI-7s1gN84raoD0UUaOmShirMaFh9xc'),
('2021-01-15 17:21:02','2021-01-15 17:21:02',4127,470,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcwLCJuYW1lIjoiTXVoYW1tYWQgU2lkZGlxdWUgdXIgUmVobWFuIiwiZW1haWwiOiJzaWRkaXF1ZS5xYXppOTI5MkBnbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIyMTczZDkzMC01NzJjLTExZWItODNhNC0xNzljNjY5NzRjZDQiLCJpYXQiOjE2MTA3MTMyNjF9.poNGZ5aqZQU9x74__N-buk7NNvIa5fmkI-MU8ZFstqY'),
('2021-01-15 17:27:49','2021-01-15 17:27:49',4128,44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsIm5hbWUiOiJLaGFsaWQgQWxpIiwiZW1haWwiOiJraGFsaWRAbWFpbC5jb20iLCJ1bmlxdWVfaWQiOiIxNDg2OTA0MC01NzJkLTExZWItODNhNC0xNzljNjY5NzRjZDQiLCJpYXQiOjE2MTA3MTM2Njl9.ar42PcxaZw7ExL-PAZ1ll-bR-iDE2n7S-ZK5NSL5XBg'),
('2021-01-19 16:09:18','2021-01-19 16:09:18',4129,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1cGVyIEFkbWluIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInVuaXF1ZV9pZCI6ImM1YjY0NzQwLTVhNDYtMTFlYi05NWRiLTg1Yjc0ZGZhOWQwZSIsImlhdCI6MTYxMTA1NDU1N30.h0fNSwr48hnn3OlGYIWJUZr-GgRTWIEQ36AmFtduizY');

/*Table structure for table `unverified_drivers` */

DROP TABLE IF EXISTS `unverified_drivers`;

CREATE TABLE `unverified_drivers` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `otp` double DEFAULT NULL,
  `vehicle_name` varchar(255) DEFAULT NULL,
  `number_plate` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `delivery_mode_id` int(11) DEFAULT NULL,
  `country` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `contact` (`contact`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `unverified_drivers` */

/*Table structure for table `unverified_users` */

DROP TABLE IF EXISTS `unverified_users`;

CREATE TABLE `unverified_users` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `otp` double DEFAULT NULL,
  `country` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `unverified_users` */

insert  into `unverified_users`(`createdAt`,`updatedAt`,`id`,`name`,`email`,`country_code`,`contact`,`password`,`language`,`otp`,`country`) values 
('2021-01-19 13:33:02','2021-01-19 13:35:17',1,'sajid','sajid@mail.com','+92','3123823470','$2a$12$HKu6E2AUVshRq5AHFrXZGO.K.6NYo3v1sjL45J/R75XJwiZ/0TMpO','en',3754,NULL);

/*Table structure for table `unverified_vendors` */

DROP TABLE IF EXISTS `unverified_vendors`;

CREATE TABLE `unverified_vendors` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `otp` double DEFAULT NULL,
  `country` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `unverified_vendors` */

insert  into `unverified_vendors`(`createdAt`,`updatedAt`,`id`,`name`,`email`,`contact`,`country_code`,`password`,`otp`,`country`) values 
('2021-01-19 15:32:52','2021-01-19 16:52:55',1,'Nomi','nomi@mail.com','3123823470','+92','$2a$12$v8rK01rfgPfJiSjRg1KWg.GAWCmfT9fwUwfIz9G/hzqoksxbcoQl.',4652,NULL);

/*Table structure for table `user_addresses` */

DROP TABLE IF EXISTS `user_addresses`;

CREATE TABLE `user_addresses` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `user_addresses` */

/*Table structure for table `user_country` */

DROP TABLE IF EXISTS `user_country`;

CREATE TABLE `user_country` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Data for the table `user_country` */

insert  into `user_country`(`createdAt`,`updatedAt`,`id`,`user_id`,`country_id`) values 
('2021-01-14 12:58:43','2021-01-14 12:58:43',5,43,132),
('2021-01-14 13:28:31','2021-01-15 17:27:49',6,44,132),
('2021-01-15 06:53:21','2021-01-15 06:53:21',7,47,132);

/*Table structure for table `user_notifications` */

DROP TABLE IF EXISTS `user_notifications`;

CREATE TABLE `user_notifications` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` double DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` varchar(255) DEFAULT NULL,
  `extra_data` text,
  `notification_type` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=latin1;

/*Data for the table `user_notifications` */

insert  into `user_notifications`(`createdAt`,`updatedAt`,`id`,`template_id`,`title`,`body`,`extra_data`,`notification_type`,`deletedAt`,`user_id`,`is_read`) values 
('2021-01-14 19:01:37','2021-01-14 19:01:37',41,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":12}','proposal_received',NULL,44,0),
('2021-01-14 19:18:31','2021-01-14 19:18:31',42,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":14}','proposal_received',NULL,44,0),
('2021-01-14 19:19:01','2021-01-14 19:19:01',43,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":13}','proposal_received',NULL,44,0),
('2021-01-14 19:19:27','2021-01-14 19:19:27',44,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":15}','proposal_received',NULL,44,0),
('2021-01-14 19:19:47','2021-01-14 19:19:47',45,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":16}','proposal_received',NULL,44,0),
('2021-01-14 19:35:05','2021-01-14 19:35:05',46,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":17}','proposal_received',NULL,44,0),
('2021-01-14 19:57:51','2021-01-14 19:57:51',47,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":18}','proposal_received',NULL,44,0),
('2021-01-14 20:02:12','2021-01-14 20:02:12',48,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":19}','proposal_received',NULL,44,0),
('2021-01-14 20:02:49','2021-01-14 20:02:49',49,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":20}','proposal_received',NULL,44,0),
('2021-01-14 20:04:27','2021-01-14 20:04:27',50,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":21}','proposal_received',NULL,44,0),
('2021-01-14 20:05:06','2021-01-14 20:05:06',51,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":22}','proposal_received',NULL,44,0),
('2021-01-14 20:06:18','2021-01-14 20:06:18',52,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":23}','proposal_received',NULL,44,0),
('2021-01-14 20:12:45','2021-01-14 20:12:45',53,NULL,'Rider Assigned','Rider has been assigned to order#19','{\"proposal_id\":19}','rider_assigned',NULL,44,0),
('2021-01-14 20:27:12','2021-01-14 20:27:12',54,NULL,'Order Completed','Order has been completed','{\"proposal_id\":21,\"type\":\"pickup\",\"store_id\":11,\"sent_by\":{\"id\":11,\"name\":\"Bin Hashim\",\"avatar\":null}}','order_completed',NULL,44,0),
('2021-01-14 20:36:58','2021-01-14 20:36:58',55,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":24}','proposal_received',NULL,44,0),
('2021-01-14 20:36:59','2021-01-14 20:36:59',56,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":24}','proposal_received',NULL,44,0),
('2021-01-14 21:20:08','2021-01-14 21:20:08',57,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":25}','proposal_received',NULL,44,0),
('2021-01-14 21:24:01','2021-01-14 21:24:01',58,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":26}','proposal_received',NULL,44,0),
('2021-01-14 21:25:26','2021-01-14 21:25:26',59,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":27}','proposal_received',NULL,44,0),
('2021-01-14 21:28:18','2021-01-14 21:28:18',60,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":28}','proposal_received',NULL,44,0),
('2021-01-14 21:31:45','2021-01-14 21:31:45',61,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":29}','proposal_received',NULL,44,0),
('2021-01-14 21:33:17','2021-01-14 21:33:17',62,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":30}','proposal_received',NULL,44,0),
('2021-01-15 07:32:32','2021-01-15 07:32:32',63,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":31}','proposal_received',NULL,44,0),
('2021-01-15 07:33:09','2021-01-15 07:33:09',64,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":32}','proposal_received',NULL,44,0),
('2021-01-15 07:36:40','2021-01-15 07:36:40',65,NULL,'Order Completed','Order has been completed','{\"proposal_id\":31,\"type\":\"pickup\",\"store_id\":8,\"sent_by\":{\"id\":8,\"name\":\"Shaan Foods\",\"avatar\":null}}','order_completed',NULL,44,0),
('2021-01-15 07:39:15','2021-01-15 07:39:15',66,NULL,'Rider Assigned','Rider has been assigned to order#32','{\"proposal_id\":32}','rider_assigned',NULL,44,0),
('2021-01-15 07:40:39','2021-01-15 07:40:39',67,NULL,'Order Completed','Order has been completed','{\"proposal_id\":32,\"type\":\"delivery\",\"driver_id\":29,\"store_id\":8,\"sent_by\":{\"id\":8,\"name\":\"Shaan Foods\",\"avatar\":null}}','order_completed',NULL,44,0),
('2021-01-15 07:54:54','2021-01-15 07:54:54',68,NULL,'Rider Assigned','Rider has been assigned to order#23','{\"proposal_id\":23}','rider_assigned',NULL,44,0),
('2021-01-15 07:59:59','2021-01-15 07:59:59',69,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":33}','proposal_received',NULL,44,0),
('2021-01-15 09:13:34','2021-01-15 09:13:34',70,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":34}','proposal_received',NULL,44,0),
('2021-01-15 17:24:33','2021-01-15 17:24:33',71,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":11}','proposal_received',NULL,44,0),
('2021-01-15 17:29:16','2021-01-15 17:29:16',72,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":1}','proposal_received',NULL,44,0),
('2021-01-15 18:30:20','2021-01-15 18:30:20',73,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":1}','proposal_received',NULL,44,0),
('2021-01-15 18:30:58','2021-01-15 18:30:58',74,NULL,'Proposal received','A proposal has been received','{\"proposal_id\":2}','proposal_received',NULL,44,0);

/*Table structure for table `user_reviews_ratings` */

DROP TABLE IF EXISTS `user_reviews_ratings`;

CREATE TABLE `user_reviews_ratings` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `review` text,
  `rating` double DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

/*Data for the table `user_reviews_ratings` */

insert  into `user_reviews_ratings`(`createdAt`,`updatedAt`,`id`,`review`,`rating`,`deletedAt`,`order_id`,`user_id`,`driver_id`,`store_id`) values 
('2021-01-14 20:27:15','2021-01-14 20:27:15',15,NULL,5,NULL,21,44,NULL,11),
('2021-01-15 07:36:43','2021-01-15 07:36:43',16,NULL,5,NULL,31,44,NULL,8),
('2021-01-15 07:41:17','2021-01-15 07:41:17',17,'????',2,NULL,32,44,NULL,8);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `otp` double DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `loyalty_points` double DEFAULT NULL,
  `wallet` double DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `is_fraud` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`createdAt`,`updatedAt`,`id`,`name`,`email`,`country_code`,`contact`,`password`,`gender`,`dob`,`otp`,`avatar`,`language`,`loyalty_points`,`wallet`,`device_token`,`deletedAt`,`is_fraud`) values 
('2021-01-14 12:56:34','2021-01-14 12:56:34',42,'Alexis Carter','alexiscarter.00417@gmail.com',NULL,NULL,NULL,NULL,NULL,0,'https://lh5.googleusercontent.com/-zDQQS9oJRuo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmPPeNqFyMfJPSveUMnobkhWrSZzg/s96-c/photo.jpg','en',0,0,'',NULL,0),
('2021-01-14 12:58:43','2021-01-14 12:58:43',43,'Ashar','asharsarwar186@gmail.com','+92','3498036965','$2a$12$CLfD0boKmRfvMC8aXjY6UeqjciG07vj2kIqQhoXUM8CCt6vBOB636',NULL,NULL,0,NULL,'en',50,0,'',NULL,0),
('2021-01-14 13:28:31','2021-01-15 09:42:28',44,'Khalid Ali','khalid@mail.com','+92','3002312150','$2a$12$j.DKNzmswt9kZgFL5shFaOvVjfqdFnPaGQJT2qJjVCYfy4LdGXKb2','male','1999-01-14',0,'https://waspha.s3.amazonaws.com/users/pKsyNWvlS7.png','en',50,0,'elARADavVcQ:APA91bF4cRPYfo89OSbAVg8ZllFoISNvH0dl7MpS228GczngS7PXYV-HPgLzNFUwb56-Mu4H0soXIh0rD4-IUDe2vHMp5CLUC3ZncmHlWIKaaf4r_oHmb-hZwg6leudAOXPNEXajKwyf',NULL,0),
('2021-01-14 16:20:38','2021-01-14 17:28:49',45,'Tabassum Wajid','tabassumwajid2005@gmail.com',NULL,NULL,NULL,NULL,NULL,0,'https://lh3.googleusercontent.com/a-/AOh14Gh2PI0VP_9sCwwiExMe2eSeUsrFMBTJLTZ9BdvBmQ=s96-c','en',0,0,'dg4wBaseORU:APA91bENEEvkD4qpFIhDKdeEuoaLzBYcO5fokgG0_2VK7IIPixvc9iToPEZT9Tts5jTcpOcPQnsYf-lvueLoea1l7tSiiK9Ja4ecHNYINlmWiuOySRqvL5nZcfFNuI3997VV_RsR0Rir',NULL,0),
('2021-01-14 19:58:34','2021-01-19 17:01:28',46,'Muhammad Siddique ur Rehman','siddique.qazi9292@gmail.com','+92','3135410999',NULL,NULL,NULL,5936,'https://lh3.googleusercontent.com/a-/AOh14GimW-SF5cGqEutCqRUJfUxOIL9Fcb1w_8VbVoka=s96-c','en',0,0,'fQegfYJuTBCNceuqgdv3B8:APA91bE6jpHferbJZxZUKU9oSGoxhd0iGtwCYk_AFckYWturTcBUen3g7fQKzfYgk2hWn7DDMfV6jMXhzm0Wwj9vI3SRIQjE02ISnZF7PbFdV8KZf8CGV6e2PGXwwXa5p2K3AhzDKrKx',NULL,0),
('2021-01-15 06:53:21','2021-01-15 06:53:21',47,'Harris Khan','haris@mail.com','+92','3002312147','$2a$12$aVnEXe6jBuvnk44E29EfPejkDYXjC4Mm7x5.rgEvPybWyUfseStuy',NULL,NULL,0,NULL,'en',50,0,'',NULL,0);

/*Table structure for table `vendor_country` */

DROP TABLE IF EXISTS `vendor_country`;

CREATE TABLE `vendor_country` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendor_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Data for the table `vendor_country` */

insert  into `vendor_country`(`createdAt`,`updatedAt`,`id`,`vendor_id`,`country_id`) values 
('2021-01-14 13:20:15','2021-01-14 13:20:15',4,461,132),
('2021-01-14 14:13:22','2021-01-14 14:13:22',5,462,132),
('2021-01-14 14:18:54','2021-01-14 14:18:54',6,463,132),
('2021-01-14 14:30:34','2021-01-15 14:04:51',7,465,132),
('2021-01-14 15:14:02','2021-01-14 15:14:02',8,466,132),
('2021-01-14 15:20:23','2021-01-15 06:59:24',9,467,132),
('2021-01-14 15:33:30','2021-01-15 09:12:39',10,468,132),
('2021-01-14 15:40:33','2021-01-14 17:33:56',11,469,132),
('2021-01-14 18:59:11','2021-01-15 07:11:54',12,471,132),
('2021-01-14 19:02:20','2021-01-15 07:14:00',13,472,132);

/*Table structure for table `vendor_messages` */

DROP TABLE IF EXISTS `vendor_messages`;

CREATE TABLE `vendor_messages` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` text,
  `deletedAt` datetime DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

/*Data for the table `vendor_messages` */

insert  into `vendor_messages`(`createdAt`,`updatedAt`,`id`,`message`,`deletedAt`,`vendor_id`) values 
('2021-01-14 15:24:15','2021-01-14 15:24:15',15,'Please make these changes: change business name',NULL,466);

/*Table structure for table `vendor_notifications` */

DROP TABLE IF EXISTS `vendor_notifications`;

CREATE TABLE `vendor_notifications` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` double DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` varchar(255) DEFAULT NULL,
  `extra_data` text,
  `notification_type` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=239 DEFAULT CHARSET=latin1;

/*Data for the table `vendor_notifications` */

insert  into `vendor_notifications`(`createdAt`,`updatedAt`,`id`,`template_id`,`title`,`body`,`extra_data`,`notification_type`,`deletedAt`,`vendor_id`,`is_read`) values 
('2021-01-14 15:28:04','2021-01-14 15:28:04',105,NULL,'Account Information','Your account has been approved','{\"id\":467}','rfp_received',NULL,467,0),
('2021-01-14 15:37:36','2021-01-14 18:49:54',106,NULL,'Account Information','Your account has been approved','{\"id\":468}','rfp_received',NULL,468,1),
('2021-01-14 18:30:17','2021-01-14 19:58:23',107,NULL,'RFP received','A RFP has been received','{\"id\":49}','rfp_received',NULL,465,1),
('2021-01-14 18:33:50','2021-01-14 18:33:50',108,NULL,'RFP received','A RFP has been received','{\"id\":50}','rfp_received',NULL,465,0),
('2021-01-14 18:34:34','2021-01-14 18:49:58',109,NULL,'RFP received','A RFP has been received','{\"id\":51}','rfp_received',NULL,468,1),
('2021-01-14 18:40:29','2021-01-14 18:50:00',110,NULL,'RFP received','A RFP has been received','{\"id\":52}','rfp_received',NULL,468,1),
('2021-01-14 18:51:04','2021-01-14 18:51:04',111,NULL,'RFP received','A RFP has been received','{\"id\":53}','rfp_received',NULL,468,0),
('2021-01-14 18:59:45','2021-01-14 18:59:45',112,NULL,'RFP received','A RFP has been received','{\"id\":54}','rfp_received',NULL,468,0),
('2021-01-14 19:03:30','2021-01-14 19:03:59',113,NULL,'RFP received','A RFP has been received','{\"id\":55}','rfp_received',NULL,468,1),
('2021-01-14 19:06:31','2021-01-14 19:06:31',114,NULL,'RFP received','A RFP has been received','{\"id\":56}','rfp_received',NULL,468,0),
('2021-01-15 00:06:13','2021-01-15 00:06:13',115,NULL,'Account Information','Your account has been approved','{\"id\":471}','rfp_received',NULL,471,0),
('2021-01-14 19:06:43','2021-01-14 19:06:43',116,NULL,'RFP received','A RFP has been received','{\"id\":57}','rfp_received',NULL,468,0),
('2021-01-15 00:06:32','2021-01-15 00:06:32',117,NULL,'Account Information','Your account has been approved','{\"id\":472}','rfp_received',NULL,472,0),
('2021-01-14 19:09:20','2021-01-14 19:09:20',118,NULL,'RFP received','A RFP has been received','{\"id\":59}','rfp_received',NULL,468,0),
('2021-01-14 19:09:56','2021-01-14 19:58:21',119,NULL,'RFP received','A RFP has been received','{\"id\":60}','rfp_received',NULL,465,1),
('2021-01-14 19:12:57','2021-01-14 19:12:57',120,NULL,'RFP received','A RFP has been received','{\"id\":61}','rfp_received',NULL,468,0),
('2021-01-14 19:14:26','2021-01-14 19:14:26',121,NULL,'RFP received','A RFP has been received','{\"id\":62}','rfp_received',NULL,465,0),
('2021-01-14 19:16:52','2021-01-14 19:58:26',122,NULL,'RFP received','A RFP has been received','{\"id\":63}','rfp_received',NULL,465,1),
('2021-01-14 19:17:42','2021-01-14 19:17:42',123,NULL,'RFP received','A RFP has been received','{\"id\":64}','rfp_received',NULL,468,0),
('2021-01-14 19:19:07','2021-01-14 19:58:12',124,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":14}','proposal_accepted',NULL,465,1),
('2021-01-14 19:26:24','2021-01-14 19:29:52',125,NULL,'RFP received','A RFP has been received','{\"id\":65}','rfp_received',NULL,468,1),
('2021-01-14 19:28:26','2021-01-14 19:58:28',126,NULL,'RFP received','A RFP has been received','{\"id\":66}','rfp_received',NULL,465,1),
('2021-01-14 19:29:24','2021-01-14 19:29:24',127,NULL,'Account Information','Your account has been approved','{\"id\":470}','rfp_received',NULL,470,0),
('2021-01-14 19:30:34','2021-01-14 19:30:34',128,NULL,'RFP received','A RFP has been received','{\"id\":67}','rfp_received',NULL,470,0),
('2021-01-14 19:39:24','2021-01-14 19:39:24',129,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":17}','proposal_accepted',NULL,468,0),
('2021-01-14 19:51:48','2021-01-14 19:51:48',130,NULL,'RFP received','A RFP has been received','{\"id\":68}','rfp_received',NULL,468,0),
('2021-01-14 19:57:05','2021-01-14 19:57:05',131,NULL,'RFP received','A RFP has been received','{\"id\":69}','rfp_received',NULL,468,0),
('2021-01-14 19:57:24','2021-01-14 19:58:31',132,NULL,'RFP received','A RFP has been received','{\"id\":70}','rfp_received',NULL,465,1),
('2021-01-14 19:58:56','2021-01-14 19:58:56',133,NULL,'RFP received','A RFP has been received','{\"id\":71}','rfp_received',NULL,465,0),
('2021-01-14 19:59:50','2021-01-14 19:59:50',134,NULL,'RFP received','A RFP has been received','{\"id\":73}','rfp_received',NULL,468,0),
('2021-01-14 20:00:20','2021-01-14 20:00:20',135,NULL,'RFP received','A RFP has been received','{\"id\":74}','rfp_received',NULL,468,0),
('2021-01-14 20:00:46','2021-01-14 20:00:46',136,NULL,'RFP received','A RFP has been received','{\"id\":75}','rfp_received',NULL,468,0),
('2021-01-14 20:01:43','2021-01-14 20:01:43',137,NULL,'RFP received','A RFP has been received','{\"id\":76}','rfp_received',NULL,465,0),
('2021-01-14 20:04:40','2021-01-14 20:04:40',138,NULL,'RFP received','A RFP has been received','{\"id\":77}','rfp_received',NULL,465,0),
('2021-01-14 20:05:41','2021-01-14 20:05:41',139,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":21}','proposal_accepted',NULL,468,0),
('2021-01-14 20:06:07','2021-01-14 20:06:07',140,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":22}','proposal_accepted',NULL,468,0),
('2021-01-14 20:06:27','2021-01-14 20:06:27',141,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":19}','proposal_accepted',NULL,468,0),
('2021-01-14 20:06:45','2021-01-14 20:06:45',142,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":23}','proposal_accepted',NULL,465,0),
('2021-01-14 20:27:12','2021-01-14 20:27:12',143,NULL,'Order Completed','Order has been completed','{\"proposal_id\":21,\"type\":\"pickup\",\"vendor_id\":468,\"user_id\":44}','order_completed',NULL,468,0),
('2021-01-14 20:34:58','2021-01-14 20:34:58',144,NULL,'RFP received','A RFP has been received','{\"id\":81}','rfp_received',NULL,468,0),
('2021-01-14 20:37:34','2021-01-14 20:37:34',145,NULL,'Proposal Rejected','Your proposal has been rejected','{\"id\":24}','proposal_rejected',NULL,468,0),
('2021-01-14 20:38:01','2021-01-14 20:38:01',146,NULL,'RFP received','A RFP has been received','{\"id\":82}','rfp_received',NULL,468,0),
('2021-01-14 20:48:00','2021-01-14 20:48:00',147,NULL,'RFP received','A RFP has been received','{\"id\":83}','rfp_received',NULL,465,0),
('2021-01-14 20:53:01','2021-01-15 07:31:39',148,NULL,'RFP received','A RFP has been received','{\"id\":84}','rfp_received',NULL,465,1),
('2021-01-14 20:53:01','2021-01-15 07:31:37',149,NULL,'RFP received','A RFP has been received','{\"id\":85}','rfp_received',NULL,465,1),
('2021-01-14 20:53:02','2021-01-14 20:53:02',150,NULL,'RFP received','A RFP has been received','{\"id\":86}','rfp_received',NULL,465,0),
('2021-01-14 20:54:01','2021-01-14 20:54:01',151,NULL,'RFP received','A RFP has been received','{\"id\":87}','rfp_received',NULL,468,0),
('2021-01-14 20:57:01','2021-01-15 07:31:33',152,NULL,'RFP received','A RFP has been received','{\"id\":88}','rfp_received',NULL,465,1),
('2021-01-14 21:01:00','2021-01-14 21:01:00',153,NULL,'RFP received','A RFP has been received','{\"id\":89}','rfp_received',NULL,465,0),
('2021-01-14 21:01:01','2021-01-14 21:01:01',154,NULL,'RFP received','A RFP has been received','{\"id\":90}','rfp_received',NULL,468,0),
('2021-01-14 21:19:12','2021-01-15 07:31:30',155,NULL,'RFP received','A RFP has been received','{\"id\":91}','rfp_received',NULL,465,1),
('2021-01-14 21:23:00','2021-01-15 07:31:27',156,NULL,'RFP received','A RFP has been received','{\"id\":92}','rfp_received',NULL,465,1),
('2021-01-14 21:24:49','2021-01-14 21:24:49',157,NULL,'RFP received','A RFP has been received','{\"id\":93}','rfp_received',NULL,465,0),
('2021-01-14 21:27:50','2021-01-14 21:27:50',158,NULL,'RFP received','A RFP has been received','{\"id\":94}','rfp_received',NULL,465,0),
('2021-01-14 21:30:45','2021-01-14 21:30:45',159,NULL,'RFP received','A RFP has been received','{\"id\":95}','rfp_received',NULL,465,0),
('2021-01-14 21:32:48','2021-01-14 21:32:48',160,NULL,'RFP received','A RFP has been received','{\"id\":96}','rfp_received',NULL,465,0),
('2021-01-14 21:42:00','2021-01-14 21:42:00',161,NULL,'RFP received','A RFP has been received','{\"id\":97}','rfp_received',NULL,465,0),
('2021-01-14 21:42:00','2021-01-14 21:42:00',162,NULL,'RFP received','A RFP has been received','{\"id\":97}','rfp_received',NULL,468,0),
('2021-01-14 21:42:00','2021-01-15 07:31:02',163,NULL,'RFP received','A RFP has been received','{\"id\":97}','rfp_received',NULL,465,1),
('2021-01-14 21:42:00','2021-01-14 21:42:00',164,NULL,'RFP received','A RFP has been received','{\"id\":97}','rfp_received',NULL,468,0),
('2021-01-14 21:47:00','2021-01-15 07:30:59',165,NULL,'RFP received','A RFP has been received','{\"id\":98}','rfp_received',NULL,465,1),
('2021-01-14 21:47:00','2021-01-14 21:47:00',166,NULL,'RFP received','A RFP has been received','{\"id\":98}','rfp_received',NULL,468,0),
('2021-01-14 21:47:00','2021-01-14 21:47:00',167,NULL,'RFP received','A RFP has been received','{\"id\":98}','rfp_received',NULL,465,0),
('2021-01-14 21:47:00','2021-01-14 21:47:00',168,NULL,'RFP received','A RFP has been received','{\"id\":98}','rfp_received',NULL,468,0),
('2021-01-14 21:50:00','2021-01-15 07:31:14',169,NULL,'RFP received','A RFP has been received','{\"id\":99}','rfp_received',NULL,465,1),
('2021-01-14 21:50:00','2021-01-14 21:50:00',170,NULL,'RFP received','A RFP has been received','{\"id\":99}','rfp_received',NULL,468,0),
('2021-01-14 21:50:00','2021-01-15 07:30:51',171,NULL,'RFP received','A RFP has been received','{\"id\":99}','rfp_received',NULL,465,1),
('2021-01-14 21:50:00','2021-01-14 21:50:00',172,NULL,'RFP received','A RFP has been received','{\"id\":99}','rfp_received',NULL,468,0),
('2021-01-15 07:26:52','2021-01-15 07:30:48',173,NULL,'RFP received','A RFP has been received','{\"id\":100}','rfp_received',NULL,465,1),
('2021-01-15 07:29:11','2021-01-15 07:30:45',174,NULL,'RFP received','A RFP has been received','{\"id\":101}','rfp_received',NULL,465,1),
('2021-01-15 07:34:05','2021-01-15 07:34:05',175,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":32}','proposal_accepted',NULL,465,0),
('2021-01-15 07:34:48','2021-01-15 07:34:48',176,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":31}','proposal_accepted',NULL,465,0),
('2021-01-15 07:36:40','2021-01-15 07:36:40',177,NULL,'Order Completed','Order has been completed','{\"proposal_id\":31,\"type\":\"pickup\",\"vendor_id\":465,\"user_id\":44}','order_completed',NULL,465,0),
('2021-01-15 07:40:39','2021-01-15 07:40:39',178,NULL,'Order Completed','Order has been completed','{\"proposal_id\":32,\"type\":\"delivery\",\"vendor_id\":465,\"user_id\":44,\"driver_id\":29}','order_completed',NULL,465,0),
('2021-01-15 07:58:26','2021-01-15 07:58:26',179,NULL,'RFP received','A RFP has been received','{\"id\":102}','rfp_received',NULL,465,0),
('2021-01-15 07:59:15','2021-01-15 07:59:15',180,NULL,'RFP received','A RFP has been received','{\"id\":103}','rfp_received',NULL,465,0),
('2021-01-15 08:00:43','2021-01-15 08:00:43',181,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":33}','proposal_accepted',NULL,465,0),
('2021-01-15 08:59:00','2021-01-15 08:59:00',182,NULL,'RFP received','A RFP has been received','{\"id\":104}','rfp_received',NULL,465,0),
('2021-01-15 08:59:01','2021-01-15 08:59:01',183,NULL,'RFP received','A RFP has been received','{\"id\":104}','rfp_received',NULL,467,0),
('2021-01-15 08:59:01','2021-01-15 08:59:01',184,NULL,'RFP received','A RFP has been received','{\"id\":104}','rfp_received',NULL,468,0),
('2021-01-15 08:59:01','2021-01-15 08:59:01',185,NULL,'RFP received','A RFP has been received','{\"id\":104}','rfp_received',NULL,465,0),
('2021-01-15 08:59:01','2021-01-15 08:59:01',186,NULL,'RFP received','A RFP has been received','{\"id\":104}','rfp_received',NULL,468,0),
('2021-01-15 09:00:07','2021-01-15 09:00:07',187,NULL,'RFP received','A RFP has been received','{\"id\":104}','rfp_received',NULL,471,0),
('2021-01-15 09:00:08','2021-01-15 09:00:08',188,NULL,'RFP received','A RFP has been received','{\"id\":104}','rfp_received',NULL,471,0),
('2021-01-15 09:11:34','2021-01-15 09:11:34',189,NULL,'RFP received','A RFP has been received','{\"id\":105}','rfp_received',NULL,468,0),
('2021-01-15 09:11:47','2021-01-15 09:11:47',190,NULL,'RFP received','A RFP has been received','{\"id\":106}','rfp_received',NULL,468,0),
('2021-01-15 09:13:51','2021-01-15 09:13:51',191,NULL,'Proposal Rejected','Your proposal has been rejected','{\"id\":34}','proposal_rejected',NULL,468,0),
('2021-01-15 15:03:00','2021-01-15 15:03:00',192,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 15:03:00','2021-01-15 15:03:00',193,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,467,0),
('2021-01-15 15:03:00','2021-01-15 15:03:00',194,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 15:03:01','2021-01-15 15:03:01',195,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 15:03:01','2021-01-15 15:03:01',196,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 15:04:00','2021-01-15 15:04:00',197,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,471,0),
('2021-01-15 15:04:00','2021-01-15 15:04:00',198,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,471,0),
('2021-01-15 15:36:04','2021-01-15 15:36:04',199,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 15:36:05','2021-01-15 15:36:05',200,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,467,0),
('2021-01-15 15:36:05','2021-01-15 15:36:05',201,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 15:36:05','2021-01-15 15:36:05',202,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 15:36:05','2021-01-15 15:36:05',203,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 15:41:00','2021-01-15 15:41:00',204,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 15:41:00','2021-01-15 15:41:00',205,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,467,0),
('2021-01-15 15:41:01','2021-01-15 15:41:01',206,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 15:41:01','2021-01-15 15:41:01',207,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 15:41:01','2021-01-15 15:41:01',208,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 15:42:40','2021-01-15 15:42:40',209,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 15:42:40','2021-01-15 15:42:40',210,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,467,0),
('2021-01-15 15:42:40','2021-01-15 15:42:40',211,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 15:42:40','2021-01-15 15:42:40',212,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,471,0),
('2021-01-15 16:53:00','2021-01-15 16:53:00',213,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,465,0),
('2021-01-15 16:53:00','2021-01-15 16:53:00',214,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,467,0),
('2021-01-15 16:53:00','2021-01-15 16:53:00',215,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,468,0),
('2021-01-15 16:53:00','2021-01-15 16:53:00',216,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,471,0),
('2021-01-15 16:55:41','2021-01-15 16:55:41',217,NULL,'RFP received','A RFP has been received','{\"id\":3}','rfp_received',NULL,465,0),
('2021-01-15 16:55:41','2021-01-15 16:55:41',218,NULL,'RFP received','A RFP has been received','{\"id\":3}','rfp_received',NULL,467,0),
('2021-01-15 16:55:41','2021-01-15 16:55:41',219,NULL,'RFP received','A RFP has been received','{\"id\":3}','rfp_received',NULL,468,0),
('2021-01-15 16:55:41','2021-01-15 16:55:41',220,NULL,'RFP received','A RFP has been received','{\"id\":3}','rfp_received',NULL,471,0),
('2021-01-15 16:58:00','2021-01-15 16:58:00',221,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,465,0),
('2021-01-15 16:58:00','2021-01-15 16:58:00',222,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,467,0),
('2021-01-15 16:58:00','2021-01-15 16:58:00',223,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 16:58:00','2021-01-15 16:58:00',224,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,471,0),
('2021-01-15 16:59:31','2021-01-15 16:59:31',225,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 16:59:31','2021-01-15 16:59:31',226,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,471,0),
('2021-01-15 17:03:50','2021-01-15 17:03:50',227,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,468,0),
('2021-01-15 17:03:50','2021-01-15 17:03:50',228,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,471,0),
('2021-01-15 17:22:57','2021-01-15 17:22:57',229,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,470,0),
('2021-01-15 17:28:59','2021-01-15 17:28:59',230,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,470,0),
('2021-01-15 17:29:22','2021-01-15 17:29:22',231,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":1}','proposal_accepted',NULL,470,0),
('2021-01-15 18:03:38','2021-01-15 18:03:38',232,NULL,'RFP received','A RFP has been received','{\"id\":1}','rfp_received',NULL,470,0),
('2021-01-15 18:04:10','2021-01-15 18:04:10',233,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,465,0),
('2021-01-15 18:09:41','2021-01-15 18:09:41',234,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,470,0),
('2021-01-15 18:14:10','2021-01-15 18:14:10',235,NULL,'RFP received','A RFP has been received','{\"id\":2}','rfp_received',NULL,472,0),
('2021-01-15 18:29:03','2021-01-15 18:29:03',236,NULL,'RFP received','A RFP has been received','{\"id\":3}','rfp_received',NULL,470,0),
('2021-01-15 18:30:36','2021-01-15 18:30:36',237,NULL,'RFP received','A RFP has been received','{\"id\":4}','rfp_received',NULL,470,0),
('2021-01-15 18:31:29','2021-01-15 18:31:29',238,NULL,'Proposal Accepted','Your proposal has been accepted','{\"id\":2}','proposal_accepted',NULL,470,0);

/*Table structure for table `vendors` */

DROP TABLE IF EXISTS `vendors`;

CREATE TABLE `vendors` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` double DEFAULT NULL,
  `otp` double DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `loyalty_points` double DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `contact` (`contact`)
) ENGINE=InnoDB AUTO_INCREMENT=474 DEFAULT CHARSET=latin1;

/*Data for the table `vendors` */

insert  into `vendors`(`createdAt`,`updatedAt`,`id`,`name`,`email`,`contact`,`country_code`,`password`,`status`,`otp`,`language`,`avatar`,`device_id`,`loyalty_points`,`device_token`,`deletedAt`) values 
('2021-01-14 14:30:34','2021-01-15 09:06:32',465,'Shaan','shan@mail.com','3002312152','+92','$2a$12$kIThtgB3JNA1iCaO2crtiuqAEZnXOinv03fccUIXeM6Lp8kLK7w..',1,0,'en',NULL,NULL,0,'dWNivZpVjbQ:APA91bFi8iW_8vaP5JEstLnxnR6wR9IoAilqep3D_fAVE1hUHmtMtUTAWdAA0tB6WzIy4LLKCJXvswb2IFUTOh3MZAkle4MnLKX5Nezpn8VTYowpfhC-xlvdKpjnKRxCRNqlP7k93H6d',NULL),
('2021-01-14 15:14:02','2021-01-14 15:14:02',466,'abrar ahmed','abrarahmed@mail.com','3043234343','+92','$2a$12$/kOW5Jl4pVdsfWOjHqSo7.o8CE3TxUWjeVQmvc4uQfze3FzZjwoXG',0,0,'en',NULL,NULL,0,NULL,NULL),
('2021-01-14 15:20:23','2021-01-15 06:59:26',467,'Zubair','zubair@mail.com','3002312153','+92','$2a$12$lQN3YJOcZREdww4jwM/2H.fl5ylfZ/ImGHgHMB9g3ryMJrQmricsq',1,0,'en',NULL,NULL,0,'dvtWhMgFTCaxkkWixaQWV4:APA91bGv4uIZJEfdEBa6TkGBBhhbHytSEnjrPdcLtG6gXx5n8Dz3Eh3QARQ5Ignjkq0nwThHUov7OYOAfjaunfBEJ1N0iZ3ypvBENizmg94Azgzh-mfG9IQMUAJx9t0E7I9qHksQY_Y8',NULL),
('2021-01-14 15:33:30','2021-01-15 09:12:41',468,'Hashim','hashim@mail.com','3002312154','+92','$2a$12$N6xYrUSDe0ZXwN/COQIozuJki4l29gn/337qJE3NJgxHMQxuTx09q',1,0,'en',NULL,NULL,0,'clvJjMF-M0xtkMBGsjDo0I:APA91bFYPPJ8pNfI3QbrcV--mDBg59PqjHYG2uVoef0-JHA_mf61GJlx3u-tpZ5vDHAiLs3-XsMbxs-d9cCbzy0nutjg8nvPFd6BMEVseTneuqm8rZekJRDsD2Ai95tcW33Mu1DtS3lV',NULL),
('2021-01-14 15:40:33','2021-01-14 15:40:33',469,'Safeer','safeer@mail.com','3002312158','+92','$2a$12$lDU5dRbQ0JJE956Rq6cs8u3X9igunxNyRLnAuskVE.tb1dYN4SW5a',0,0,'en',NULL,NULL,0,NULL,NULL),
('2021-01-14 15:42:17','2021-01-19 16:57:41',470,'Muhammad Siddique ur Rehman','siddique.qazi9292@gmail.com','3135490190','+92','$2a$12$kIThtgB3JNA1iCaO2crtiuqAEZnXOinv03fccUIXeM6Lp8kLK7w..',1,5649,'en','https://lh3.googleusercontent.com/a-/AOh14GimW-SF5cGqEutCqRUJfUxOIL9Fcb1w_8VbVoka=s96-c',NULL,0,'fwRrClSC-4w:APA91bGgxaS-tGHyC_4WLwX_60heAY7RvzEFxmdbKrBV9XSc5Oi3XLdllxzh7-3FkP2Nx_uXWc7VRaOb7yPXyYoLwENF3EsScbbWL2_qRkQ-J64WhLdES3gGEJc1DIE1C8FxZ8pbp-fs',NULL),
('2021-01-14 18:59:11','2021-01-15 07:12:32',471,'Maaz','maaz@mail.com','3349551625','+92','$2a$12$vnFIn/E0DUjZ1bVoWpeeveSCpwRfoZV4Ytp/xXq37IRd4Pm3h0zGm',1,0,'en',NULL,NULL,0,'dvtWhMgFTCaxkkWixaQWV4:APA91bGv4uIZJEfdEBa6TkGBBhhbHytSEnjrPdcLtG6gXx5n8Dz3Eh3QARQ5Ignjkq0nwThHUov7OYOAfjaunfBEJ1N0iZ3ypvBENizmg94Azgzh-mfG9IQMUAJx9t0E7I9qHksQY_Y8',NULL),
('2021-01-14 19:02:20','2021-01-19 16:55:24',472,'Danish Ali','danish@mail.com','03353365142','+92','$2a$12$G7dfKWcPkyNz44mTC2RvKun37bywErpC8t6xGQ9J5OvVP634jq6R.',1,6849,'en',NULL,NULL,0,'dGSqAeJRQ72PLGyn-PqqhF:APA91bFMMZKLaC4VhzVTRPC1EOy6-9PhpeEvWFcxERd3wpWtqkmQBRTXPdSID8JF3Wj9uguQzOgZg4uOH9CvA9DSE10h4zpJoLb-_uVLXaMNRhJSwRLhfFjoe0t6FDrJjvYOeTPxv-_9',NULL),
('2021-01-14 22:16:52','2021-01-14 22:16:52',473,'Maribeth Casteel','maribethcasteel.94264@gmail.com',NULL,NULL,NULL,0,0,'en','https://lh4.googleusercontent.com/-mSmHIAKSByI/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckFpGmH8vbJzI3Gef6h8W7kB3VYJg/s96-c/photo.jpg',NULL,0,NULL,NULL);

/*Table structure for table `waspha_settings` */

DROP TABLE IF EXISTS `waspha_settings`;

CREATE TABLE `waspha_settings` (
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `en` longtext,
  `ar` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

/*Data for the table `waspha_settings` */

insert  into `waspha_settings`(`createdAt`,`updatedAt`,`id`,`key`,`en`,`ar`) values 
(NULL,NULL,1,'terms_and_conditions_vendor','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n<body>\r\n\r\n    <h1>PROVIDER TERMS AND CONDITIONS OF USE</h1>\r\n\r\n    <p>This Application is owned and operated by 3HM LLC, a company incorporated and registered in the Arab Republic of Egypt with registration number is 9157, our VAT number is 2662406249406583. Our official address is 36 Mrs. Sakina Bint Al Hussein Street, Kafr Abdo, Alexandria Governorate, Egypt, tel. +201111375707.</p>\r\n    <p>Welcome to WASPHA Vendor App. Our Terms and Conditions of use regulate your access to and use of our Application which includes; all content, functionality and services offered on or through the Application</p>\r\n    \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>1. Terms</b></p>\r\n    </div>\r\n\r\n    <p>By accessing this Application, you are agreeing to be bound by these Application Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this Application. The materials contained in this Application are protected by applicable copyright and trademark law.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>2. Definitions</b></p>\r\n    </div>\r\n\r\n    <p>Provider: refers to any store in our platform selling products </p>\r\n    <p>Products; refers to products including but not limited to food, drinks, medicines, cosmetics, grocery, or any other products that customers can buy or pickup from the store, with condition that these stores have sell products are not in violation of the law, or sell items cannot be carry it or more than 10 Kilograms.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>3. Procedure</b></p>\r\n    </div>\r\n\r\n    <p>Providers shall Download WASPHA for the provider App and register their business after which a representative will contact you for verification purposes.</p>\r\n    <p>Provider should provide all required legal information that represents his brand name and owner to make the account effective.</p>\r\n    <p>Before approval to use app account the provider can set the brand name information, working hours, add items in menu if any, delivery range radius, and brand name logo.</p>\r\n    <p>Provider shall be fully responsible for creating menu items. The items should not include violence, sexual or any other images against the law or social customs and traditions, and if any WASPHA will close the account.</p>\r\n    <p>Provider should always update menu, and its related contents, and remove or deactivate any items in menu if it’s no longer available.</p>\r\n    <p>Provider can’t add any prices related to the menu items because the app deals with proposal / offer concept sent by each provider separately.</p>\r\n    <p>When a provider gets approval from WASPHA admin and the account becomes active the provider can add a delivery boy (online/offline) delivery partners and its related information.</p>\r\n    <p>Provider shall be responsible for any delivery partners they added and WASPHA shall not get any fees from their delivery because they are owned by the provider. </p>\r\n    <p>The provider can add two types of delivery partners online/offline delivery partners in the app panel, the providers shall be responsibilities for any delivery assigned to them WASPHA. We shall not be liable for any delay or cancelation.</p>\r\n    <p>Provider shall be responsible for any items delivered to or picked by user, and WASPHA shall not be responsible for the Safety or quality of items delivered. WASPHA acts as a link between all parties.</p>\r\n    <p>Once the provider receives a proposal it shall be accepted or rejected within the specified time failure to which no order will be assigned to the account, if accepted the provider shall Item price the user order and define the delivery partner type ((online/offline) independent if any) in delivery mode.</p>\r\n    <p>If provider defines an offline delivery category to make this delivery, the Provider should define ETA and delivery fee manually.  If the provider defines online delivery category to make this delivery, the Provider shall define delivery fee manually and ETA will be calculated automatically. If provider defines independent delivery category to make this delivery, the ETA and delivery fee will be calculated automatically and WASPHA fees added based on the percentage on the sub total of the items defined by provider and this percentage may be different in each mode used, and may be different per each provider.</p>\r\n    <p>Provider will define expired date of this proposal and after this date is expired the proposal will be expired automatically.</p>\r\n    <p>User will review received proposal and can accept or reject it before this proposal expiration, if user rejects, user will added the cancelation reason and will be sent to provider, if accepted the provider will start preparing items and assign delivery partner based on above selected delivery partner category.</p>\r\n    <p>If delivery category was offline delivery partner, the provider shall be fully responsible for management of the process statues of order delivery until received or picked by user, and responsible for rating the service as provider and as offline delivery partner, and add any Exchange money to user wallet (if any) before marking order complete.</p>\r\n    <p>Account settlement takes place at the ending of the month, and Settlement is done after calculating the credit and debit. WASPHA will provide an invoice at the beginning of the next month to include all transaction applied and the final owe and payout, and if WASPHA owe an amount to this provider, WASPHA will transfer this amount to a provider bank account, and if the provider should payout amount to WASPHA, this provider should transfer it to 3hm LTD bank account or via cheque, or as cash.</p>\r\n    <p>Any cancelation fees occurring from a user’s cancelation of a proposal shall reflect on the next provider proposal to the user. Upon collection, the cancellation fee shall be forwarded to WASPHA.</p>\r\n    <p>Any parking fees used by independent delivery boy will be payable to the delivery boy. </p>\r\n    <p>Any promo code discount requested from provider is not owed to WASPHA, but any promo code discount NOT requested from provider will be owed on WASPHA.</p>\r\n    <p>Providers may gain points based on their transaction on the app, this points can be redeemed based on WASPHA campaigns that apply periodically</p>\r\n    <p>Provider can start chat with user after accepting proposal until the order completed.</p>\r\n    <p>Provider can chat with online/independent boys if this order is in delivery mode once the delivery partner is assigned to this order until completion.</p>\r\n    <p>The provider can make group chat between all parties.</p>\r\n\r\n    <div style=\"margin-left: 30px;\">\r\n        <p>(a) General</p>\r\n    </div>\r\n\r\n    <p>WASPHA can use provider brand name logo in any ads campaign without any further notice from provider based on this agreement.</p>\r\n    <p>WASPHA may change in time the services for which any membership is not required to a form, which requires membership. WASPHA may provide addition services, change some of the services partially or completely, or transform into a paid service.</p>\r\n    <p>WASPHA may terminate this agreement unilaterally at any time. You agree that the consequences of commercial use or re-publication of content or information of WASPHA may lead to serious and incalculable monetary compensation that may not be a sufficient or appropriate remedy and that WASPHA will be entitled to temporary and permanent injunctive relief to prohibit such use.</p>\r\n    <p>In relation to any product returns, the terms of product return belonging to the PROVIDERS are applied. WASPHA does not undertake any responsibilities for the disputes, which may arise from terms of product return belonging to the PROVIDERS.</p>\r\n    <p>All order information displayed in the App. The provider shall not ask user for any personal information. </p>\r\n    <p>The provider shall not allow the user ask for additional items in the order after accept your proposal. </p>\r\n    <p>No personal contact shall be exchanged with the user for any type of external communication or campaign. This information solely belongs to WASPHA and any violation to this agreement will result in suspension of your account</p>\r\n\r\n    <div style=\"margin-left: 30px;\">\r\n        <p>(b) Extra provider service</p>\r\n    </div>\r\n\r\n    <p>WASPHA box an extra service the provider can buy in the subscription, this will allow him to request direct delivery partner to make order delivery for user not coming from WASPHA app, this user use traditional ways to make order from this provider and because provider for any reason don’t have currently any owned delivery partners so he can use this service to ask for delivery as 3rd party service.</p>\r\n    <p>These services are not free and provider should add it to his/her subscription.</p>\r\n    \r\n    <div style=\"margin-left: 30px;\">\r\n        <p>(c) WASPHA express</p>\r\n    </div>\r\n\r\n    <p>By default when provider gets WASPHA box subscription he/she will get this service also, this service is in another name is the independent delivery partner who makes delivery for the orders to users and not owned by any provider and  works as freelancer in dedicated zone and he/she responsible to receive delivery order in this zone.</p>\r\n    <p>Unlike where the providers own the online/offline delivery partners, the provider can take advantage of this service to make delivery service to customers\' orders without the need to hire own delivery partners.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>4. Use License</b></p>\r\n    </div>\r\n\r\n    <p>The provider grants WASPHA unreserved license to use logos, marks, signs, symbols and names to market and advertise products and services offered by the provider. </p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>5. Disclaimer</b></p>\r\n    </div>\r\n\r\n    <p>The materials on our App are provided \"as is\". We make no warranties, expressed or implied, and hereby disclaim and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its App or otherwise relating to such materials or on any sites linked to this App.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>6. Limitations</b></p>\r\n    </div>\r\n\r\n    <p>In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on our App, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage. </p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>7. Indemnification</b></p>\r\n    </div>\r\n\r\n    <p>You agree, at your own expense, to indemnify, defend and hold harmless We and its employees, representatives, Suppliers and agents, against any claim, suit, action or other proceeding, to the extent based on or arising in connection with your use of the Service, or any links on the Service, including, but not limited to: (i) your use or someone using your mobiles use of the Service; (ii) a violation of the TERMS by you or anyone using your mobile; (iii) a claim that any use of the Service by you or someone using your computer infringes any copyright, trademark, or other intellectual property right of any third party, or any right of personality or publicity, is libelous or defamatory, or otherwise results in injury or damage to any third party; (iv) any deletions, additions, insertions or alterations to, or any unauthorized use of, the Service by you or someone using your mobile; or (v) any misrepresentation or breach of representation, warranty or covenant made by you contained herein. You agree to pay any and all costs, damages and expenses (including reasonable attorneys’ fees) and costs awarded against or incurred by or in connection with or arising from any such claim, suit, action or proceeding.</p>\r\n    \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>8. Revisions and Cancellations</b></p>\r\n    </div>\r\n\r\n    <p>Users are allowed 3 revision requests prior to acceptance of the proposal, upon which the provider will revise within allowed timelines.</p>\r\n    <p>Where the customer initiates cancellation via the User App, the provider shall comply and recommend any necessary costs to WASPHA for collection according to their terms and conditions of use.</p>\r\n    <p>In the Event that the provider initiates cancellation after acceptance of proposal, the provider shall recommend occurring cancellation fees to WASPHA for collection in compliance with the Terms and conditions of Use.</p>\r\n      \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>9. Links</b></p>\r\n    </div>\r\n\r\n    <p>We have not reviewed all of the sites linked to our website and we are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user\'s own risk.</p>\r\n      \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>10. Modifications</b></p>\r\n    </div>\r\n\r\n    <p>We may revise these terms of use for our website at any time without notice. By using this App you are agreeing to be bound by the then current version of these Terms and Conditions of Use.</p>\r\n  \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>11. Termination</b></p>\r\n    </div>\r\n\r\n    <p>Either you or WASPHA may terminate this agreement with or without cause at any time and effective immediately. You may terminate by discontinuing use of the Service and destroying all materials obtained from the Service. This agreement will terminate immediately without notice from Us if We determines, in its sole discretion, which you have failed to comply with any provision of these TERMS. Upon termination by you or upon notice of termination by WASPHA, you must promptly destroy all materials obtained from the Service and any copies thereof. The other Sections of this agreement shall survive any termination of this agreement.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>12. Governing Law</b></p>\r\n    </div>\r\n\r\n    <p>Any claim in relation hereto shall be governed by the laws of the State of the Republic of Egypt without regard to its conflict of law provisions.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>13. Communication</b></p>\r\n    </div>    \r\n\r\n    <p>For any concerns or issues surrounding the use of the App. Providers shall reach us at info@WASPHA.com, or by phone at +201111375707.</p>\r\n\r\n</body>\r\n</html>',NULL),
(NULL,NULL,2,'terms_and_conditions_user','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n<body>\r\n\r\n    <h1>USER APPLICATION TERMS AND CONDITIONS OF USE</h1>\r\n\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>1. INTRODUCTION</b></p>\r\n    </div>\r\n\r\n    <p>This Application is owned and operated by 3HM LLC, a company incorporated and registered in the Arab Republic of Egypt with registration number is 9157, our VAT number is 2662406249406583. Our official address is 36 Mrs. Sakina Bint Al Hussein Street, Kafr Abdo, Alexandria Governorate, Egypt, tel. +201111375707. </p>\r\n    <p>Terms and Conditions of Use herein are in reference to WASPHA User Application. These Terms and Conditions of use regulate your access to and use of our Application which includes; all content, functionality and services offered on or through the Application.</p>\r\n    <p>Your use of the App confirms your unconditional agreement to be bound by these Terms and is subject to your continued compliance with these Terms. If these Terms of Use are inconsistent with any other terms or guidelines of any particular service, the provisions of these Terms of Use will supersede all the other regulations.</p>\r\n    <p>We reserve the right to revise these Terms at any time by amending this page and your continued use of the App after any such amendments are published on the App will be considered acceptance by you of such amended Terms. Updated terms will supersede all previous versions of the Terms. Please check this page regularly to take notice of any changes we have made, as they are binding on you.</p>\r\n    <p>Your continued use of our App signifies that you agree to these Terms of Use. If you do not agree to these Terms of Use, please do not use our App. If these Terms of Use are inconsistent with any other terms or guidelines of any particular service, the provisions of these Terms of Use will supersede all the other regulations.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>2. APPLICATION USE</b></p>\r\n    </div>\r\n\r\n    <div style=\"margin-left: 40px;\">\r\n        <p>(a) Procedure</p>\r\n    </div>\r\n\r\n    <p>Each user shall register with the application and create an account from which to operate. Registration can be done using social media accounts, email and phone numbers. During registration, we shall collect information from you will be used in accordance with or Privacy Policy linked as waspha/privacypolicy</p>\r\n    <p>Upon registration the user can select between two modes; delivery or self service</p>\r\n    <p>User can set his location on the map or select one of his saved addresses</p>\r\n    <p>You\'ll see a wide variety of providers per category in your area, choose your favorite provider from the list/map to view its menu to select from it or hit custom order to send your order specifically to it or its other related brand name branches, or in case you don\'t select specific provider hit custom order just to send your order to the first five nearest providers.</p>\r\n    <p>Users should specify landmarks within the delivery mode for accurate delivery or the user can select specific provider related to his selected category and send a request asking for proposal OR (open this provider menu and select from it and add to and send it), and in this case the system will send only this request to the specific provider.  In case this provider doesn’t respond or user rejects received proposal then the system will re send this user request to the next provider with same brand name.</p>\r\n    <p>Each proposal includes; items prices, its tax if any, deliver fees (if any), WASPHA service fees (if any), Estimate time of arrival and accepted payment method(s).</p>\r\n    <p>The user shall accept provider return policy (each provider has its own personal return policy) and then select the payment method provided by provider in the proposal.</p>\r\n    <p>User can chat with provider upon acceptance of any received proposal as long as the order is still open, the chat will be closed once this order closed.</p>\r\n    <p>User can use online payment, cash on delivery, and device on delivery or using wallet amount based on selected payment method.</p>\r\n    <p>Provider will only assign delivery partner to user order for delivery if  the user mode is set to delivery. </p>\r\n    <p>User can chat with delivery partner (independent or online delivery partner) once provider assigned one of them for delivery and as long as the order still open. The chat closes once this order closed. </p>\r\n    <p>Note: user can engage in a group chat with provider and delivery partner whom the order is assigned. </p>\r\n    <p>User will pay cash on delivery, or device on delivery in case one of them was the accepted mode of payment in provider proposal. Delivery partner will add any exchange charge to user wallet if any.</p>\r\n    <p>User will rate the provider and delivery partner service, and each item selected from provider menu. Where the user items are free hand writing there will be no rating.</p>\r\n\r\n    <div style=\"margin-left: 40px;\">\r\n        <p>(b) General</p>\r\n    </div>\r\n\r\n    <p>Users shall gain points based on their transaction on the app, this points can be redeemed based on WASPHA campaigns that apply periodically.</p>\r\n    <p>Credit or Debit cards used in placing orders through the online payment gateway on WASPHA App or applications must belong to the user.</p>\r\n    <p>The customer is entirely liable for placing an order using the Debit/Credit Cards facility after carefully reading all the terms & conditions.</p>\r\n    <p>Any items, food, equipment or whatever is received by a user that is expired and or not a match to the order, WASPHA shall not be held responsible for the vendor and delivery mishap.</p>\r\n    <p>Users can contact WASPHA over our live chat and all available social media channels for any support.</p>\r\n    <p>User should be around selected location within delivery ETA. No delivery shall be made to any other location other than the specified location in accepted proposal.</p>\r\n    <p>User should reach the provider location within a specified time in his accepted proposal in case the order was in self-service mode.</p>\r\n    <p>Users should keep their accounts safe, and nobody else should use the account. WASPHA shall not be responsible for any error in the user account or misuse thereof.</p>\r\n    <p>User can apply valid promo code to redeem based on promotion regulations.</p>\r\n    <p>During delivery if the user is not available in the address specified in the system, the items ordered by the user shall not be delivered to anywhere else. The user shall accept liability arising from making an order to a nonexistent address.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>3. SERVICE AVAILABILITY</b></p>\r\n    </div>\r\n\r\n    <p>Our Services may be modified, updated, interrupted, suspended or discontinued at any time, in the sole discretion of the Company, without notice or liability. The Service may be unavailable at certain periods, including but not limited to systems failures, anticipated or unanticipated maintenance work, upgrades or force majeure events.</p>\r\n    <p>We reserves the right, at any time, in its sole discretion to modify, temporarily or permanently block access to, suspend, or discontinue the Service, in whole or in part, with or without notice and effective immediately to any User.</p>\r\n    <p>We will have no liability whatsoever for any losses, liabilities or damages you may incur as the result of any modification, suspension, or discontinuation of the Service or any part thereof. </p>\r\n    <p>Use of the Service is subject to the terms of our Privacy Policy which is hereby incorporated into and made part of this Terms of Use. Please carefully review our Privacy Policy. By using or accessing the Service, you agree to be bound by the terms of our Privacy Policy. </p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>4. LIMITATION OF USE</b></p>\r\n    </div>\r\n\r\n    <p>All content in our App is used in reference to suppliers as the licensed provider and protected by Egyptian copyright law and international copyright laws, treaties and conventions.</p>\r\n    <p>Any trademarks, service marks, graphics, logos, page headers, icons, scripts and trade names (each, a “Mark“) contained on the App are proprietary to us or our licensors or licensees. Our Marks may not be used in connection with any product or service that is not ours in any manner that is likely to cause confusion among users or that disparages or discredits us or anyone else. All other Marks not owned by us that appear on the App are the property of 3HM with whom we are affiliated as associates.</p>\r\n    \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>5. YOUR USE OF OUR APP</b></p>\r\n    </div>\r\n\r\n    <p>You may send us reviews, comments, photographs, and other content; send communications; and submit suggestions, ideas, comments, questions, or other information, so long as none of these materials are illegal, obscene, threatening, defamatory, invasive of privacy, infringing on intellectual property rights, or otherwise injurious to third parties or objectionable and do not consist of or contain software viruses, political campaigning, commercial solicitation, chain letters and mass mailings. You may not use a false e-mail address, impersonate anyone, or otherwise mislead as to the origin of any content. We reserve the right to remove or edit any such content.</p>\r\n    \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>6. TRANSACTIONS, PAYMENTS</b></p>\r\n    </div>\r\n\r\n    <p>Providers on WASPHA support online payment options for Debit Card/Credit Card. Here you can find all online payment methods we provide based on countries. In Egypt We support both MasterCard and Visa</p>\r\n    <p>We herein expressly disclaim any liability whatsoever for any claims, demands, injuries, losses or damages direct or indirect of every kind and nature, known and unknown, suspected and unsuspected, disclosed and undisclosed, arising out of or in any way connected with any product sold by a seller to a buyer through the Services. By using the Services, you represent, understand, and expressly agree to release and hold Us harmless for any claim, demand, injuries, losses or controversy that may arise from any products purchased by customer and from any disputes between you and any other user(s) of the Services.</p>\r\n    <p>We will facilitate the buyer\'s payment for product through online payment. In order to be eligible to use the Services, you must register and create an account with our platform, which includes supplying all information required by such supported payment methods. You are responsible for complying with all requirements for registration with such supported payment methods and for otherwise complying with all applicable terms and conditions located on the supported payment method.</p>\r\n    <p>Where you cancel a payment by giving instruction to your bank to return your funds, and they do so, or your billing details provided are no longer valid, you will be liable to for any penalty which incurred to that bank or other payment options.</p>\r\n    <p>Where the Fees are described in a different currency to that which you use, you accept all risk for any currency fluctuations, and you undertake to pay the Fees in full in our stated currency. You similarly undertake to pay any levy that may arise because of the currencies differing</p>\r\n    \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>7. THIRD PARTY APPS</b></p>\r\n    </div>\r\n\r\n    <p>You should be aware that when you visit the App, you could be directed to other Apps beyond our control including links to or from affiliates and content partners that may use our Marks as part of an affiliate relationship. When you click on a link that directs you away from the App, the App to which you are directed may not be controlled by us and different terms of use and privacy policies may apply which you should carefully read and evaluate. You acknowledge that we are not responsible for examining or evaluating, and that we do not warrant the offerings of, any such third party or the content of their Apps. We do not assume any responsibility or liability for the actions, products, or content of any third party or any third party App. We reserve the right to disable links from or to third-party Apps, although we are under no obligation to do so.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>8. DISCLAIMER OF WARRANTIES</b></p>\r\n    </div>\r\n\r\n    <p>THE INFORMATION, CONTENT, PRODUCTS, SERVICES, AND MATERIALS AVAILABLE THROUGH THE APP (WHETHER PROVIDED BY WASPAH, YOU, OTHER USERS OR OTHER AFFILIATES/THIRD PARTIES), INCLUDING WITHOUT LIMITATION, FOOD/BEVERAGE ORDERS, SUBMISSIONS, TEXT, PHOTOS, GRAPHICS, AUDIO FILES, VIDEO, AND LINKS, ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WASPHA DISCLAIMS ALL REPRESENTATIONS AND WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NONINFRINGEMENT, FREEDOM FROM COMPUTER VIRUS, AND IMPLIED WARRANTIES ARISING FROM COURSE OF DEALING OR COURSE OF PERFORMANCE</p>\r\n    <p>THE CONTENT ON THE APP IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND, EXPRESSED OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ANY AND ALL WARRANTIES, EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE FUNCTIONS CONTAINED IN ANY CONTENT (INCLUDING, WITHOUT LIMITATION, USER-GENERATED CONTENT) WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE APP OR THE SERVERS THAT MAKE SUCH CONTENT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS AND YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION OF ANY OF YOUR EQUIPMENT OR SOFTWARE. WE MAKE NO REPRESENTATIONS OR WARRANTIES REGARDING USE, OR THE RESULTS OF USE, OF ANY CONTENT, PRODUCT OR SERVICE CONTAINED ON OR OFFERED, MADE AVAILABLE THROUGH, OR OTHERWISE RELATED IN ANY WAY TO THE APP INCLUDING, WITHOUT LIMITATION, ANY THIRD PARTY APP OR SERVICE LINKED TO FROM THE APP (AND SPECIFICALLY NO REPRESENTATION OR WARRANTY OF CORRECTNESS, ACCURACY, COMPLETENESS, RELIABILITY OR SAFETY).</p>\r\n    <p>WE EXPLICITLY DISCLAIM ANY RESPONSIBILITY FOR THE ACCURACY, COMPLETENESS OR AVAILABILITY OF INFORMATION, CONTENT AND MATERIALS FOUND ON APPS THAT LINK TO OR FROM THE APP. WE CANNOT ENSURE THAT YOU WILL BE SATISFIED WITH ANY PRODUCT OR SERVICE THAT YOU PURCHASE FROM A THIRD PARTY APP THAT LINKS TO OR FROM THE APP OR THIRD PARTY INFORMATION, CONTENT OR MATERIALS CONTAINED ON OUR APP. WE DO NOT ENDORSE ANY OF THE MERCHANDISE, NOR HAVE WE TAKEN ANY STEPS TO CONFIRM THE ACCURACY, COMPLETENESS OR RELIABILITY OF, ANY OF THE INFORMATION, CONTENT OR MATERIALS CONTAINED ON ANY THIRD PARTY APP. WE DO NOT MAKE ANY REPRESENTATIONS OR WARRANTIES AS TO THE SECURITY OF ANY INFORMATION, CONTENT OR MATERIALS (INCLUDING, WITHOUT LIMITATION, CREDIT CARD AND OTHER PERSONAL INFORMATION) YOU MIGHT BE REQUESTED TO GIVE TO ANY THIRD PARTY. YOU HEREBY IRREVOCABLY AND UNCONDITIONALLY WAIVE ANY AND ALL CLAIMS AGAINST US WITH RESPECT TO INFORMATION, CONTENT AND MATERIALS CONTAINED ON THE APP (INCLUDING, WITHOUT LIMITATION, USER-GENERATED CONTENT), ON THIRD PARTY APPS, AND ANY INFORMATION, CONTENT AND MATERIALS YOU PROVIDE TO OR THROUGH ANY SUCH THIRD PARTY APPS (INCLUDING, WITHOUT LIMITATION, CREDIT CARD AND OTHER PERSONAL INFORMATION). WE STRONGLY ENCOURAGE YOU TO MAKE WHATEVER INVESTIGATION YOU FEEL NECESSARY OR APPROPRIATE BEFORE PROCEEDING WITH ANY ONLINE OR OFFLINE TRANSACTION WITH ANY THIRD PARTY.</p>\r\n    <p>YOU ACKNOWLEDGE THAT YOU HAVE CAREFULLY READ THIS DISCLAIMER AND FULLY UNDERSTAND THAT IT IS A RELEASE OF LIABILITY. YOU EXPRESSLY AGREE TO RELEASE AND DISCHARGE ALL INDEMNIFIED PARTIES (AS DEFINED BELOW) FROM ANY AND ALL CLAIMS OR CAUSES OF ACTION AND YOU AGREE TO VOLUNTARILY GIVE UP AND IRREVOCABLY WAIVE AND RELEASE ANY RIGHT THAT YOU MAY OTHERWISE HAVE TO BRING A LEGAL ACTION AGAINST ANY INDEMNIFIED PARTY FOR PROPERTY DAMAGE.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>9. RETURN AND REFUND POLICY </b></p>\r\n    </div>\r\n\r\n    <p>All providers shall have individual return and refund policies. The service provider\'s return and refund policies accompany the return policy information upon acceptance of the order by the customer.</p>\r\n    <p>WASPHA shall process any refund amount in your wallet within 2 business working days, however, if you don\'t need to refund your amount in your wallet, we can return that amount to you in your bank account.</p>\r\n    <p>The duration of the refund process varies depending on the payment method you used.</p>\r\n    <p>The refund for MasterCard and Visa may take up to 7 business working days.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>10. INDEMNIFICATION</b></p>\r\n    </div>\r\n\r\n    <p>You hereby agree to indemnify, defend, and hold us, and our licensors, successors, directors, owners, managers, members, employees, agents, representatives and assigns, harmless from and against any and all loss, cost, damage, liability and expense (including, without limitation, settlement costs and legal or other fees and expenses) suffered or incurred by any of the Indemnified Parties arising out of, in connection with or related to any breach or alleged breach by you of these Terms of Use. You shall use your best efforts to cooperate with us in the defense of any claim. We reserve the right, at our own expense, to employ separate counsel and assume the exclusive defense and control of the settlement and disposition of any claim that is subject to indemnification by you.</p>\r\n    \r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>11. REVISION AND CANCELLATION POLICY</b></p>\r\n    </div>\r\n\r\n    <p>You can revise any received proposal 3 times before accepting it, however, please note that if received a proposal already accepted by you, or if the provider already dispatched your order then any additional items may be accounted for as a new order. However, you can ask your provider about whatever you forgot over chat and this considers new order.</p>\r\n    <p>A user can cancel his request for proposal any time without any additional fees or penalty. User can cancel his accepted proposal at any time but in each cancellation there is a penalty fee payable which will be added and cumulated automatically and added in the next order of this user. </p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>12. INTELLECTUAL PROPERTY</b></p>\r\n    </div>\r\n\r\n    <p>We are the owner and/or authorized user of all WASPHA trademarks, trade names, service marks, design marks, patents, copyrights, database rights and all other intellectual property on or contained within the App, unless otherwise expressly indicated. Except as provided in these Terms, use of the App does not grant you any right, title, interest or license to any such intellectual property you may access on the App. Except as provided in these Terms, any use or reproduction of the intellectual property is strictly prohibited. Nothing contained on this App should be construed as granting, by implication, or otherwise, any license or right to use any trade mark, service mark or logo displayed on this App without our prior written permission or the prior written permission of such other third party that may own the trade mark, service mark or logo displayed on this App. Your use of the trademarks, service marks or logos displayed on this App, except as provided herein, is strictly prohibited.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>13. AMENDMENT</b></p>\r\n    </div>\r\n\r\n    <p>At our discretion, we reserve the right to change, modify, add or delete portions of these Terms of Use at any time without notice, and it is your responsibility to review these Terms of Use for any changes. Your use of the App following any change to these Terms of Use will constitute your assent to and acceptance of the revised Terms of Use.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>14. APPLICABLE LAW AND DISPUTES</b></p>\r\n    </div>\r\n\r\n    <p>These Terms of Use, your rights and obligations, our rights and obligations, and all actions contemplated by these Terms of Use, will be governed by the laws of Republic of Egypt. Any dispute relating in any way to your visit to the App or to our services shall therefore be solved first by arbitration with an arbitrator as shall be agreed upon before any other resolution mechanism is reached.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>15. ELECTRONIC COMMUNICATIONS</b></p>\r\n    </div>\r\n\r\n    <p>When you visit the App or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on the App. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>16. MISCELLANEOUS LEGAL PROVISIONS</b></p>\r\n    </div>\r\n\r\n    <p>We may discontinue the App at any time and for any reason, without notice. We may change the contents, operation, or features of the App at any time for any reason, without notice.</p>\r\n    <p>You agree that no joint venture, partnership, employment, or agency relationship exists between you and us as a result of these Terms of Use or your use of the App. Nothing contained in these Terms of Use is in derogation of our right to comply with governmental, court, and law enforcement requests or requirements relating to your use of the App or information provided to or gathered by us with respect to such use. A printed version of these Terms of Use and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to these Terms of Use to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form.</p>\r\n    <p>Our failure to enforce any provision of these Terms of Use or respond to a breach by you or others shall not constitute a waiver of our right to enforce any other provision of these Terms of Use as to that breach or any other.</p>\r\n    <p>If any provision of these Terms of Use is invalid or unenforceable under applicable law, the remaining provisions will continue in full force and effect, and the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision.</p>\r\n    <p>These Terms of Use constitute the entire agreement between you and us regarding the App and supersedes any prior or contemporaneous agreement regarding that subject matter.</p>\r\n\r\n    <div style=\"margin-left: 20px;\">\r\n        <p><b>Chat with us</b></p>\r\n    </div>\r\n\r\n    <p>Should you have any concerns or issues surrounding the use of the App, do not hesitate to reach us at <a href=\"#\">info@WASPHA.com</a>, WASPHA Chat support or by phone at +201111375707.</p>\r\n\r\n\r\n</body>\r\n</html>',NULL),
(NULL,NULL,3,'terms_and_conditions_driver','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>DELIVERY TERMS AND CONDITIONS OF USE</h1>\r\n\r\n    <p>This webApplication and App is owned and operated by 3HM LLC, a company incorporated and registered in the Arab Republic of Egypt with registration number is 9157, our VAT number is 2662406249406583. Our official address is 36 Mrs. Sakina Bint Al Hussein Street, Kafr Abdo, Alexandria Governorate, Egypt, tel. +201111375707.</p>\r\n    <p>By continuing to access WASPHA delivery App you signify your acceptance of the terms. Accordingly, please continue to review the terms whenever accessing or using this Application. Your use of this Application or any service on the Application, after the posting of modifications to the terms will constitute your acceptance of the terms, as modified. If, at any time, you do not wish to accept the terms, you may not use the Application.</p>\r\n\r\n    <ol>\r\n        <b><li>Procedure</li></b>\r\n\r\n        <p>Delivery boy app (Usually called Express app)</p>\r\n\r\n        <ol type=\"a\">\r\n            <li>Procedure</li>\r\n\r\n            <p>WASPHA deals with 3 types of delivery partners 2 of them owned by provider (provider employees) and one as a freelancer owned by WASPHA.</p>\r\n            <p>Delivery partners owned by provider can be online / offline, Online means that this employee type have smart phone and internet access and can use the credential provided by his/her provider to make login to Express app, offline delivery partner he/she don’t have smart phone so he/she will not have any credential to be used but provider will create account as offline type to assign delivery order to this account and this provider will be fully responsible to manage the delivery process manually.</p>\r\n            <p>Both online/offline delivery partners owned and dedicated only to this provider only and can’t be used by any other providers independent delivery boy is freelancer delivery partner owned by WASPHA and work in dedicated zone and can be used by any providers in this zone.</p>\r\n            <p>ONLY independent delivery boy can make registration over this app and waiting for WASPHA admin approval after providing his personal document and his/her vehicle documents, online delivery partner can use the credential provided by his provider delivery partners</p>\r\n            <p>Only online/independent deliver partners can access WASPHA EXPRESS APP using their credential but offline don’t have credential to be used delivery partner will received order delivery for pickup and delivery locations and provider information and user information and he should accept within specified time or he/she can reject it.</p>\r\n            <p>If delivery boy accept it he will review the order and going to provider location for package pickup and then check it and should take picture and send it over chat to user.</p>\r\n            <p>If users don’t have any issue with it the delivery partner will start Delivery journey to the user location. At the location, deliverer will go to the user landmark location specified by user. order delivery partner should deal with the client with respect and courtesy and without offending him.</p>\r\n            <p>If there’s no cash to be collected the delivery partner should not ask for payment. </p>\r\n            <p>If there’s cash to be collected, the delivery partner should in the express App for payment and add received amount from user.</p>\r\n            <p>If there is a change amount, delivery partner will ask user to add it to his wallet. If a user accepts he can hit add the remaining amount in user wallet.</p>\r\n            <p>In case the user insists to be provided with the exchange amount as cash, delivery partner should not ask for any tips from provider and should not take any kind of tips forcibly from the user unless the user gives it on his own.</p>\r\n            <p>If order is completed successfully the delivery partner should rate user, then close the order.</p>\r\n            <p>If user refuses to take the order or he was not located in his location, the delivery partner should return back to provider and return the package and inform WASPHA support of this case.</p>\r\n            <p>If this delivery is made by independent delivery partner and order completed successfully, WASPHA will take percentage fees from the total fees in case it was normal delivery or was as delivery over WASPHA box delivery fees percentage calculated automatically for independent delivery partner based on the distance and time between provider location and user location and we don’t take in our consideration the distance between delivery boy location and provider location, and this calculation will be different per each delivery method used per country.</p>\r\n            <p>Independent delivery partners may gain points based on their transaction on the app, this points can be redeemed based on WASPHA campaigns that apply periodically. </p>\r\n            <p>Any cash amount collected by independent delivery partner should be added in the 3hm LTD company bank account in the end of the day or maximum the next business day morning, Any delay the account will be suspended and all legal measures will be taken.</p>\r\n            <p>Account settlement takes place at the beginning of the new week of the previous week, and Settlement is done after calculating the credit and debit.</p>\r\n            <p>Only online/independent delivery partners can initiate chat with the user or the provider once they are assigned an order for delivery to its completion upon which the chat is closed.</p>\r\n\r\n            <li>General</li>\r\n\r\n            <p>These Terms shall be governed by and construed in accordance with the law. Disputes arising in connection with these App/Apps Terms (including non-contractual disputes) shall be subject to the exclusive jurisdiction of the courts.</p>\r\n            <p>During any product delivery made by Providers, if the user is not available in the address specified in the system, the items ordered by the user shall not deliver to anywhere else. Within the framework of such a case, the user must accept all legal responsibilities arising from ordering products to an address where he/she does not exist.</p>\r\n            <p>All order information is displayed in the App. The provider is prohibited from asking the user for any personal information. The user is prohibited from asking for additional items in his order after accepting the provider proposal.</p>\r\n            <p>The provider and delivery partner are prohibited from taking a user’s contact information for any type of external communication or campaign. This information belongs to WASPHA property and such an act violates this agreement hence your account will be suspended forthwill.</p>\r\n            <p>To the extent permitted by law, WASPHA provides this App and content on an \"as-is\" and \"as available\" basis and we make no representation or warranty of any kind, express or implied, regarding the content or availability of this App, or that it will be timely or error-free, that defects will be corrected, or that the App or server that makes it available are free of viruses or other harmful components.</p>\r\n        </ol>\r\n\r\n        <b><li>Modes of Delivery and requirement</li></b>\r\n\r\n        <p>The App at registration provides 4 modes of delivery with different requirements which include; Walk delivery, Bike delivery, Scooter delivery and Car Delivery</p>\r\n\r\n        <ol type=\"i\">\r\n            <li>Walk delivery</li>\r\n\r\n            <ul style=\"margin-top: 8px;\">\r\n                <li>Be at least 18 years old</li>\r\n                <li>Have a government-issued ID</li>\r\n                <li>When signing up, be sure to choose Deliver by a walk under transportation method</li>\r\n                <li>A recent criminal case document Intended for 3hm company</li>\r\n                <li>Recent drug analysis document</li>\r\n                <li>Health certificate</li>\r\n                <li>insurance paper</li>\r\n                <li>A recent personal photo with a white background</li>\r\n                <li>A valid email</li>\r\n                <li>A valid mobile number</li>\r\n                <li>An electronic wallet with the same mobile number used for registration</li>\r\n            </ul>\r\n\r\n            <li style=\"margin-top: 15px;\">Bike Delivery </li>\r\n\r\n            <ul style=\"margin-top: 8px;\">\r\n                <li>BBe at least 18 years old</li>\r\n                <li>Have a government-issued ID</li>\r\n                <li>When signing up, be sure to choose Deliver by a Bike under transportation method</li>\r\n                <li>A recent criminal case document Intended for 3hm company</li>\r\n                <li>Recent drug analysis document</li>\r\n                <li>Health certificate</li>\r\n                <li>insurance paper</li>\r\n                <li>A recent personal photo with a white background</li>\r\n                <li>A valid email</li>\r\n                <li>A valid mobile number</li>\r\n                <li>An electronic wallet with the same mobile number used for registration</li>\r\n            </ul>\r\n\r\n            <li style=\"margin-top: 15px;\">Scooter Delivery </li>\r\n\r\n            <ul style=\"margin-top: 8px;\">\r\n                <li>Be at least 19 years old</li>\r\n                <li>Have a motorized scooter under 50cc that is 20 years old or newer</li>\r\n                <li>Have a valid driver\'s license, registration, and vehicle insurance</li>\r\n                <li>When signing up, be sure to choose Deliver by a Scooter under transportation method</li>\r\n                <li>A recent criminal case document Intended for 3hm company</li>\r\n                <li>Recent drug analysis document</li>\r\n                <li>Health certificate</li>\r\n                <li>insurance paper</li>\r\n                <li>A recent personal photo with a white background</li>\r\n                <li>A valid email</li>\r\n                <li>A valid mobile number</li>\r\n                <li>An electronic wallet with the same mobile number used for registration</li>\r\n            </ul>\r\n\r\n            <li style=\"margin-top: 15px;\">Car Delivery </li>\r\n\r\n            <ul style=\"margin-top: 8px; margin-bottom: 15px;\">\r\n                <li>Meet the minimum age to drive in your city</li>\r\n                <li>Have a 2-door or 4-door car that is 20 years old or newer</li>\r\n                <li>Have a valid driver\'s license, registration, and vehicle insurance</li>\r\n                <li>Have at least one year of driving experience</li>\r\n                <li>When signing up, be sure to choose Deliver by a Car under transportation method</li>\r\n                <li>A recent criminal case document Intended for 3hm company</li>\r\n                <li>Recent drug analysis document</li>\r\n                <li>Health certificate</li>\r\n                <li>insurance paper</li>\r\n                <li>A recent personal photo with a white background</li>\r\n                <li>A valid email</li>\r\n                <li>A valid mobile number</li>\r\n                <li>An electronic wallet with the same mobile number used for registration</li>\r\n            </ul>\r\n\r\n        </ol>\r\n\r\n        <b><li>Cancelation</li></b>\r\n\r\n        <p>Delivery partner can exercise their cancelation option under the following circumstances; </p>\r\n        <p>In the absence of Provider at Pickup point. It’s helpful to us if you let WASPHA customer support know that you weren\'t able to find someone there, so the service provider can update their information.</p>\r\n        <p>Where the service provider takes longer than usual to prepare the order, usually more than 15 minutes and the order is still not ready, you can cancel the order through the app. Click Excessive Wait Time as one of the reasons for cancellation.</p>\r\n        <p>If there’s a problem, like a flat tire, and you can’t pick up an order, you can cancel the trip in your app. If you or someone else has been injured and you need emergency help, always call the authorities first.</p>\r\n        <p>If you’re unable to find the customer when delivering, you can call or message them in the app. in case you can\'t reach him/her you can call or message the service provider in the app, finally you can massage WASPHA customer support in the app</p>\r\n\r\n        <b><li>Intellectual Property.</li></b>\r\n\r\n        <p>This App, including but not limited to text, content, photographs, video, audio and graphics (the “Service”), is protected by copyrights, trademarks, service marks, international treaties and/or other proprietary rights and laws of the Republic of Egypt and other countries. The Service is also protected as a collective work or compilation under Egypt’s copyright and other laws and treaties. </p>\r\n\r\n        <b><li>License</li></b>\r\n\r\n        <p>You acquire no rights or licenses in or to the Service and materials contained therein other than the limited right to utilize the Service in accordance with the terms.</p>\r\n\r\n        <b><li>Limitation of Liability.</li></b>\r\n\r\n        <p>YOU AGREE THAT UNDER NO CIRCUMSTANCES, INCLUDING BUT NOT LIMITED TO NEGLIGENCE, SHALL WASPHA, ITS SUPPLIERS OR ITS THIRD-PARTY AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE OR EXEMPLARY DAMAGES EVEN IF AN AUTHORIZED REPRESENTATIVE OF WE HAVE BEEN ADVISED SPECIFICALLY OF THE POSSIBILITY OF SUCH DAMAGES, ARISING FROM USE OF OR INABILITY TO USE THE SERVICE OR ANY LINKS OR ITEMS ON THE SERVICE OR ANY PROVISION OF THE TERMS, SUCH AS, BUT NOT LIMITED TO, LOSS OF REVENUE OR ANTICIPATED PROFITS OR LOST BUSINESS. THIS LIMITATION OF LIABILITY INCLUDES, BUT IS NOT LIMITED TO, THE TRANSMISSION OF ANY VIRUSES WHICH MAY INFECT A USER’S EQUIPMENT, FAILURE OF MECHANICAL OR ELECTRONIC EQUIPMENT OR COMMUNICATION LINES, UNAUTHORIZED ACCESS, OR ANY FORCE MAJEURE. WE CANNOT AND DO NOT GUARANTEE CONTINUOUS, UNINTERRUPTED OR SECURE ACCESS TO THIS APP. (APPLICABLE LAW MAY NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY OR INCIDENTAL OR CONSEQUENTIAL DAMAGES.</p>\r\n\r\n        <b><li>Representations and Warranties.</li></b>\r\n\r\n        <p>You represent, warrant and covenant that you: (i) have the power and authority to enter into this agreement; (ii) are at least eighteen (18) years old; (iii) shall not use any rights granted hereunder for any unlawful purpose; and (iv) shall use the Service only as set forth in these terms.</p>\r\n\r\n        <b><li>Indemnification</li></b>\r\n\r\n        <p>You agree, at your own expense, to indemnify, defend and hold harmless We and its employees, representatives, Suppliers and agents, against any claim, suit, action or other proceeding, to the extent based on or arising in connection with your use of the Service, or any links on the Service, including, but not limited to: (i) your use or someone using your device for the Service; (ii) a violation of the TERMS by you or anyone using your device; (iii) a claim that any use of the Service by you or someone using your computer infringes any copyright, trademark, or other intellectual property right of any third party, or any right of personality or publicity, is libelous or defamatory, or otherwise results in injury or damage to any third party; (iv) any deletions, additions, insertions or alterations to, or any unauthorized use of, the Service by you or someone using your device; or (v) any misrepresentation or breach of representation, warranty or covenant made by you contained herein. You agree to pay any and all costs, damages and expenses (including reasonable attorneys’ fees) and costs awarded against or incurred by or in connection with or arising from any such claim, suit, action or proceeding.</p>\r\n\r\n        <b><li>Termination.</li></b>\r\n\r\n        <p>Either you or WASPHA may terminate this agreement with or without cause at any time and effective immediately. You may terminate by discontinuing use of the Service and destroying all materials obtained from the Service. This agreement will terminate immediately without notice from Us if We determines, in its sole discretion, which you have failed to comply with any provision of these TERMS. Upon termination by you or upon notice of termination by WASPHA, you must promptly destroy all materials obtained from the Service and any copies thereof. The other Sections of this agreement shall survive any termination of this agreement.</p>\r\n\r\n        <b><li>Governing Law.</li></b>\r\n\r\n        <p>These TERMS shall be governed and construed in accordance with the laws of the Republic of Egypt. You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to use of this App or these TERMS must be filed within one (1) year after such claim or cause of action arose. If any provision of the TERMS is found by a court of competent jurisdiction to be invalid or unenforceable, such provision shall be enforced to the maximum extent permissible and the other provisions of the TERMS shall remain in full force and effect.</p>\r\n\r\n        <b><li>Miscellaneous.</li></b>\r\n\r\n        <p>You acknowledge that we have the right to change the content or technical specifications of any aspect of the Service at any time at WASPHA’s sole discretion. You further accept that such changes may result in your being unable to access the Service.</p>\r\n\r\n        <b><li>Support communication</li></b>\r\n\r\n        <p>To reach our support for any concerns or issues surrounding the delivery App. Providers shall reach us at <a href=\"#\">info@WASPHA.com</a>, or by phone at +201111375707</p>\r\n    </ol>\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,4,'privacy_policy_vendor','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n<body>\r\n\r\n    <h1>WASPHA PRIVACY POLICY</h1>\r\n    \r\n    <p>Our Application provides an array of merchants from whom you can procure products. We are governed by policies, terms and conditions; your use of this website ultimately means you accept and abide by our terms</p>\r\n    <p>This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users.</p>\r\n    <p>We use your Personal Information only for providing you services and improving the application. By using the application, you agree to the collection and use of information in accordance with this policy.</p>\r\n\r\n    <h3>Information Collection and Use</h3>\r\n    <p>While using our Application, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name, email, phone and fax. Any personal information given to us is privileged and completely confidential and will not be used for any purpose other than customer service. </p>\r\n    \r\n    <h3>Communications</h3>\r\n    <p>We may use your Personal Information to contact you with Waspha offers, newsletters, marketing or promotional materials and other information that we deem necessary and of importance to you with regard to products.</p>\r\n\r\n    <h3>Eligibility</h3>\r\n    <p>Our Application is not intended for use by children under the age of 18 years. We do not use our Application to knowingly solicit information from or market to children under the age of 18 years. Parents and/or guardians are solely responsible for supervising their minor children\'s use of our web.</p>\r\n\r\n    <h3>Security</h3>\r\n    <p>Due to the open nature of communication through the Internet, we cannot guarantee that communications between you and the website will be free from unauthorized access by third parties, or that third parties will not be able to circumvent the safeguards we have put in place. We cannot absolutely guarantee the security of any information that is disclosed or transmitted online.</p>\r\n\r\n    <h3>Changes to this privacy policy</h3>\r\n    <p>This Privacy Policy is effective as upon your subscription and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>\r\n    <p>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy. If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.</p>\r\n    \r\n    <h3>Contact Us</h3>\r\n    <p>If you have any questions about this Privacy Policy, please contact us at <a href=\"#\">info@WASPHA.com</a>, or by phone at +201111375707,</p>\r\n    \r\n</body>\r\n</html>',NULL),
(NULL,NULL,5,'privacy_policy_user','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n<body>\r\n\r\n    <h1>WASPHA PRIVACY POLICY</h1>\r\n    \r\n    <p>Our Application provides an array of merchants from whom you can procure products. We are governed by policies, terms and conditions; your use of this website ultimately means you accept and abide by our terms</p>\r\n    <p>This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users.</p>\r\n    <p>We use your Personal Information only for providing you services and improving the application. By using the application, you agree to the collection and use of information in accordance with this policy.</p>\r\n\r\n    <h3>Information Collection and Use</h3>\r\n    <p>While using our Application, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name, email, phone and fax. Any personal information given to us is privileged and completely confidential and will not be used for any purpose other than customer service. </p>\r\n    \r\n    <h3>Communications</h3>\r\n    <p>We may use your Personal Information to contact you with Waspha offers, newsletters, marketing or promotional materials and other information that we deem necessary and of importance to you with regard to products.</p>\r\n\r\n    <h3>Eligibility</h3>\r\n    <p>Our Application is not intended for use by children under the age of 18 years. We do not use our Application to knowingly solicit information from or market to children under the age of 18 years. Parents and/or guardians are solely responsible for supervising their minor children\'s use of our web.</p>\r\n\r\n    <h3>Security</h3>\r\n    <p>Due to the open nature of communication through the Internet, we cannot guarantee that communications between you and the website will be free from unauthorized access by third parties, or that third parties will not be able to circumvent the safeguards we have put in place. We cannot absolutely guarantee the security of any information that is disclosed or transmitted online.</p>\r\n\r\n    <h3>Changes to this privacy policy</h3>\r\n    <p>This Privacy Policy is effective as upon your subscription and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>\r\n    <p>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy. If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.</p>\r\n    \r\n    <h3>Contact Us</h3>\r\n    <p>If you have any questions about this Privacy Policy, please contact us at <a href=\"#\">info@WASPHA.com</a>, or by phone at +201111375707,</p>\r\n    \r\n</body>\r\n</html>',NULL),
(NULL,NULL,6,'privacy_policy_driver','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n<body>\r\n\r\n    <h1>WASPHA PRIVACY POLICY</h1>\r\n    \r\n    <p>Our Application provides an array of merchants from whom you can procure products. We are governed by policies, terms and conditions; your use of this website ultimately means you accept and abide by our terms</p>\r\n    <p>This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users.</p>\r\n    <p>We use your Personal Information only for providing you services and improving the application. By using the application, you agree to the collection and use of information in accordance with this policy.</p>\r\n\r\n    <h3>Information Collection and Use</h3>\r\n    <p>While using our Application, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name, email, phone and fax. Any personal information given to us is privileged and completely confidential and will not be used for any purpose other than customer service. </p>\r\n    \r\n    <h3>Communications</h3>\r\n    <p>We may use your Personal Information to contact you with Waspha offers, newsletters, marketing or promotional materials and other information that we deem necessary and of importance to you with regard to products.</p>\r\n\r\n    <h3>Eligibility</h3>\r\n    <p>Our Application is not intended for use by children under the age of 18 years. We do not use our Application to knowingly solicit information from or market to children under the age of 18 years. Parents and/or guardians are solely responsible for supervising their minor children\'s use of our web.</p>\r\n\r\n    <h3>Security</h3>\r\n    <p>Due to the open nature of communication through the Internet, we cannot guarantee that communications between you and the website will be free from unauthorized access by third parties, or that third parties will not be able to circumvent the safeguards we have put in place. We cannot absolutely guarantee the security of any information that is disclosed or transmitted online.</p>\r\n\r\n    <h3>Changes to this privacy policy</h3>\r\n    <p>This Privacy Policy is effective as upon your subscription and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>\r\n    <p>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy. If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.</p>\r\n    \r\n    <h3>Contact Us</h3>\r\n    <p>If you have any questions about this Privacy Policy, please contact us at <a href=\"#\">info@WASPHA.com</a>, or by phone at +201111375707,</p>\r\n    \r\n</body>\r\n</html>',NULL),
(NULL,NULL,7,'copyright_policy_vendor','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>WASPHA COPYRIGHT POLICY</h1>\r\n\r\n    <p>All materials on this Application including the organization and layout are owned and copyrighted by WASPHA hereinafter © Copyright WASPHA, and all rights reserved. No reproduction, distribution, or transmission of the copyrighted materials at this Site is permitted without the written permission of 3HM Ltd.</p>\r\n    <p>The content on the Applications (“WASPHA Content\") which include but not limited to; trademarks, all source code, databases, functionality, software, website/App designs, audio, video, text, photographs, graphics service marks and logos contained therein (\"Marks\") are owned by WASPHA, and are subject to copyright and other intellectual property rights under state of Egypt and all applicable international conventions.</p>\r\n    <p>WASPHA trademarks and trade dress may not be used, including as part of trademarks and/or as part of domain names, in connection with any product or service in any manner that is likely to cause confusion and may not be copied, imitated, or used, in whole or in part, without the prior written permission of WASPHA.</p>\r\n    <p>Provided that you are eligible to use the website/Application, you are granted a limited license to access and download or print a copy of any portion of the WASPHA content to which you have properly gained access solely for your personal, non-commercial use.</p>\r\n    <p>You agree not to circumvent, disable or otherwise interfere with the security related features of the website/Application or features that prevent or restrict use or copying of any content or enforce limitations on use of the website/Application or the WASPHA content therein.</p>\r\n\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,8,'copyright_policy_user','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>WASPHA COPYRIGHT POLICY</h1>\r\n\r\n    <p>All materials on this Application including the organization and layout are owned and copyrighted by WASPHA hereinafter © Copyright WASPHA, and all rights reserved. No reproduction, distribution, or transmission of the copyrighted materials at this Site is permitted without the written permission of 3HM Ltd.</p>\r\n    <p>The content on the Applications (“WASPHA Content\") which include but not limited to; trademarks, all source code, databases, functionality, software, website/App designs, audio, video, text, photographs, graphics service marks and logos contained therein (\"Marks\") are owned by WASPHA, and are subject to copyright and other intellectual property rights under state of Egypt and all applicable international conventions.</p>\r\n    <p>WASPHA trademarks and trade dress may not be used, including as part of trademarks and/or as part of domain names, in connection with any product or service in any manner that is likely to cause confusion and may not be copied, imitated, or used, in whole or in part, without the prior written permission of WASPHA.</p>\r\n    <p>Provided that you are eligible to use the website/Application, you are granted a limited license to access and download or print a copy of any portion of the WASPHA content to which you have properly gained access solely for your personal, non-commercial use.</p>\r\n    <p>You agree not to circumvent, disable or otherwise interfere with the security related features of the website/Application or features that prevent or restrict use or copying of any content or enforce limitations on use of the website/Application or the WASPHA content therein.</p>\r\n\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,9,'copyright_policy_driver','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>WASPHA COPYRIGHT POLICY</h1>\r\n\r\n    <p>All materials on this Application including the organization and layout are owned and copyrighted by WASPHA hereinafter © Copyright WASPHA, and all rights reserved. No reproduction, distribution, or transmission of the copyrighted materials at this Site is permitted without the written permission of 3HM Ltd.</p>\r\n    <p>The content on the Applications (“WASPHA Content\") which include but not limited to; trademarks, all source code, databases, functionality, software, website/App designs, audio, video, text, photographs, graphics service marks and logos contained therein (\"Marks\") are owned by WASPHA, and are subject to copyright and other intellectual property rights under state of Egypt and all applicable international conventions.</p>\r\n    <p>WASPHA trademarks and trade dress may not be used, including as part of trademarks and/or as part of domain names, in connection with any product or service in any manner that is likely to cause confusion and may not be copied, imitated, or used, in whole or in part, without the prior written permission of WASPHA.</p>\r\n    <p>Provided that you are eligible to use the website/Application, you are granted a limited license to access and download or print a copy of any portion of the WASPHA content to which you have properly gained access solely for your personal, non-commercial use.</p>\r\n    <p>You agree not to circumvent, disable or otherwise interfere with the security related features of the website/Application or features that prevent or restrict use or copying of any content or enforce limitations on use of the website/Application or the WASPHA content therein.</p>\r\n\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,10,'cookie_policy_vendor','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>WASPHA COOKIE POLICY</h1>\r\n    <p>We use cookies to collect information on your use of our Application in order to improve and provide you a better experience. We are therefore clear and open about how we collect and use data related to you to include your interests. In the spirit of transparency, this policy provides detailed information about how and when we use cookies.</p>\r\n\r\n    <h3>What is a cookie?</h3>\r\n    <p>A cookie is a small stored on your device to enable our features functionality, information about you and also to help us serve relevant ads to you.</p>\r\n\r\n    <h3>What are cookies used for?</h3>\r\n    <p>Cookies can be used to recognize you when you visit our Application, remember your preferences, and give you a personalized experience that’s in line with your settings. Cookies also make your interactions with us faster and more secure. Additionally, cookies allow us to bring you advertising and bring you customized adverts.</p>\r\n\r\n    <p>The cookies we and our business partners use on this Application are broadly grouped into the following categories:</p>\r\n\r\n    <ul>\r\n        <li>Authentication; if you’re signed in to our Application, cookies helps us show you the right information and personalize your experience</li><br>\r\n        <li>Security; We use cookies to enable and support our security features, and to help us detect malicious activity and violations of our User Agreement</li><br>\r\n        <li>Preference & Service; Cookies can tell us which language you prefer and what your communications preferences are. They can help you fill out forms on more easily. They also provide you with features, insights, and customized content in conjunction with our plugins. You can learn more about plugins in our Privacy Policy.</li><br>\r\n        <li>Advertising; we may use cookies to show you relevant advertising both on and off our site. We may also use a cookie to learn whether someone who saw an ad later visited and took an action on the advertiser’s site. Similarly, our partners may use a cookie to determine whether we’ve shown an ad and how it performed, or provide us with information about how you interact with ads. </li><br>\r\n        <li>Performance & Research; Cookies help us learn how well our site and plugins perform in different locations. We also use cookies to understand, improve, and research products, features, and services, including when you access our site from other Applications, applications, or devices such as your work computer or your mobile device.</li><br>\r\n    </ul>\r\n\r\n    <p>Our server automatically collects data about your server’s internet address when you visit us. This information, known as an Internet Protocol address, or IP Address, is a number that’s automatically assigned to your computer by your internet service provider whenever you’re on the internet. When you request pages from our site, our servers may log your IP Address and sometimes your domain name. Our server may also record the referring page that linked you to us (eg another Application or a search engine); the pages you visit on our site; the Application you visit after our site; the ads you see and/or click on; other information about the type of web browser, computer, platform, related software and settings you are using; any search terms you have entered on our site or a referral site; and other web usage activity and data logged by our web servers. We use this information for internal system administration, to help diagnose problems with our server, and to administer our site. Such information may also be used to gather broad demographic information, such as country of origin and internet service provider. Any or all of activities with regard to our site usage information may be performed on our behalf by our services providers.</p>\r\n\r\n    <h3>Decline reception of cookies</h3>\r\n    <p>When you first visit this Application you will have been shown a message bar drawing your attention to the fact that this Application uses cookies and inviting you to review this cookie policy and manage your cookie preferences. You have an option to accept the invitation to use cookies the prompt message.</p>\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,11,'cookie_policy_user','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>WASPHA COOKIE POLICY</h1>\r\n    <p>We use cookies to collect information on your use of our Application in order to improve and provide you a better experience. We are therefore clear and open about how we collect and use data related to you to include your interests. In the spirit of transparency, this policy provides detailed information about how and when we use cookies.</p>\r\n\r\n    <h3>What is a cookie?</h3>\r\n    <p>A cookie is a small stored on your device to enable our features functionality, information about you and also to help us serve relevant ads to you.</p>\r\n\r\n    <h3>What are cookies used for?</h3>\r\n    <p>Cookies can be used to recognize you when you visit our Application, remember your preferences, and give you a personalized experience that’s in line with your settings. Cookies also make your interactions with us faster and more secure. Additionally, cookies allow us to bring you advertising and bring you customized adverts.</p>\r\n\r\n    <p>The cookies we and our business partners use on this Application are broadly grouped into the following categories:</p>\r\n\r\n    <ul>\r\n        <li>Authentication; if you’re signed in to our Application, cookies helps us show you the right information and personalize your experience</li><br>\r\n        <li>Security; We use cookies to enable and support our security features, and to help us detect malicious activity and violations of our User Agreement</li><br>\r\n        <li>Preference & Service; Cookies can tell us which language you prefer and what your communications preferences are. They can help you fill out forms on more easily. They also provide you with features, insights, and customized content in conjunction with our plugins. You can learn more about plugins in our Privacy Policy.</li><br>\r\n        <li>Advertising; we may use cookies to show you relevant advertising both on and off our site. We may also use a cookie to learn whether someone who saw an ad later visited and took an action on the advertiser’s site. Similarly, our partners may use a cookie to determine whether we’ve shown an ad and how it performed, or provide us with information about how you interact with ads. </li><br>\r\n        <li>Performance & Research; Cookies help us learn how well our site and plugins perform in different locations. We also use cookies to understand, improve, and research products, features, and services, including when you access our site from other Applications, applications, or devices such as your work computer or your mobile device.</li><br>\r\n    </ul>\r\n\r\n    <p>Our server automatically collects data about your server’s internet address when you visit us. This information, known as an Internet Protocol address, or IP Address, is a number that’s automatically assigned to your computer by your internet service provider whenever you’re on the internet. When you request pages from our site, our servers may log your IP Address and sometimes your domain name. Our server may also record the referring page that linked you to us (eg another Application or a search engine); the pages you visit on our site; the Application you visit after our site; the ads you see and/or click on; other information about the type of web browser, computer, platform, related software and settings you are using; any search terms you have entered on our site or a referral site; and other web usage activity and data logged by our web servers. We use this information for internal system administration, to help diagnose problems with our server, and to administer our site. Such information may also be used to gather broad demographic information, such as country of origin and internet service provider. Any or all of activities with regard to our site usage information may be performed on our behalf by our services providers.</p>\r\n\r\n    <h3>Decline reception of cookies</h3>\r\n    <p>When you first visit this Application you will have been shown a message bar drawing your attention to the fact that this Application uses cookies and inviting you to review this cookie policy and manage your cookie preferences. You have an option to accept the invitation to use cookies the prompt message.</p>\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,12,'cookie_policy_driver','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>WASPHA COOKIE POLICY</h1>\r\n    <p>We use cookies to collect information on your use of our Application in order to improve and provide you a better experience. We are therefore clear and open about how we collect and use data related to you to include your interests. In the spirit of transparency, this policy provides detailed information about how and when we use cookies.</p>\r\n\r\n    <h3>What is a cookie?</h3>\r\n    <p>A cookie is a small stored on your device to enable our features functionality, information about you and also to help us serve relevant ads to you.</p>\r\n\r\n    <h3>What are cookies used for?</h3>\r\n    <p>Cookies can be used to recognize you when you visit our Application, remember your preferences, and give you a personalized experience that’s in line with your settings. Cookies also make your interactions with us faster and more secure. Additionally, cookies allow us to bring you advertising and bring you customized adverts.</p>\r\n\r\n    <p>The cookies we and our business partners use on this Application are broadly grouped into the following categories:</p>\r\n\r\n    <ul>\r\n        <li>Authentication; if you’re signed in to our Application, cookies helps us show you the right information and personalize your experience</li><br>\r\n        <li>Security; We use cookies to enable and support our security features, and to help us detect malicious activity and violations of our User Agreement</li><br>\r\n        <li>Preference & Service; Cookies can tell us which language you prefer and what your communications preferences are. They can help you fill out forms on more easily. They also provide you with features, insights, and customized content in conjunction with our plugins. You can learn more about plugins in our Privacy Policy.</li><br>\r\n        <li>Advertising; we may use cookies to show you relevant advertising both on and off our site. We may also use a cookie to learn whether someone who saw an ad later visited and took an action on the advertiser’s site. Similarly, our partners may use a cookie to determine whether we’ve shown an ad and how it performed, or provide us with information about how you interact with ads. </li><br>\r\n        <li>Performance & Research; Cookies help us learn how well our site and plugins perform in different locations. We also use cookies to understand, improve, and research products, features, and services, including when you access our site from other Applications, applications, or devices such as your work computer or your mobile device.</li><br>\r\n    </ul>\r\n\r\n    <p>Our server automatically collects data about your server’s internet address when you visit us. This information, known as an Internet Protocol address, or IP Address, is a number that’s automatically assigned to your computer by your internet service provider whenever you’re on the internet. When you request pages from our site, our servers may log your IP Address and sometimes your domain name. Our server may also record the referring page that linked you to us (eg another Application or a search engine); the pages you visit on our site; the Application you visit after our site; the ads you see and/or click on; other information about the type of web browser, computer, platform, related software and settings you are using; any search terms you have entered on our site or a referral site; and other web usage activity and data logged by our web servers. We use this information for internal system administration, to help diagnose problems with our server, and to administer our site. Such information may also be used to gather broad demographic information, such as country of origin and internet service provider. Any or all of activities with regard to our site usage information may be performed on our behalf by our services providers.</p>\r\n\r\n    <h3>Decline reception of cookies</h3>\r\n    <p>When you first visit this Application you will have been shown a message bar drawing your attention to the fact that this Application uses cookies and inviting you to review this cookie policy and manage your cookie preferences. You have an option to accept the invitation to use cookies the prompt message.</p>\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,13,'gdpr_compliance_vendor','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>GDPR COMPLIANCE STATEMENT</h1>\r\n    <p>Waspha is committed to the underlying principles in the GDPR with specification to data privacy provisions, the right to be forgotten, consent and the risk based approach.</p>\r\n    <p>We seek to entrench transparency in our use of data in a lawful, fair, transparent and as necessitated for specific actions.</p>\r\n    <p>Further, we ensure that there is accuracy in data which is updated and removed when no longer needed. </p>\r\n    <p>Finally, we aim to ensure that the data is stored safely and secured.</p>\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,14,'gdpr_compliance_user','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>GDPR COMPLIANCE STATEMENT</h1>\r\n    <p>Waspha is committed to the underlying principles in the GDPR with specification to data privacy provisions, the right to be forgotten, consent and the risk based approach.</p>\r\n    <p>We seek to entrench transparency in our use of data in a lawful, fair, transparent and as necessitated for specific actions.</p>\r\n    <p>Further, we ensure that there is accuracy in data which is updated and removed when no longer needed. </p>\r\n    <p>Finally, we aim to ensure that the data is stored safely and secured.</p>\r\n\r\n</body>\r\n\r\n</html>',NULL),
(NULL,NULL,15,'gdpr_compliance_driver','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Document</title>\r\n</head>\r\n\r\n<body>\r\n\r\n    <h1>GDPR COMPLIANCE STATEMENT</h1>\r\n    <p>Waspha is committed to the underlying principles in the GDPR with specification to data privacy provisions, the right to be forgotten, consent and the risk based approach.</p>\r\n    <p>We seek to entrench transparency in our use of data in a lawful, fair, transparent and as necessitated for specific actions.</p>\r\n    <p>Further, we ensure that there is accuracy in data which is updated and removed when no longer needed. </p>\r\n    <p>Finally, we aim to ensure that the data is stored safely and secured.</p>\r\n\r\n</body>\r\n\r\n</html>',NULL);

insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 14:32:29','2021-01-14 15:01:31','8','Shaan Foods','1','+92','3002312152','Al-Ahram Plaza, Block 13 -A University Rd, Block 13 A Gulshan-e-Iqbal, Karachi, Karachi City, Sindh, Pakistan','24.902837635344','67.07528444007039','30','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/WKoVu30h06.image/jpeg','1','1','10','10',NULL,'465',NULL);
insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 15:15:19','2021-01-14 15:15:19','9','ahmd','0','+92','3054345432','Siddiq Wahab Rd, Police Lines Quarters, Karachi, Karachi City, Sindh, Pakistan','24.86073406313259','67.00113611295819','444','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/WS0sWL1KHI.image/jpeg','1','1','44','44',NULL,'466',NULL);
insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 15:26:21','2021-01-15 06:59:30','10','Zubair Pharmacy','1','+92','3002312150','Plot FL 10/16, Block 13 A Gulshan-e-Iqbal, Karachi, Karachi City, Sindh, Pakistan','24.903747204711287','67.07401240244508','30','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/lLDx0htJfs.image/jpeg','1','1','30','30',NULL,'467',NULL);
insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 15:34:58','2021-01-14 18:56:45','11','Bin Hashim','1','+92','3002312147','Trade Centre, B 48, Block 13 A Gulshan-e-Iqbal, Karachi, Karachi City, Sindh, Pakistan','24.903200734064157','67.07587284967303','100','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/KJyqkZIViu.image/jpeg','1','1','30','60',NULL,'468',NULL);
insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 15:42:37','2021-01-14 15:42:37','12','Bin Safeer ','0','+92','3002315150','Plot FL 10/16, Block 13 A Gulshan-e-Iqbal, Karachi, Karachi City, Sindh, Pakistan','24.903747204711287','67.07401240244508','50','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/m4eKedSruL.image/jpeg','1','1','30','30',NULL,'469',NULL);
insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 17:58:13','2021-01-14 17:58:13','13','Chase','1','+92','3123123121','2 Shaheed-e-Millat Road, CP & Berar CHS, Karachi, Karachi City, Sindh, Pakistan','24.882249946507265','67.06206584349275','100','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/NkkBB1oCZ2.application/pdf','1','1','40','40',NULL,'470',NULL);
insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 19:00:31','2021-01-15 07:11:59','14','Maaz Store','1','+92','3349551625','B 26, Block 13 A Gulshan-e-Iqbal, Karachi, Karachi City, Sindh, Pakistan','24.904879063319076','67.07835489884019','50','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/7JByLjy1IO.image/jpeg','1','1','15','15',NULL,'471',NULL);
insert into `stores` (`createdAt`, `updatedAt`, `id`, `business_name`, `is_online`, `country_code`, `phone`, `address`, `lat`, `lng`, `delivery_range`, `timings`, `image`, `document`, `delivery`, `pickup`, `proposal_prep_time`, `proposal_selection_time`, `deletedAt`, `vendor_id`, `category_id`) values('2021-01-14 19:03:53','2021-01-15 07:25:24','15','DANISH Foods','1','+92','3353365142','2 Shaheed-e-Millat Road, CP & Berar CHS, Karachi, Karachi City, Sindh, Pakistan','24.882249946507265','67.06206584349275','50','fulltime',NULL,'https://waspha.s3.amazonaws.com/stores/ZwrqHvItU5.image/jpeg','1','1','30','30',NULL,'472',NULL);

insert into `request_for_proposals` (`createdAt`, `updatedAt`, `id`, `delivery_location`, `lat`, `lng`, `landmark`, `type`, `scheduled_delivery_time`, `deletedAt`, `user_id`, `status_id`, `subcategory_id`, `delivery_mode_id`) values('2021-01-15 18:03:35','2021-01-15 18:03:38','1','Hasan Square','24.9025','67.0729',NULL,'delivery','2020-01-17 01:00:00',NULL,'44','19','3','2');
insert into `request_for_proposals` (`createdAt`, `updatedAt`, `id`, `delivery_location`, `lat`, `lng`, `landmark`, `type`, `scheduled_delivery_time`, `deletedAt`, `user_id`, `status_id`, `subcategory_id`, `delivery_mode_id`) values('2021-01-15 18:04:05','2021-01-15 18:04:07','2','Hasan Square','24.9025','67.0729',NULL,'delivery','2020-01-17 01:00:00',NULL,'44','22','3','2');
insert into `request_for_proposals` (`createdAt`, `updatedAt`, `id`, `delivery_location`, `lat`, `lng`, `landmark`, `type`, `scheduled_delivery_time`, `deletedAt`, `user_id`, `status_id`, `subcategory_id`, `delivery_mode_id`) values('2021-01-15 18:29:00','2021-01-15 18:29:03','3','Hasan Square','24.9025','67.0729',NULL,'delivery','2020-01-17 01:00:00',NULL,'44','20','3','2');
insert into `request_for_proposals` (`createdAt`, `updatedAt`, `id`, `delivery_location`, `lat`, `lng`, `landmark`, `type`, `scheduled_delivery_time`, `deletedAt`, `user_id`, `status_id`, `subcategory_id`, `delivery_mode_id`) values('2021-01-15 18:30:33','2021-01-15 18:31:29','4','Hasan Square','24.9025','67.0729',NULL,'pickup','2020-01-17 01:00:00',NULL,'44','19','3','2');