-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: product_expiry
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `backups`
--

DROP TABLE IF EXISTS `backups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filePath` varchar(255) NOT NULL,
  `downloadUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backups`
--

LOCK TABLES `backups` WRITE;
/*!40000 ALTER TABLE `backups` DISABLE KEYS */;
INSERT INTO `backups` VALUES (1,'C:\\Users\\DELL\\Desktop\\product_alert_sms\\backups\\backup-1752505914425.sql','backup-1752505914425.sql','2025-07-14 15:11:54');
/*!40000 ALTER TABLE `backups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Vegetables','2025-07-13 00:43:02','2025-07-13 00:43:02'),(2,'Electronics','2025-07-18 21:30:50','2025-07-18 21:30:50'),(3,'Fashion','2025-07-18 21:30:50','2025-07-18 21:30:50'),(4,'Groceries','2025-07-18 21:30:50','2025-07-18 21:30:50'),(5,'Health & Beauty','2025-07-18 21:30:50','2025-07-18 21:30:50'),(6,'Sports & Outdoors','2025-07-18 21:30:50','2025-07-18 21:30:50');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loggings`
--

DROP TABLE IF EXISTS `loggings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loggings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loggings`
--

LOCK TABLES `loggings` WRITE;
/*!40000 ALTER TABLE `loggings` DISABLE KEYS */;
/*!40000 ALTER TABLE `loggings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `expiryDate` datetime NOT NULL DEFAULT (current_timestamp() + interval 30 day),
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `categoryId` int(11) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Fresh',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Crrot','kaaj97838493nj','2025-07-26 00:00:00',NULL,NULL,1,'Expiring Soon','2025-07-13 00:44:21','2025-07-13 00:44:21'),(7,'Samsung Galaxy S22','123456789012','2025-10-16 21:31:06','Latest flagship phone from Samsung','https://example.com/s22.jpg',1,'Fresh','2025-07-18 21:31:06','2025-07-18 21:31:06'),(8,'Nike Air Max','223456789012','2026-01-14 21:31:06','Comfortable running shoes','https://example.com/airmax.jpg',2,'Fresh','2025-07-18 21:31:06','2025-07-18 21:31:06'),(9,'Organic Apple (1kg)','323456789012','2025-07-28 21:31:06','Fresh organic apples','https://example.com/apples.jpg',3,'Fresh','2025-07-18 21:31:06','2025-07-18 21:31:06'),(10,'Nivea Body Lotion','423456789012','2026-07-18 21:31:06','Moisturizing body lotion for dry skin','https://example.com/nivea.jpg',4,'Fresh','2025-07-18 21:31:06','2025-07-18 21:31:06'),(11,'Mountain Bike','523456789012','2027-07-18 21:31:06','Durable off-road bicycle','https://example.com/bike.jpg',5,'Fresh','2025-07-18 21:31:06','2025-07-18 21:31:06');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `generatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercategories`
--

DROP TABLE IF EXISTS `usercategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usercategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserCategories_categoryId_userId_unique` (`userId`,`categoryId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `usercategories_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usercategories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercategories`
--

LOCK TABLES `usercategories` WRITE;
/*!40000 ALTER TABLE `usercategories` DISABLE KEYS */;
INSERT INTO `usercategories` VALUES (1,2,1);
/*!40000 ALTER TABLE `usercategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Inusah Mustapha','inusahmustapha428@gmail.com','$2b$10$6dVAiq1ZXVkELoUSk48Qj.ho3iDZZ7CHscunvMLZDv/PlhiJVIVOS','admin','2025-07-13 00:02:47','2025-07-13 00:02:47'),(2,'Koo Mi','koko@gmail.com','$2b$10$5oJ1YJp01MwWtCGEj5xyIeDT/XdHfYjUVZ3dMxB8jmMkd48fDQ9T6','user','2025-07-18 21:24:33','2025-07-18 21:24:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-18 22:24:45
