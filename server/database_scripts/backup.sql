-- MySQL dump 10.13  Distrib 8.0.19, for Linux (x86_64)
--
-- Host: localhost    Database: github
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `id` varchar(255) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `created_at` int NOT NULL,
  `updated_at` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `Comment_ibfk_1` FOREIGN KEY (`username`) REFERENCES `User` (`username`),
  CONSTRAINT `Comment_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Emoji`
--

DROP TABLE IF EXISTS `Emoji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Emoji` (
  `emoji` varchar(255) NOT NULL,
  PRIMARY KEY (`emoji`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Emoji`
--

LOCK TABLES `Emoji` WRITE;
/*!40000 ALTER TABLE `Emoji` DISABLE KEYS */;
/*!40000 ALTER TABLE `Emoji` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FollowsRepository`
--

DROP TABLE IF EXISTS `FollowsRepository`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FollowsRepository` (
  `follower` varchar(255) NOT NULL,
  `repository_id` varchar(255) NOT NULL,
  PRIMARY KEY (`follower`,`repository_id`),
  KEY `repository_id` (`repository_id`),
  CONSTRAINT `FollowsRepository_ibfk_1` FOREIGN KEY (`follower`) REFERENCES `User` (`username`),
  CONSTRAINT `FollowsRepository_ibfk_2` FOREIGN KEY (`repository_id`) REFERENCES `Repository` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FollowsRepository`
--

LOCK TABLES `FollowsRepository` WRITE;
/*!40000 ALTER TABLE `FollowsRepository` DISABLE KEYS */;
/*!40000 ALTER TABLE `FollowsRepository` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FollowsUser`
--

DROP TABLE IF EXISTS `FollowsUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FollowsUser` (
  `follower` varchar(255) NOT NULL,
  `followee` varchar(255) NOT NULL,
  PRIMARY KEY (`follower`,`followee`),
  KEY `followee` (`followee`),
  CONSTRAINT `FollowsUser_ibfk_1` FOREIGN KEY (`follower`) REFERENCES `User` (`username`),
  CONSTRAINT `FollowsUser_ibfk_2` FOREIGN KEY (`followee`) REFERENCES `User` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FollowsUser`
--

LOCK TABLES `FollowsUser` WRITE;
/*!40000 ALTER TABLE `FollowsUser` DISABLE KEYS */;
/*!40000 ALTER TABLE `FollowsUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post` (
  `id` varchar(255) NOT NULL,
  `repository_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  KEY `repository_id` (`repository_id`),
  CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`username`) REFERENCES `User` (`username`),
  CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`repository_id`) REFERENCES `Repository` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reaction`
--

DROP TABLE IF EXISTS `Reaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reaction` (
  `comment_id` varchar(255) NOT NULL,
  `emoji` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`comment_id`,`emoji`,`username`),
  KEY `emoji` (`emoji`),
  KEY `username` (`username`),
  CONSTRAINT `Reaction_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `Comment` (`id`),
  CONSTRAINT `Reaction_ibfk_2` FOREIGN KEY (`emoji`) REFERENCES `Emoji` (`emoji`),
  CONSTRAINT `Reaction_ibfk_3` FOREIGN KEY (`username`) REFERENCES `User` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reaction`
--

LOCK TABLES `Reaction` WRITE;
/*!40000 ALTER TABLE `Reaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reply`
--

DROP TABLE IF EXISTS `Reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reply` (
  `comment_id` varchar(255) NOT NULL,
  `reply_id` varchar(255) NOT NULL,
  PRIMARY KEY (`comment_id`,`reply_id`),
  KEY `reply_id` (`reply_id`),
  CONSTRAINT `Reply_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `Comment` (`id`),
  CONSTRAINT `Reply_ibfk_2` FOREIGN KEY (`reply_id`) REFERENCES `Comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reply`
--

LOCK TABLES `Reply` WRITE;
/*!40000 ALTER TABLE `Reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Repository`
--

DROP TABLE IF EXISTS `Repository`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Repository` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `username` varchar(255) NOT NULL,
  `created_at` int NOT NULL,
  `updated_at` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  CONSTRAINT `Repository_ibfk_1` FOREIGN KEY (`username`) REFERENCES `User` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Repository`
--

LOCK TABLES `Repository` WRITE;
/*!40000 ALTER TABLE `Repository` DISABLE KEYS */;
INSERT INTO `Repository` VALUES ('100656436','Jspsun/AllisonLeagueSite','A little joke site I put together for my GF that uses League\\\'s stylesheets','Jspsun',1503016030,1503116719),('103425238','Jspsun/express-frisk','Express middleware to validate incoming requests','Jspsun',1505321041,1505321042),('103724819','Jspsun/HackTheNorth2017','','Jspsun',1505536342,1505634778),('104016995','Jspsun/hypernova','A service for server\\-side rendering your JavaScript views','Jspsun',1505788773,1505788775),('105116156','AttwellBrian/erlang-atrace-flamegraphs','Generate flamegraphs from Android method trace files','AttwellBrian',1506583608,1506583610),('105412104','pranavjain97/react-native-chatApp','','pranavjain97',1506821671,1506822018),('105926726','SunnyNagam/3DPool','3DPool Game made in the Java based language \\\"Processing\\\"','SunnyNagam',1507228845,1507228890),('106144429','SunnyNagam/Fadeway','Cobresun GameJam 2k17 possibly #1 but ya know we\\\'ll see what happens\\, we\\\'re all busy but at the same time appreciate coding so we might do another one on winter break or Christmas or something like that idk\\, a Christmas themed gamejam would be lit af not that I\\\'m saying we\\\'d do one I\\\'m just saying it would be lit if we possibly did one maybe ok?','SunnyNagam',1507429464,1507489796),('106156389','atulbipin/clojure-spellchecker','A simple spellchecker written in Clojure','atulbipin',1507445750,1511136027),('106746787','AttwellBrian/angularjs-Quizzler','The AngularJS Challenge: Create an online Quiz builder & testing application\\.','AttwellBrian',1507843413,1507843415),('107169589','Jspsun/CtCI-6th-Edition-Python','Cracking the Coding Interview 6th Ed\\. Python Solutions','Jspsun',1508179884,1583890665),('107482204','rahul-iyer/ghtorrent.org','The GHtorrent project website','rahul-iyer',1508376150,1508376152),('107675471','atulbipin/ReSwift','Unidirectional Data Flow in Swift \\- Inspired by Redux','atulbipin',1508502525,1508502526),('10893725','deedy/FindPasture','Submission for the Stanford Hack/Meat 2013 Hackathon','deedy',1372028316,1493625838),('111072679','atulbipin/callback','A full\\-stack web app that lets users send out surveys to a group of people for their product/business','atulbipin',1510904138,1516674933),('111463442','Jspsun/Extend','Chrome browser extension that bridges Ethereum blockhain with reddit','Jspsun',1511212386,1511212388),('111613484','Jspsun/godash','Lodash utility functions for Go','Jspsun',1511307298,1511307063),('11231006','deedy/CheerPeer','Submission for the Human API hackathon','deedy',1373187593,1493625836),('114039580','Jspsun/ece124','','Jspsun',1513113064,1513113066),('115597392','Jspsun/bettertouchtool-crypto','Crypto stock market prices for your Macbook Pro touch bar! (Bitcoin\\, Ethereum\\, Litecoin\\, Neo\\, and Civic)','Jspsun',1514446015,1514333159),('120059478','rahul-iyer/torchMoji','A pyTorch implementation of the DeepMoji model: state\\-of\\-the\\-art deep learning model for analyzing sentiment\\, emotion\\, sarcasm etc','rahul-iyer',1517632371,1517632373),('122398204','AttwellBrian/material-components-android','Modular and customizable Material Design UI components for Android','AttwellBrian',1519249814,1519249819),('124338780','pranavjain97/the-social-network-ios','','pranavjain97',1520484882,1520484884),('124338867','pranavjain97/the-social-network-backend','','pranavjain97',1520484955,1520484957),('124595585','AttwellBrian/LinearAlloc-Samples','LinearAlloc sample code','AttwellBrian',1520631142,1520631144),('125902755','deedy/cbse_schools_data','Cleaned\\, scraped data of all 20\\,367 CBSE schools\\, primarily in India\\, in 2018\\. Data scraped from: cbseaff\\.nic\\.in/cbse_aff/schdir_Report/userview\\.aspx','deedy',1521484057,1580686203),('125965936','deedy/cisce_schools_data','Cleaned\\, scraped data of all 2\\,341 CISCE schools\\, primarily in India\\, in 2018\\. Data scraped from: http://www\\.cisce\\.org/locate\\-search\\.aspx?country=0&state=0&dist=0&city=0&location=&schooltype=&cve=&isc=&icse=&schoolclassi=&school=&search=locate','deedy',1521524165,1569397692),('12631876','deedy/Compilers','Compilers Repo','deedy',1378425809,1493625816),('127518603','SunnyNagam/LearningPlatform','','SunnyNagam',1522488817,1523652340),('129928931','Jspsun/MinimalReactBoilerPlate','A super minimal react boilerplate that uses webpack\\, react router and babel\\.','Jspsun',1523980187,1526878831),('13280168','deedy/elasticsearch','Open Source\\, Distributed\\, RESTful Search Engine','deedy',1380740771,1493625824),('13281376','deedy/javaee7-samples','Java EE 7 Samples','deedy',1380744294,1493625826),('133831997','SunnyNagam/cnn-ms-lesion-segmentation','MS lesion segmentation using cascaded 3D convolutional neural networks','SunnyNagam',1526570332,1526570334),('134113811','SunnyNagam/site','','SunnyNagam',1526783676,1526785334),('134912111','SunnyNagam/FizzBuzz-with-Deep-Neural-Networks','Accuracy \\- 99\\%','SunnyNagam',1527289228,1527300935),('134916417','zahin-mohammad/RuHacks18','RuHacks 2018\\. An app that utilizes your phones location and the Toronto AC locations API to find you the nearest publicly accessible air conditioned area\\.','zahin-mohammad',1527294449,1527558689),('135783804','Jspsun/DotFiles','Cause setting up my macros each time I get a new computer is a pain','Jspsun',1527909891,1578905808),('136498112','SunnyNagam/AntiSocialMediaStyleSheet','','SunnyNagam',1528385872,1528386560),('136832719','AttwellBrian/CarND-LaneLines-P1','Lane Finding Project for Self\\-Driving Car ND','AttwellBrian',1528653899,1528685419),('138233634','SunnyNagam/Keras-GAN','Keras implementations of Generative Adversarial Networks\\.','SunnyNagam',1529625387,1529625389),('13894101','deedy/Connect4AI','A web\\-based Connect Four game built on the Java/Scala framework\\, Play\\. Intended to backed by an AI based on Minimax Trees\\, Heuristic Search and Alpha\\-Beta Pruning\\.','deedy',1382838159,1493625819),('139205660','SunnyNagam/sunnynagam.github.io','Personal site','SunnyNagam',1530316429,1574322013),('140892354','SunnyNagam/GANsPaperCollection','','SunnyNagam',1531515432,1531515434),('141069594','AttwellBrian/CarND-Traffic-Sign-Classifier-Project','Classify Traffic Signs\\.','AttwellBrian',1531702460,1532291594),('141934330','AttwellBrian/CarND-Behavioral-Cloning-P3','Starting files for the Udacity CarND Behavioral Cloning Project','AttwellBrian',1532297498,1532905502),('143510694','atulbipin/spotify-slackbot','','atulbipin',1533370439,1533402366),('143644676','AttwellBrian/CarND-Advanced-Lane-Lines','','AttwellBrian',1533500160,1534779177),('144517129','SunnyNagam/FancyFit','Personal Fitness Android Application ','SunnyNagam',1534125595,1536482904),('145190437','brian-norman/CubicPolynomial','🎮 3D Minimalist Arcade Game for Android and Mac/PC\\. Download on the Play Store now!','brian-norman',1534567204,1548735586),('145274447','atulbipin/PantsOrShorts-iOS','The Official iOS Port of Pants or Shorts','atulbipin',1534654817,1534703920),('145333484','pranavjain97/ChessAI','','pranavjain97',1534708687,1558453948),('146212420','AttwellBrian/CarND-Vehicle-Detection','Vehicle Detection Project','AttwellBrian',1535313799,1535313801),('146331420','brian-norman/sPam-Beesly','💁🏼 A general purpose Discord Bot with GitHub API integration useful for teams\\.','brian-norman',1535390982,1584546815),('146355500','SunnyNagam/BMObot','A friendly discord bot with the ultimate goal of contextual human language processing!','SunnyNagam',1535404706,1557976174),('151014764','AttwellBrian/CarND-Extended-Kalman-Filter-Project','Self\\-Driving Car Nanodegree Program Starter Code for the Extended Kalman Filter Project','AttwellBrian',1538348763,1538860066),('153022776','AttwellBrian/CarND-Unscented-Kalman-Filter-Project','Self\\-Driving Car Nanodegree Program Starter Code for the Unscented Kalman Filter Project','AttwellBrian',1539554276,1539554504),('153497466','rahul-iyer/polite-dialogue-generation','Code for \\\"Polite Dialogue Generation Without Parallel Data\\\"','rahul-iyer',1539797563,1539797565),('154734361','Jspsun/FranzNotionSupport','','Jspsun',1540499854,1540507784),('157974626','SunnyNagam/ENSF480Project1','','SunnyNagam',1542451305,1543283063),('158585260','atulbipin/uw-wkrpt','LaTeX class for writing work reports for the University of Waterloo\\.','atulbipin',1542821986,1542821988),('158718410','AttwellBrian/agario','Realtime multiplayer game\\, in spirit of agar\\.io','AttwellBrian',1542900447,1544023770),('16024702','rahul-iyer/autocompletetext','My First project\\.Used JavaScript/Jquery/PHP for autocomplete text\\.The Suggestions are based upon data in the database ','rahul-iyer',1390046611,1390099560),('16045054','rahul-iyer/Messaging-System','Facebook like messaging System especially developed for Joomla CMS using Joomla API and PHP\\.','rahul-iyer',1390132784,1482173214),('168031381','AttwellBrian/k8s-stackdriver','','AttwellBrian',1548707140,1551470522),('168479763','AttwellBrian/contrib','This is a place for various components in the Kubernetes ecosystem that aren\\\'t part of the Kubernetes core\\. Consider creating a new repo instead\\.','AttwellBrian',1548918534,1555470271),('168787067','rahul-iyer/transformer-xl','','rahul-iyer',1549075621,1549075623),('170564136','SunnyNagam/SENG438','SENG438 ','SunnyNagam',1550085203,1550085205),('175911354','rahul-iyer/mcdowell-cv','A Nice\\-looking CV template made into LaTeX','rahul-iyer',1552699114,1552699116),('178758137','SunnyNagam/SomeMachineLearningProject','A convolutional neural network based on the CycleGan architecture designed to turn cartoons into realistic photos and the other way around\\.','SunnyNagam',1554078790,1579401305),('179473183','SunnyNagam/GlobalInternet','Information about any location\\, at your fingertips\\.','SunnyNagam',1554372607,1554961710),('181577534','AttwellBrian/onelogin-oidc-node','OpenId Connect client examples for SPA or Node apps','AttwellBrian',1555369349,1555369354),('181704388','AttwellBrian/onelogin-oidc-java','OpenId Connect client examples for Java apps','AttwellBrian',1555424385,1555424387),('181978768','rahul-iyer/CSrankings','A web app for ranking computer science departments according to their research output in selective venues\\.','rahul-iyer',1555541002,1555541006),('184942232','SunnyNagam/BeerBot-backend','','SunnyNagam',1557002350,1557008909),('18821079','deedy/FantasyIPL-Moneyball','','deedy',1397608100,1493625803),('19309965','deedy/Latex-Templates','A concise set of Latex templates that serves a small set of needs \\- CV\\, Essays\\, Articles and Problem Sets','deedy',1398853284,1585747651),('19312540','deedy/Deedy-Resume','A one page \\, two asymmetric column resume template in XeTeX that caters to an undergraduate Computer Science student','deedy',1398860075,1585962861),('19401726','deedy/Apache-License','How to add Apache license to a project','deedy',1399116921,1522040275),('19453835','deedy/jekyll','Jekyll is a blog\\-aware\\, static site generator in Ruby','deedy',1399290001,1493625808),('194540529','atulbipin/dev-env-setup','','zahin-mohammad',1561913978,1562184324),('194542271','zahin-mohammad/dev-env-setup','','zahin-mohammad',1561915194,1578170933),('20436315','rahul-iyer/Allroundstudentevalsystem','All round student evaluation system using Machine learning','rahul-iyer',1401786520,1482173030),('20436612','rahul-iyer/LBS','All round Eval System using machine learning','rahul-iyer',1401787136,1436586560),('213059868','atulbipin/moment','Parse\\, validate\\, manipulate\\, and display dates in javascript\\.','atulbipin',1570304055,1570304057),('218194125','brian-norman/bin2Dec','💯 Quick and dirty app to convert binary to decimal','brian-norman',1572318665,1578841352),('220119510','AttwellBrian/helm-charts','You know\\, for Kubernetes','AttwellBrian',1573087763,1573087765),('222792746','Jspsun/298Lab','','Jspsun',1574198765,1575414135),('227275660','SunnyNagam/StockMarketSimulator','','SunnyNagam',1576038098,1578122344),('230006633','Jspsun/home-assistant',':house_with_garden: Open source home automation that puts local control and privacy first','Jspsun',1577223989,1577223992),('230031073','AttwellBrian/nico','A web game written with family over Chistmas\\.','AttwellBrian',1577242115,1578541641),('230214370','Jspsun/js.js','All the UI components I\\\'ve made\\, baked into a nice library','Jspsun',1577344186,1578294582),('233317550','3b1b/moderngl','Modern OpenGL binding for python','3b1b',1578789394,1585825738),('233693396','brian-norman/weightLess','⚖️ Weight Tracking Android Application','brian-norman',1578949523,1579550401),('235706826','SunnyNagam/ArmageddonBlitz','','SunnyNagam',1579745114,1579751391),('240529808','zahin-mohammad/gh-analytics','Playing around with the github API\\.','zahin-mohammad',1581691457,1581722071),('24302594','deedy/dotfiles','My dotfiles','deedy',1411330858,1493625801),('249038105','zahin-mohammad/ece356-project','','zahin-mohammad',1584815817,1585975872),('250709899','brian-norman/Covid-19','🦠 Tracking stats about Covid\\-19','brian-norman',1585367768,1585420980),('28123005','SunnyNagam/sokasuki.github.io','','SunnyNagam',1418794829,1562267386),('29412818','SunnyNagam/Llama-Run','Cobresun Game Jam 2015 ','SunnyNagam',1421547113,1507225116),('29414547','SunnyNagam/Sweet-Tooth','','SunnyNagam',1421552011,1574138627),('32689863','3b1b/manim','Animation engine for explanatory math videos','3b1b',1427050258,1585974904),('36865887','rahul-iyer/BuildingMachineLearningSystemsWithPython','Source Code for the book Building Machine Learning Systems with Python','rahul-iyer',1433416592,1494485159),('37183170','deedy/HiddenMarkovModelRandomWalk','','deedy',1433922613,1556466871),('37298456','rahul-iyer/mosesdecoder','Moses\\, the machine translation system','rahul-iyer',1434077353,1434077363),('37763815','AttwellBrian/JCenter','','AttwellBrian',1434790315,1456960812),('38081188','SunnyNagam/old.SunnyNagam.github.io','A website for me! Learning html and css bbqs\\.','SunnyNagam',1435277631,1530316347),('38277643','AttwellBrian/Android-StaticLauncher','An example project of Android annotation processing using Gradle\\.','AttwellBrian',1435622399,1435622399),('38709574','AttwellBrian/loglifecycle','Logs all lifecycle methods of annotated Activities\\, Fragments\\, Services\\, Views\\, etc\\.','AttwellBrian',1436296862,1436296863),('41633407','brian-norman/Dem2Cal','📆 Downloads course schedules from school website and uploads it to Google Calendar\\.','brian-norman',1440948583,1574138756),('42651003','rahul-iyer/smsdetection','SMS spam detector','rahul-iyer',1442487227,1442496227),('44362207','AttwellBrian/android-ramping-noise','Android app that gradually starts generating white noise after you fall asleep\\.','AttwellBrian',1444969617,1482816441),('45285525','SunnyNagam/AddingWithFriends','Learning to use git to cooperate with other people via adding numbers','SunnyNagam',1446257635,1446259691),('45326138','SunnyNagam/TriggerEdge','','SunnyNagam',1446346306,1556932262),('45417526','SunnyNagam/BattleField','Comp Sci 2015 ','SunnyNagam',1446493225,1556932270),('45432151','AttwellBrian/hugo','Annotation\\-triggered method call logging for your debug builds\\.','AttwellBrian',1446512052,1490264869),('46354495','deedy/gradcafe_data','','deedy',1447772675,1580777405),('46638964','SunnyNagam/Brun-Craft','Waterloo come at us ','SunnyNagam',1448149859,1448150045),('52317610','3b1b/perseus','Perseus is Khan Academy\\\'s new exercise question editor and renderer\\.','3b1b',1456188280,1585580775),('57976664','deedy/cricket-predictor','','deedy',1462286593,1538231878),('58869603','rahul-iyer/OpinionMiningForProductEnhancement','BE project','rahul-iyer',1463326651,1463326669),('6316757','deedy/3DGrapherJava','A 3D Graphing tool in Java','deedy',1350792265,1396149170),('6316784','deedy/Breakout','A full implementation of the classic game Breakout on Java','deedy',1350792527,1381444364),('6316823','deedy/LabelStuffDataAnalysis','Some tools to analyze the \\.xml data of LabelStuff\\, http://labelstuff\\.cs\\.cornell\\.edu/','deedy',1350792924,1392556391),('6316992','deedy/HotelManagement','A text\\-based Hotel Management application built on C++\\.','deedy',1350794417,1422801444),('6317833','deedy/AudioGrab','A script that fetches the top 100 songs of iTunes off the web\\, albeit unreliably\\.','deedy',1350801958,1386595599),('6321237','deedy/FacebookFun','A few shell scripts which shows you some fun facts about your Facebook profile\\.','deedy',1350829554,1556696225),('6321385','deedy/Custom-Scheme-Interpreter','A custom Scheme Interpreter designed in OCaml\\.','deedy',1350830555,1579223670),('6321434','deedy/2x2x2CubeSolver','A text\\-based 2x2x2 Rubix Cube Solver\\, built in OCaml\\.','deedy',1350830804,1399610502),('6321769','deedy/Explorer-Navigational-Website','A file explorer like navigational website which allows adding\\, storing and viewing of images\\, other webpages and other file formats\\.','deedy',1350832687,1383639491),('63472004','AttwellBrian/phab-username-highlighter-plugin','Highlights specified usernames in the reviewer line under diffs\\. Helps you determine if you have been directly added as a reviewer\\, or if you have been added as a part of a group\\. Also deletes diffs that you have approved from your queue\\.','AttwellBrian',1468655515,1491190598),('64088734','pranavjain97/myPages--SPRING-MVC','On Local Host','pranavjain97',1469399905,1469400205),('64547535','pranavjain97/myWebBrowser','A simple Web Browser made with Java','pranavjain97',1469888313,1487962798),('6516997','deedy/eBayBay','A Chrome Extension that finds better prices for books on eBay if you\\\'re about to buy it on Amazon\\.','deedy',1351923534,1493625851),('65251183','AttwellBrian/dagger','A fast dependency injector for Android and Java\\.','AttwellBrian',1470704904,1470704906),('67192219','rahul-iyer/SQL_to_English_Machine_Translation','','rahul-iyer',1472793418,1472794468),('67922314','pranavjain97/ScoreBored','An Android App developed at Penn Apps Hackathon\\, where 2 users can communicate to rate a 3rd person by on\\-spot tapping\\. ','pranavjain97',1473587294,1490766557),('68173352','pranavjain97/Messenger-Pro','Exchanges messages on the same computer between Client and Server\\. Implemented using GUI libraries\\, server sockets and streams','pranavjain97',1473827395,1558453076),('68174105','pranavjain97/Billing-System','A desktop application which allows admins and customers to Search\\, Modify\\, Copy\\, Add and Delete records separately\\. Flexible to be used by Hotels/Supermarkets and similar\\.  ','pranavjain97',1473828438,1490363001),('68175385','pranavjain97/JavaScript-Gists','Snippets for Phone Library\\, Rock Paper Scissors\\, Cash Register','pranavjain97',1473830088,1487962877),('69145219','pranavjain97/pranavjain97.github.io','','pranavjain97',1474780539,1557518235),('69369002','atulbipin/TrueFalseStarter','','atulbipin',1474988741,1474988858),('70562978','SunnyNagam/ArraySorterVisualization','A simple program that provides a visualization for different sorting algorithms','SunnyNagam',1476167267,1485281253),('70969048','Jspsun/LEETCodePractice','All the code I\\\'ve written in preparation for coding interviews','Jspsun',1476510179,1579936923),('72500403','pranavjain97/Marquee','Scrolling text','pranavjain97',1477970714,1477970842),('72916775','Jspsun/Athena1.0','A Voice assistant that lets you control your computer hands free','Jspsun',1478338382,1566993660),('73437357','Jspsun/Origin','A small game that I put together in Java','Jspsun',1478829820,1487485125),('73438209','Jspsun/CompetitiveCoding','Just me doing some easy\\-medium contest problems\\. The key was to do it in O(fast enough)','Jspsun',1478830667,1478830706),('74667405','rahul-iyer/rahul-iyer.github.io','Personal Page','rahul-iyer',1479987263,1554045005),('75024800','Jspsun/employHer','','Jspsun',1480377292,1480377294),('76283956','Jspsun/FirstYearProgrammingPractice','Just a few practice problems that I\\\'m guessing may show up on my first year programming exam','Jspsun',1481567390,1481567673),('77361125','rahul-iyer/resumecard','You can see the live demo','rahul-iyer',1482731512,1482731515),('77379499','rahul-iyer/elasticsearch-jq','','rahul-iyer',1482751597,1482751620),('77379688','rahul-iyer/repo_as_subtree','Pulls a repository and makes it as a sub folder in another respository','rahul-iyer',1482751814,1482751850),('77416994','Jspsun/DataStructures','Some implementation of data structures','Jspsun',1482802882,1482803050),('77751207','Jspsun/Athena2.0','An IOT voice assistant with natural language processing\\, smart home integration and talk\\-back functionality\\.','Jspsun',1483207850,1496435318),('78606115','atulbipin/VoiceChanger','','atulbipin',1484112766,1495203590),('7884405','AttwellBrian/face-access-control','Face Unlock','AttwellBrian',1359429496,1538224093),('80201860','Jspsun/DuoToneMaterial','A custom Atom IDE theme! My personal theme with matching colors and material ui','Jspsun',1485516138,1485516364),('80943821','brian-norman/TrumpBot','🤴🏻 A twitter bot that aggregates and lists Trump\\\'s most tweeted words\\.','SunnyNagam',1486237542,1535697411),('81912991','Jspsun/Jonathan.solar','My personal site! Animated with 100\\% Css animations :^)','Jspsun',1487053744,1526875385),('82507584','pranavjain97/Bouncy','A Java Arcade Game ','pranavjain97',1487557284,1560142292),('84094361','brian-norman/ISeeYouHacking.com','🔌 Website and winner of Martello API Challenge at CUHacking 2017\\.','brian-norman',1488817094,1535697537),('84585600','rahul-iyer/awesome-courses',':books: List of awesome university courses for learning Computer Science!','rahul-iyer',1489167773,1494485227),('84905835','pranavjain97/SyncUp','','pranavjain97',1489466079,1489610986),('84906457','pranavjain97/LeetcodePractice','My solutions which I\\\'ve written in preparation for the coding interviews in Java and Python','pranavjain97',1489466727,1490979369),('86000881','pranavjain97/gradSchool-analyser','','pranavjain97',1490305772,1490306047),('86136716','atulbipin/WatSwift','UWaterloo OpenData Client in Swift','atulbipin',1490422342,1490422343),('86856355','brian-norman/column-remover','A simple column remover for large files (any character separated)','brian-norman',1490990865,1574138862),('86903012','rahul-iyer/word2vec_commented','Commented (but unaltered) version of original word2vec C implementation\\.','rahul-iyer',1491039605,1491039606),('89183362','pranavjain97/WeatherForMe','','pranavjain97',1492995577,1492995841),('89434519','Jspsun/EvolutionSimulator','Visualize evolution in a really pretty way!','Jspsun',1493177931,1495260563),('89771856','SunnyNagam/DigitRecognition','Neural network in Java to read simple writing','SunnyNagam',1493452700,1497409961),('90090374','atulbipin/ShopifyDemo','','atulbipin',1493770551,1493770760),('91134166','deedy/india-nfhs4','','deedy',1494628197,1558110529),('92273893','rahul-iyer/http_request_signer_AWS','Signs the HTTP request producing Authorization headers for AWS API Gateway requests\\.','rahul-iyer',1495617617,1507666317),('92543422','atulbipin/EngHacks','EngHacks project','atulbipin',1495827899,1495828176),('9263704','deedy/CS5625Interactive','','deedy',1365269141,1493625840),('93118962','Jspsun/AthenaServer','','Jspsun',1496370660,1496370713),('93197690','Jspsun/AthenaSmartWatchFace','','Jspsun',1496431858,1496431922),('93198404','Jspsun/Athena','Master repository for AthenaAI: an all purpose voice assistant: Think Iron Man\\\'s Jarvis but real :D','Jspsun',1496432466,1496439412),('93432347','rahul-iyer/AI-resources','Selection of resources to learn Artificial Intelligence / Machine Learning / Deep Learning ','rahul-iyer',1496685684,1496682732),('93438503','Jspsun/markov-messenger-bot','A Fb Messanger autoresponder that mimics the way you speak','Jspsun',1496690656,1524889626),('93773888','brian-norman/ChristmasRedditBot','🎅🏼 Python Reddit Bot I made in 2014 to respond to \\\"Merry Christmas\\\" in Reddit comments','brian-norman',1496942040,1574138839),('94374274','SunnyNagam/JokeTweetBot','Tweets top voted joke from reddit daily','SunnyNagam',1497475412,1497475660),('94557072','AttwellBrian/dexClassSizeAnalyzer','Tool for analyzing size of classes in dex files','AttwellBrian',1497626751,1541786794),('94790683','AttwellBrian/parse_androiddex','解析Android中的dex文件格式','AttwellBrian',1497885332,1497885334),('94792272','AttwellBrian/decompiling-android','Source code for \\\'Decompiling Android\\\' by Godfrey Nolan','AttwellBrian',1497886209,1497886211),('94794976','AttwellBrian/oatdump_plus','Extended oatdump from Android ART repo\\, to support class & method level dumps','AttwellBrian',1497887904,1497887911);
/*!40000 ALTER TABLE `Repository` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `username` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `last_login_time` int NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('3b1b','Grant Sanderson','https://avatars0.githubusercontent.com/u/11601040?v=4','3b1b@example.com',1585976166,'password'),('alanyee','Alan Yee','https://avatars2.githubusercontent.com/u/1873994?v=4','alanyee@example.com',1585976296,'password'),('anil-goudar','Anilkumar C Goudar','https://avatars1.githubusercontent.com/u/46928637?v=4','anil-goudar@example.com',1585976275,'password'),('anthonyattard','Anthony Attard','https://avatars0.githubusercontent.com/u/8838135?v=4','anthony@anthonyattard.com',1585976288,'password'),('applemonkey496','None','https://avatars0.githubusercontent.com/u/55333787?v=4','applemonkey496@example.com',1585976346,'password'),('AttwellBrian','Brian Attwell','https://avatars3.githubusercontent.com/u/549900?v=4','AttwellBrian@example.com',1585976257,'password'),('atulbipin','Atul Bipin','https://avatars2.githubusercontent.com/u/19649216?v=4','atulbipin@gmail.com',1585976164,'password'),('azarzadavila','None','https://avatars1.githubusercontent.com/u/37216245?v=4','azarzadavila@example.com',1585976350,'password'),('badele','Bruno Adele','https://avatars0.githubusercontent.com/u/2806307?v=4','badele@example.com',1585976348,'password'),('brian-norman','Brian Norman','https://avatars0.githubusercontent.com/u/9154202?v=4','briankn8@gmail.com',1585976436,'password'),('chenxijun','尘息','https://avatars1.githubusercontent.com/u/16610294?v=4','chenxijun2247338@hotmail.com',1585976346,'password'),('csaund','Carolyn Saund','https://avatars3.githubusercontent.com/u/2955073?v=4','carolyn.saund@gmail.com',1585976286,'password'),('daniel-lara-ec','None','https://avatars1.githubusercontent.com/u/53488713?v=4','daniel-lara-ec@example.com',1585976393,'password'),('Data-drone','Brian','https://avatars3.githubusercontent.com/u/4410493?v=4','Data-drone@example.com',1585976294,'password'),('ddxtanx','Garrett Credi','https://avatars2.githubusercontent.com/u/13473097?v=4','ddxtanx@example.com',1585976396,'password'),('deedy','Debarghya Das','https://avatars1.githubusercontent.com/u/1846373?v=4','dd367@cornell.edu',1585976164,'password'),('DeeprajPandey','Deepraj Pandey','https://avatars1.githubusercontent.com/u/15888623?v=4','DeeprajPandey@example.com',1585976282,'password'),('dependabot[bot]','None','https://avatars0.githubusercontent.com/in/29110?v=4','dependabot[bot]@example.com',1585976247,'password'),('edasubert','None','https://avatars3.githubusercontent.com/u/6988280?v=4','edasubert@example.com',1585976354,'password'),('emanueldias242','None','https://avatars1.githubusercontent.com/u/59492262?v=4','emanueldias242@example.com',1585976394,'password'),('EmmanueleSalvati','Emmanuele Salvati','https://avatars3.githubusercontent.com/u/2431631?v=4','EmmanueleSalvati@example.com',1585976305,'password'),('Enempie','None','https://avatars1.githubusercontent.com/u/62567027?v=4','Enempie@example.com',1585976368,'password'),('girishgargcool','Girish Garg','https://avatars3.githubusercontent.com/u/52619530?v=4','girishgargcool@gmail.com',1585976366,'password'),('Haffi112','Hafsteinn Einarsson','https://avatars3.githubusercontent.com/u/122062?v=4','haffi.e@gmail.com',1585976380,'password'),('hanwenzhu','Thomas Zhu','https://avatars1.githubusercontent.com/u/29544653?v=4','hanwenzhu@example.com',1585976382,'password'),('hengdashi','Hengda Shi','https://avatars1.githubusercontent.com/u/17505657?v=4','hengda.shi@engineering.ucla.edu',1585976277,'password'),('iGeek098','Youssef Mohammed','https://avatars1.githubusercontent.com/u/11638396?v=4','youssef.2012.0@gmail.com',1585976395,'password'),('isometric','James Deng','https://avatars1.githubusercontent.com/u/1491297?v=4','james.deng@alumni.ubc.ca',1585976297,'password'),('jck','Keerthan Jaic','https://avatars1.githubusercontent.com/u/315886?v=4','jck@example.com',1585976295,'password'),('Jli0423','Justin Li','https://avatars2.githubusercontent.com/u/23007179?v=4','Jli0423@example.com',1585976406,'password'),('joshjacobson','Josh Jacobson','https://avatars0.githubusercontent.com/u/1466632?v=4','joshjacobson@example.com',1585976291,'password'),('Jspsun','Jonathan Sun','https://avatars1.githubusercontent.com/u/15675690?v=4','jonathan.sun@uwaterloo.ca',1585976398,'password'),('keenangaudio','Keenan Gaudio','https://avatars3.githubusercontent.com/u/35779579?v=4','keenangaudio@example.com',1585976334,'password'),('kfeine','None','https://avatars3.githubusercontent.com/u/23533762?v=4','kfeine@example.com',1585976291,'password'),('kirkang','None','https://avatars2.githubusercontent.com/u/17738053?v=4','kirkang@example.com',1585976296,'password'),('kolibril13','None','https://avatars2.githubusercontent.com/u/44469195?v=4','kolibril13@example.com',1585976349,'password'),('Lalourche','Lalourche','https://avatars3.githubusercontent.com/u/1742427?v=4','Lalourche@example.com',1585976354,'password'),('lewis-cooper','None','https://avatars3.githubusercontent.com/u/62891818?v=4','lewis-cooper@example.com',1585976351,'password'),('li-boxuan','Boxuan Li','https://avatars2.githubusercontent.com/u/25746010?v=4','li-boxuan@example.com',1585976268,'password'),('louisj381','Louis Johnson','https://avatars3.githubusercontent.com/u/23280852?v=4','louisj381@gmail.com',1585976334,'password'),('luketimmerman314','None','https://avatars1.githubusercontent.com/u/62107786?v=4','luketimmerman314@example.com',1585976395,'password'),('margarineHound','None','https://avatars1.githubusercontent.com/u/7854019?v=4','margarineHound@example.com',1585976276,'password'),('MatejVe','None','https://avatars2.githubusercontent.com/u/44779315?v=4','MatejVe@example.com',1585976358,'password'),('Micoael','3m1p','https://avatars0.githubusercontent.com/u/24697173?v=4','Micoael@example.com',1585976353,'password'),('mvfs314','None','https://avatars1.githubusercontent.com/u/25464768?v=4','mvfs314@example.com',1585976355,'password'),('naveenT1010','None','https://avatars1.githubusercontent.com/u/12369946?v=4','naveenT1010@example.com',1585976285,'password'),('nickyr','Nicky Robinson','https://avatars0.githubusercontent.com/u/1389687?v=4','nickyr@example.com',1585976300,'password'),('niranjantdesai','Niranjan Thakurdesai','https://avatars3.githubusercontent.com/u/15803433?v=4','niranjantdesai@example.com',1585976284,'password'),('nosnakeob','Snake','https://avatars2.githubusercontent.com/u/47769817?v=4','nosnakeob@example.com',1585976357,'password'),('pranavjain97','Pranav Jain','https://avatars1.githubusercontent.com/u/19895524?v=4','pranavjain97@yahoo.in',1585976167,'password'),('prateekiiest','Prateek Chanda','https://avatars0.githubusercontent.com/u/16035442?v=4','prateekkol21@gmail.com',1585976281,'password'),('qo4on','None','https://avatars2.githubusercontent.com/u/35609308?v=4','qo4on@example.com',1585976359,'password'),('rahul-iyer','Rahul Iyer','https://avatars1.githubusercontent.com/u/6436620?v=4','rahul-iyer@example.com',1585976165,'password'),('Ranoiaetep','None','https://avatars1.githubusercontent.com/u/55516229?v=4','Ranoiaetep@example.com',1585976358,'password'),('rpadams','Ryan Adams','https://avatars2.githubusercontent.com/u/1450174?v=4','rpadams@example.com',1585976392,'password'),('rrshaban','Razi Shaban','https://avatars2.githubusercontent.com/u/9829375?v=4','rrshaban@example.com',1585976303,'password'),('SquaredPi','Francesco Morini','https://avatars0.githubusercontent.com/u/1656094?v=4','francescomorini@about.me',1585976301,'password'),('srdg','Soumik Ranjan Dasgupta','https://avatars1.githubusercontent.com/u/20687315?v=4','srdg@example.com',1585976284,'password'),('Steff-san','None','https://avatars0.githubusercontent.com/u/62459475?v=4','Steff-san@example.com',1585976371,'password'),('SunnyNagam','Sunny Nagam','https://avatars3.githubusercontent.com/u/9154254?v=4','sunnynagam1@gmail.com',1585976339,'password'),('tanyachawla412','Tanya Chawla','https://avatars0.githubusercontent.com/u/54217015?v=4','tanya.chawla412@gmail.com',1585976276,'password'),('timalive','None','https://avatars0.githubusercontent.com/u/664629?v=4','timalive@example.com',1585976353,'password'),('utkuturk','utku turk','https://avatars2.githubusercontent.com/u/34624245?v=4','utku.turk@boun.edu.tr',1585976278,'password'),('Void2258','None','https://avatars3.githubusercontent.com/u/6126362?v=4','Void2258@example.com',1585976304,'password'),('voidstarstar','voidstarstar','https://avatars1.githubusercontent.com/u/8335186?v=4','voidstarstar@example.com',1585976278,'password'),('wrmacrae','None','https://avatars1.githubusercontent.com/u/2793499?v=4','wrmacrae@example.com',1585976290,'password'),('yadavabhinav16','None','https://avatars2.githubusercontent.com/u/18577454?v=4','yadavabhinav16@example.com',1585976280,'password'),('zahin-mohammad','Zahin Mohammad','https://avatars1.githubusercontent.com/u/24881706?v=4','zahin.dev@gmail.com',1585976442,'password');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-04 16:27:27
