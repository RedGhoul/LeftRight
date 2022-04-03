CREATE TABLE "public"."newssite"  (
	id INT GENERATED ALWAYS AS IDENTITY,
	name VARCHAR ( 600 ) NOT NULL,
	url VARCHAR ( 600 ) NOT NULL,
	created_on  timestamp NOT NULL DEFAULT NOW(),
    PRIMARY KEY(id)
);

CREATE TABLE  "public"."snapshot" (
	id INT GENERATED ALWAYS AS IDENTITY,
	imageurl VARCHAR ( 1000 ) NOT NULL,
	created_on  timestamp NOT NULL DEFAULT NOW(),
    newssite_id INT NOT NULL,
    CONSTRAINT fk_snapshot_newssite_id
    FOREIGN KEY (newssite_id) 
        REFERENCES newssite(id),
    PRIMARY KEY(id)
);

CREATE TABLE  "public"."headline" (
    id INT GENERATED ALWAYS AS IDENTITY,
    value_text VARCHAR ( 900 ) NOT NULL,
    created_on timestamp NOT NULL DEFAULT NOW(),
    snapshot_id INT NOT NULL,
    value_text_sentiment text NULL,
    CONSTRAINT fk_headline_snapshot_id
    FOREIGN KEY (snapshot_id) 
        REFERENCES snapshot(id),
    PRIMARY KEY(id)
);

CREATE TABLE  "public"."users"
(
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    password text NOT NULL,
    PRIMARY KEY(id)
);
