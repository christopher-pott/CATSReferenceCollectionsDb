--CREATE USER test WITH PASSWORD 'test';
--GRANT ALL PRIVILEGES ON DATABASE cats to test;
--GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO test;
--GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO test


--sudo apt-get install postgresql-contrib
--CREATE EXTENSION "uuid-ossp";

DROP TABLE public.artworks CASCADE;
DROP TABLE public.media CASCADE;
DROP TABLE public.samples CASCADE;
DROP TABLE public.artwork_samples CASCADE;
DROP TABLE public.samples_media CASCADE;

CREATE TABLE public.artworks (
                artwork_id VARCHAR NOT NULL,
                artwork_record json NOT NULL,
                CONSTRAINT artworks_pk PRIMARY KEY (artwork_id)
);

CREATE TABLE public.media (
                media_id VARCHAR NOT NULL,
                media_record json NOT NULL,
                CONSTRAINT media_pk PRIMARY KEY (media_id)
);

CREATE TABLE public.samples (
                sample_id VARCHAR NOT NULL,
                sample_record json NOT NULL,
                CONSTRAINT samples_pk PRIMARY KEY (sample_id)
);

CREATE TABLE public.samples_media (
                media_id VARCHAR NOT NULL,
                sample_id VARCHAR NOT NULL,
                CONSTRAINT samples_media_pk PRIMARY KEY (media_id, sample_id)
);

CREATE TABLE public.artwork_samples (
                artwork_id VARCHAR NOT NULL,
                sample_id VARCHAR NOT NULL,
                CONSTRAINT artwork_samples_pk PRIMARY KEY (artwork_id, sample_id)
);

ALTER TABLE public.artwork_samples ADD CONSTRAINT artworks_artwork_samples_fk
FOREIGN KEY (artwork_id)
REFERENCES public.artworks (artwork_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.samples_media ADD CONSTRAINT media_samples_media_fk
FOREIGN KEY (media_id)
REFERENCES public.media (media_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.artwork_samples ADD CONSTRAINT samples_artwork_samples_fk
FOREIGN KEY (sample_id)
REFERENCES public.samples (sample_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.samples_media ADD CONSTRAINT samples_samples_media_fk
FOREIGN KEY (sample_id)
REFERENCES public.samples (sample_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;
