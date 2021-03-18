CREATE TABLE newssite (
	id serial PRIMARY KEY,
	name VARCHAR ( 600 ) NOT NULL,
	url VARCHAR ( 600 ) NOT NULL,
	created_on Date not null default CURRENT_DATE
);
CREATE TABLE snapshot (
	id serial PRIMARY KEY,
	imageurl VARCHAR ( 600 ) NOT NULL,
	created_on Date not null default CURRENT_DATE,
    newssite_id INT NOT NULL,
    CONSTRAINT snapshot_newssite_id_fkey FOREIGN KEY (newssite_id)
        REFERENCES newssite (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE headline (
    id serial PRIMARY KEY,
    value_text text NOT NULL,
    created_on Date not null default CURRENT_DATE,
    snapshot_id INT NOT NULL,
    CONSTRAINT headline_snapshot_id_fkey FOREIGN KEY (snapshot_id)
        REFERENCES snapshot (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE users
(
    id serial PRIMARY KEY,
    name character(255) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL
);
