CREATE TABLE newssite (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR ( 600 ) NOT NULL,
	url VARCHAR ( 600 ) NOT NULL,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE snapshot (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	imageurl VARCHAR ( 600 ) NOT NULL,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    newssite_id INT NOT NULL,
    CONSTRAINT fk_snapshot_newssite_id
    FOREIGN KEY (newssite_id) 
        REFERENCES newssite(id)
);

CREATE TABLE headline (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value_text VARCHAR ( 900 ) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    snapshot_id INT NOT NULL,
    value_text_sentiment text NOT NULL,
    CONSTRAINT fk_headline_snapshot_id
    FOREIGN KEY (snapshot_id) 
        REFERENCES snapshot(id)
);

CREATE TABLE users
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    password text NOT NULL
);
