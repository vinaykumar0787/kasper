CREATE DATABASE IF NOT EXISTS DB_NAME_P;
USE DB_NAME_P;

CREATE TABLE IF NOT EXISTS KasperUsers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uniqueId CHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
  name VARCHAR(50) UNIQUE NOT NULL,
  userRank INT UNSIGNED NOT NULL,
  createdDate DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;