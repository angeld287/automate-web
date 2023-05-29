-- FUNCTION: public.trigger_set_timestamp()

-- DROP FUNCTION IF EXISTS public.trigger_set_timestamp();

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.trigger_set_timestamp()
    OWNER TO admin;

-- FUNCTION: public.trigger_set_timestamp_deleted_at()

-- DROP FUNCTION IF EXISTS public.trigger_set_timestamp_deleted_at();

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp_deleted_at()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
  NEW.deleted_at = NOW();
  RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.trigger_set_timestamp_deleted_at()
    OWNER TO admin;



-- Table: public.federated_auth_profiles

-- DROP TABLE IF EXISTS public.federated_auth_profiles;

CREATE TABLE IF NOT EXISTS public.federated_auth_profiles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    kind character(50) COLLATE pg_catalog."default" NOT NULL,
    profile_id character(400) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT federated_auth_profiles_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.federated_auth_profiles
    OWNER to admin;


-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email character(100) COLLATE pg_catalog."default",
    phone_number character(50) COLLATE pg_catalog."default",
    user_password character(100) COLLATE pg_catalog."default" NOT NULL,
    password_reset_token character(100) COLLATE pg_catalog."default",
    password_reset_expires date,
    fullname character(100) COLLATE pg_catalog."default" NOT NULL,
    gender character(1) COLLATE pg_catalog."default",
    profile integer,
    user_name character(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_profile_fkey FOREIGN KEY (profile)
        REFERENCES public.federated_auth_profiles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to admin;


-- Table: public.tokens

-- DROP TABLE IF EXISTS public.tokens;

CREATE TABLE IF NOT EXISTS public.tokens
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    kind character(50) COLLATE pg_catalog."default" NOT NULL,
    access_token character(400) COLLATE pg_catalog."default" NOT NULL,
    token_secret character(400) COLLATE pg_catalog."default",
    user_id integer,
    CONSTRAINT tokens_pkey PRIMARY KEY (id),
    CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tokens
    OWNER to admin;


-- Table: public.roles

-- DROP TABLE IF EXISTS public.roles;

CREATE TABLE IF NOT EXISTS public.roles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    role_name character(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roles
    OWNER to admin;


-- Table: public.user_roles

-- DROP TABLE IF EXISTS public.user_roles;

CREATE TABLE IF NOT EXISTS public.user_roles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    CONSTRAINT user_roles_pkey PRIMARY KEY (id),
    CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_roles
    OWNER to admin;

INSERT INTO public.roles(role_name)	VALUES ("admin");
INSERT INTO public.roles(role_name)	VALUES ("veterinary");


-- Table: public.user_pictures

-- DROP TABLE IF EXISTS public.user_pictures;

CREATE TABLE IF NOT EXISTS public.user_pictures
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    image_url character(400) COLLATE pg_catalog."default" NOT NULL,
    user_id integer,
    CONSTRAINT user_pictures_pkey PRIMARY KEY (id),
    CONSTRAINT user_pictures_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_pictures
    OWNER to admin;

--INSERT INTO public.users(
--	email, user_name, phone_number, user_password, fullname, gender)
--	VALUES (
--		'existingAdmin@test.com', 
--		'existingAdmin', 
--		'8095445501', 
--		'78ca89fb969778e1044c06659fb077bdb4b77d1d6b0c0466e53233d73361a280                                    ', 
--		'User Admin For Tests', 
--		'M');


-- Table: public.articles

-- DROP TABLE IF EXISTS public.articles;

CREATE TABLE IF NOT EXISTS public.articles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title character(100) COLLATE pg_catalog."default",
    translated_title character(100) COLLATE pg_catalog."default",
    category character(50) COLLATE pg_catalog."default",
    internal_id integer NOT NULL DEFAULT nextval('articles_internal_id_seq'::regclass),
    created_by integer NOT NULL,
    deleted boolean,
    deleted_by integer,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    wp_id integer,
    wp_link character(100) COLLATE pg_catalog."default",
    sys_state character(15) COLLATE pg_catalog."default",
    job_id integer,
    site_id integer NOT NULL,
    CONSTRAINT articles_pkey PRIMARY KEY (id),
    CONSTRAINT articles_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT articles_deleted_by_fkey FOREIGN KEY (deleted_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT articles_keyword_search_job_fkey FOREIGN KEY (job_id)
        REFERENCES public.keyword_search_job (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT articles_sites_fkey FOREIGN KEY (site_id)
        REFERENCES public.sites (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.articles
    OWNER to admin;
-- Index: fki_articles_created_by_fkey

-- DROP INDEX IF EXISTS public.fki_articles_created_by_fkey;

CREATE INDEX IF NOT EXISTS fki_articles_created_by_fkey
    ON public.articles USING btree
    (created_by ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_articles_deleted_by_fkey

-- DROP INDEX IF EXISTS public.fki_articles_deleted_by_fkey;

CREATE INDEX IF NOT EXISTS fki_articles_deleted_by_fkey
    ON public.articles USING btree
    (deleted_by ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_articles_keyword_search_job_fkey

-- DROP INDEX IF EXISTS public.fki_articles_keyword_search_job_fkey;

CREATE INDEX IF NOT EXISTS fki_articles_keyword_search_job_fkey
    ON public.articles USING btree
    (job_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: set_timestamp_to_created_at

-- DROP TRIGGER IF EXISTS set_timestamp_to_created_at ON public.articles;

CREATE TRIGGER set_timestamp_to_created_at
    BEFORE INSERT
    ON public.articles
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Trigger: set_timestamp_to_deleted_at

-- DROP TRIGGER IF EXISTS set_timestamp_to_deleted_at ON public.articles;

CREATE TRIGGER set_timestamp_to_deleted_at
    BEFORE UPDATE OF deleted
    ON public.articles
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp_deleted_at();    


-- Table: public.subtitles

-- DROP TABLE IF EXISTS public.subtitles;

CREATE TABLE IF NOT EXISTS public.subtitles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    subtitles_name character(100) COLLATE pg_catalog."default",
    translated_name character(100) COLLATE pg_catalog."default",
    articles_id integer NOT NULL,
    order_number integer,
    deleted boolean,
    deleted_by integer,
    deleted_at timestamp with time zone,
    CONSTRAINT subtitles_pkey PRIMARY KEY (id),
    CONSTRAINT subtitles_articles_fkey FOREIGN KEY (articles_id)
        REFERENCES public.articles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT subtitles_deleted_by_fkey FOREIGN KEY (deleted_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.subtitles
    OWNER to admin;
-- Index: fki_subtitles_articles_fkey

-- DROP INDEX IF EXISTS public.fki_subtitles_articles_fkey;

CREATE INDEX IF NOT EXISTS fki_subtitles_articles_fkey
    ON public.subtitles USING btree
    (articles_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: set_timestamp_to_deleted_at_subtitles

-- DROP TRIGGER IF EXISTS set_timestamp_to_deleted_at_subtitles ON public.subtitles;

CREATE TRIGGER set_timestamp_to_deleted_at_subtitles
    BEFORE UPDATE OF deleted
    ON public.subtitles
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp_deleted_at();



-- Table: public.contents

-- DROP TABLE IF EXISTS public.contents;

CREATE TABLE IF NOT EXISTS public.contents
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    content character(2000) COLLATE pg_catalog."default",
    selected boolean,
    content_language character(2) COLLATE pg_catalog."default",
    subtitles_id integer,
    articles_id integer,
    deleted boolean,
    deleted_by integer,
    deleted_at timestamp with time zone,
    link character(200) COLLATE pg_catalog."default",
    order_number integer,
    words_count integer,
    CONSTRAINT contents_pkey PRIMARY KEY (id),
    CONSTRAINT contents_articles_fkey FOREIGN KEY (articles_id)
        REFERENCES public.articles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT contents_deleted_by_user_fkey FOREIGN KEY (deleted_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT contents_subtitles_fkey FOREIGN KEY (subtitles_id)
        REFERENCES public.subtitles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contents
    OWNER to admin;
-- Index: fki_contents_articles_fkey

-- DROP INDEX IF EXISTS public.fki_contents_articles_fkey;

CREATE INDEX IF NOT EXISTS fki_contents_articles_fkey
    ON public.contents USING btree
    (articles_id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_contents_deleted_by_user_fkey

-- DROP INDEX IF EXISTS public.fki_contents_deleted_by_user_fkey;

CREATE INDEX IF NOT EXISTS fki_contents_deleted_by_user_fkey
    ON public.contents USING btree
    (deleted_by ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_contents_subtitles_fkey

-- DROP INDEX IF EXISTS public.fki_contents_subtitles_fkey;

CREATE INDEX IF NOT EXISTS fki_contents_subtitles_fkey
    ON public.contents USING btree
    (subtitles_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: set_timestamp_to_deleted_at

-- DROP TRIGGER IF EXISTS set_timestamp_to_deleted_at ON public.contents;

CREATE TRIGGER set_timestamp_to_deleted_at
    BEFORE UPDATE OF deleted
    ON public.contents
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp_deleted_at();



-- Table: public.media

-- DROP TABLE IF EXISTS public.media;

CREATE TABLE IF NOT EXISTS public.media
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    source_url character(250) COLLATE pg_catalog."default" NOT NULL,
    wp_id integer NOT NULL,
    deleted boolean,
    deleted_by integer,
    deleted_at timestamp with time zone,
    article_id integer,
    subtitle_id integer,
    title character(100) COLLATE pg_catalog."default" NOT NULL,
    type character(13) COLLATE pg_catalog."default",
    order_number integer,
    CONSTRAINT media_pkey PRIMARY KEY (id),
    CONSTRAINT media_articles_fkey FOREIGN KEY (article_id)
        REFERENCES public.articles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT media_deleted_by_fkey FOREIGN KEY (deleted_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT media_subtitles_fkey FOREIGN KEY (subtitle_id)
        REFERENCES public.subtitles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.media
    OWNER to admin;

-- Trigger: set_timestamp_to_deleted_at

-- DROP TRIGGER IF EXISTS set_timestamp_to_deleted_at ON public.media;

CREATE TRIGGER set_timestamp_to_deleted_at
    BEFORE UPDATE OF deleted
    ON public.media
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp_deleted_at();



-- Table: public.keyword_search_job

-- DROP TABLE IF EXISTS public.keyword_search_job;

CREATE TABLE IF NOT EXISTS public.keyword_search_job
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    unique_name character(10) COLLATE pg_catalog."default",
    status character(7) COLLATE pg_catalog."default",
    created_by integer NOT NULL,
    deleted boolean,
    deleted_by integer,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    long_tail_keyword character(100) COLLATE pg_catalog."default",
    main_keywords character(50) COLLATE pg_catalog."default",
    CONSTRAINT keyword_search_job_pkey PRIMARY KEY (id),
    CONSTRAINT keyword_search_job_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.keyword_search_job
    OWNER to admin;
-- Index: fki_keyword_search_job_created_by_fkey

-- DROP INDEX IF EXISTS public.fki_keyword_search_job_created_by_fkey;

CREATE INDEX IF NOT EXISTS fki_keyword_search_job_created_by_fkey
    ON public.keyword_search_job USING btree
    (created_by ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: set_timestamp_to_created_at

-- DROP TRIGGER IF EXISTS set_timestamp_to_created_at ON public.keyword_search_job;

CREATE TRIGGER set_timestamp_to_created_at
    BEFORE INSERT
    ON public.keyword_search_job
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp();



-- Table: public.keywords

-- DROP TABLE IF EXISTS public.keywords;

CREATE TABLE IF NOT EXISTS public.keywords
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character(100) COLLATE pg_catalog."default",
    similarity integer,
    keyword_search_job_id integer,
    selected boolean,
    article_id integer,
    is_main boolean,
    created_manually boolean,
    order_number integer,
    category character(50) COLLATE pg_catalog."default",
    CONSTRAINT keywords_pkey PRIMARY KEY (id),
    CONSTRAINT keywords_article_fkey FOREIGN KEY (article_id)
        REFERENCES public.articles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT keywords_keyword_search_job_fkey FOREIGN KEY (keyword_search_job_id)
        REFERENCES public.keyword_search_job (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.keywords
    OWNER to admin;

-- Index: fki_keywords_keyword_search_job_fkey

-- DROP INDEX IF EXISTS public.fki_keywords_keyword_search_job_fkey;

CREATE INDEX IF NOT EXISTS fki_keywords_keyword_search_job_fkey
    ON public.keywords USING btree
    (keyword_search_job_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: fki_keywords_article_fkey

-- DROP INDEX IF EXISTS public.fki_keywords_article_fkey;

CREATE INDEX IF NOT EXISTS fki_keywords_article_fkey
    ON public.keywords USING btree
    (article_id ASC NULLS LAST)
    TABLESPACE pg_default;



-- Table: public.categories

-- DROP TABLE IF EXISTS public.categories;

CREATE TABLE IF NOT EXISTS public.categories
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character(50) COLLATE pg_catalog."default",
    wp_id integer,
    
    CONSTRAINT categories_pkey PRIMARY KEY (id),
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.categories
    OWNER to admin;


-- Table: public.sites

-- DROP TABLE IF EXISTS public.sites;

CREATE TABLE IF NOT EXISTS public.sites
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character(20) COLLATE pg_catalog."default",
    domain character(20) COLLATE pg_catalog."default",
    created_by integer,
    created_at timestamp with time zone,
    deleted boolean,
    deleted_by integer,
    deleted_at timestamp with time zone,
    selected boolean,
    CONSTRAINT sites_pkey PRIMARY KEY (id),
    CONSTRAINT sites_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT sites_deleted_by_fkey FOREIGN KEY (deleted_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sites
    OWNER to admin;

-- Trigger: set_timestamp_to_created_at

-- DROP TRIGGER IF EXISTS set_timestamp_to_created_at ON public.sites;

CREATE TRIGGER set_timestamp_to_created_at
    AFTER INSERT
    ON public.sites
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp();