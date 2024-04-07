-- Table: admin.gmail_users

-- DROP TABLE IF EXISTS admin.gmail_users;

CREATE TABLE IF NOT EXISTS admin.gmail_users
(
    id bigint NOT NULL,
    gmail_server_id integer NOT NULL,
    gmail_server_name character varying COLLATE pg_catalog."default" NOT NULL,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    created_by character varying COLLATE pg_catalog."default",
    last_updated_by character varying COLLATE pg_catalog."default",
    created_date date,
    last_updated_date date,
    access_token character varying COLLATE pg_catalog."default",
    recovery character varying COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS admin.gmail_users
    OWNER to admin;