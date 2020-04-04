-- create database and tables
DROP DATABASE IF EXISTS github;
CREATE DATABASE IF NOT EXISTS github;

-- create user for express app
CREATE USER 'express' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON github . * TO 'express';
FLUSH PRIVILEGES;
