--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, name, created_at, updated_at, is_active) FROM stdin;
18610867-16d7-4243-8d47-c60aa751190a	user@example.com	$2b$10$AqsoLT7ASeCiZkvGxU9Fj.mEZ0j/6EmqRwN4Etw6VKTfGtrVGDFxy	John Doe	2026-01-17 17:10:51.359759+01	\N	t
15e0bb63-a5ef-473e-b37a-fd6094351647	gidsoala@gmail.com	$2b$10$kKvJ7L8xvf.yDf4EOPJX7eAu8Rl0fUprXcxxyvA.MB5S0QojxbVje	Gideon Soala	2026-01-17 21:27:53.328568+01	\N	t
35a104ab-3348-4e9f-8275-1ee7c92ecebc	treasureeze@gmail.com	$2b$10$Ki1uAZnWv3b7n5qw8dSopeXGsJ6wI.xmMyVPZv7sfRd7659po5rgy	Treasure Eze	2026-01-21 14:00:58.386266+01	\N	t
abea0e0b-cd3e-46e6-a4c7-14ab95603a8e	blessed@gmail.com	$2b$10$7/KoS4rVM3JKVfw3wDZYsuBAh.jFGd8NRMMpSnlqWQEiUbGMnvEJy	Blessed Udom	2026-01-22 16:10:32.646277+01	\N	t
\.


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- PostgreSQL database dump complete
--

