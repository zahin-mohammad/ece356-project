DROP DATABASE IF EXISTS github;
CREATE DATABASE IF NOT EXISTS github;
USE github;

-- ----------------------------
--  Entity Definitions
-- ----------------------------
DROP TABLE IF EXISTS User;
CREATE TABLE User (
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    last_login_time TIMESTAMP NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

DROP TABLE IF EXISTS Repository;
CREATE TABLE Repository (
    id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (username) REFERENCES User(username)
);

DROP TABLE IF EXISTS Post;
CREATE TABLE Post (
    id VARCHAR(255) NOT NULL,
    repository_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    comment_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (repository_id) REFERENCES Repository(id)
);

DROP TABLE IF EXISTS Comment;
CREATE TABLE Comment (
    id VARCHAR(255) NOT NULL,
    post_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (post_id) REFERENCES Post(id)
);

DROP TABLE IF EXISTS Emoji;
CREATE TABLE Emoji (
    emoji VARCHAR(255) NOT NULL,
    PRIMARY KEY (emoji)
);


-- ----------------------------
--  Entity Relationships
-- ----------------------------
DROP TABLE IF EXISTS FollowsUser;
CREATE TABLE FollowsUser (
    follower VARCHAR(255) NOT NULL,
    followee VARCHAR(255) NOT NULL,
    PRIMARY KEY (follower, followee),
    FOREIGN KEY (follower) REFERENCES User(username),
    FOREIGN KEY (followee) REFERENCES User(username)
);

DROP TABLE IF EXISTS FollowsRepository;
CREATE TABLE FollowsRepository (
    follower VARCHAR(255) NOT NULL,
    repository_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (follower, repository_id),
    FOREIGN KEY (follower) REFERENCES User(username),
    FOREIGN KEY (repository_id) REFERENCES Repository(id)
);

DROP TABLE IF EXISTS Reaction;
CREATE TABLE Reaction (
    comment_id VARCHAR(255) NOT NULL,
    emoji VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (comment_id, emoji, username),
    FOREIGN KEY (comment_id) REFERENCES Comment(id),
    FOREIGN KEY (emoji) REFERENCES Emoji(emoji),
    FOREIGN KEY (username) REFERENCES User(username)
);

DROP TABLE IF EXISTS Reply;
CREATE TABLE Reply (
    comment_id VARCHAR(255) NOT NULL,
    reply_id VARCHAR(255) NOT NULL,
    PRIMARY KEY(comment_id, reply_id),
    FOREIGN KEY (comment_id) REFERENCES Comment(id),
    FOREIGN KEY (reply_id) REFERENCES Comment(id)
);
