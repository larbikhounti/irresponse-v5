-- Table: production.gmail_processes

-- DROP TABLE IF EXISTS production.gmail_processes;

CREATE TABLE IF NOT EXISTS production.gmail_processes
(
    id integer NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" NOT NULL,
    process_id character varying(20) COLLATE pg_catalog."default",
    process_type character varying(100) COLLATE pg_catalog."default" NOT NULL,
    start_time timestamp without time zone NOT NULL,
    finish_time timestamp without time zone,
    servers_ids text COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    total_emails integer,
    progress integer,
    affiliate_network_id integer,
    offer_id integer,
    isp_id integer,
    auto_responders_ids text COLLATE pg_catalog."default",
    data_start integer,
    data_count integer,
    lists text COLLATE pg_catalog."default",
    delivered integer,
    hard_bounced integer,
    soft_bounced integer,
    opens integer,
    clicks integer,
    leads integer,
    unsubs integer,
    negative_file_path text COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT c_pk_id_gmail_processes PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS production.gmail_processes
    OWNER to admin;
-- Index: production_gmail_processes_idx

-- DROP INDEX IF EXISTS production.production_gmail_processes_idx;

CREATE INDEX IF NOT EXISTS production_gmail_processes_idx
    ON production.gmail_processes USING btree
    (id ASC NULLS LAST, status COLLATE pg_catalog."default" ASC NULLS LAST, process_type COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS production.gmail_processes
    CLUSTER ON production_gmail_processes_idx;