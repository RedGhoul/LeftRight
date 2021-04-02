CREATE TABLE newssite (
	id serial PRIMARY KEY,
	name VARCHAR ( 600 ) NOT NULL,
	url VARCHAR ( 600 ) NOT NULL,
	created_on timestamp not null default NOW()::timestamp
);
CREATE INDEX idx_newssite_created_on ON newssite(created_on);
CREATE INDEX idx_newssite_name ON newssite(name);
CREATE INDEX idx_newssite_url ON newssite(url);

CREATE TABLE snapshot (
	id serial PRIMARY KEY,
	imageurl VARCHAR ( 600 ) NOT NULL,
	created_on timestamp not null default NOW()::timestamp,
    newssite_id INT NOT NULL,
    CONSTRAINT snapshot_newssite_id_fkey FOREIGN KEY (newssite_id)
        REFERENCES newssite (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE INDEX idx_snapshot_created_on ON snapshot(created_on);
CREATE INDEX idx_snapshot_imageurl ON snapshot(imageurl);
CREATE INDEX idx_snapshot_newssite_id ON snapshot(newssite_id);

CREATE TABLE headline (
    id serial PRIMARY KEY,
    value_text text NOT NULL,
    created_on timestamp not null default NOW()::timestamp,
    snapshot_id INT NOT NULL,
    value_text_sentiment text NOT NULL,
    CONSTRAINT headline_snapshot_id_fkey FOREIGN KEY (snapshot_id)
        REFERENCES snapshot (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE INDEX idx_headline_created_on ON headline(created_on);
CREATE INDEX idx_headline_value_text ON headline(value_text);
CREATE INDEX idx_headline_value_text_sentiment ON headline(value_text_sentiment);

CREATE TABLE users
(
    id serial PRIMARY KEY,
    name character(255) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL
);
