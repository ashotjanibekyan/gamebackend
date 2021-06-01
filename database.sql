CREATE DATABASE gamedb;

CREATE TABLE myuser (
    user_uuid VARCHAR(100) PRIMARY KEY NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    last_seen TIMESTAMPTZ,
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expired_on TIMESTAMPTZ
);

CREATE TABLE paypal (
    user_uuid VARCHAR(100) NOT NULL,
    session_uuid VARCHAR(100) NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount INTEGER NOT NULL,
    status INTEGER NOT NULL,
    FOREIGN KEY(user_uuid) REFERENCES myuser(user_uuid),
    CONSTRAINT status_values CHECK(status IN (0, 1, 2))
);