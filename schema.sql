--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0 (Debian 13.0-1.pgdg100+1)
-- Dumped by pg_dump version 13.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: db
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO db;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: db
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hn_kids; Type: TABLE; Schema: public; Owner: db
--

CREATE TABLE public.hn_kids (
    parent_id integer NOT NULL,
    id integer NOT NULL,
    posted_at timestamp with time zone NOT NULL,
    notified boolean DEFAULT false NOT NULL
);


ALTER TABLE public.hn_kids OWNER TO db;

--
-- Name: hn_submitted; Type: TABLE; Schema: public; Owner: db
--

CREATE TABLE public.hn_submitted (
    hn_user_id text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.hn_submitted OWNER TO db;

--
-- Name: hn_users; Type: TABLE; Schema: public; Owner: db
--

CREATE TABLE public.hn_users (
    id text NOT NULL
);


ALTER TABLE public.hn_users OWNER TO db;

--
-- Name: tg_subscriptions; Type: TABLE; Schema: public; Owner: db
--

CREATE TABLE public.tg_subscriptions (
    tg_user_chat_id integer NOT NULL,
    hn_user_id text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tg_subscriptions OWNER TO db;

--
-- Name: tg_users; Type: TABLE; Schema: public; Owner: db
--

CREATE TABLE public.tg_users (
    chat_id integer NOT NULL,
    session jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE public.tg_users OWNER TO db;

--
-- Name: hn_kids hn_kids_id_idx; Type: CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.hn_kids
    ADD CONSTRAINT hn_kids_id_idx UNIQUE (id);


--
-- Name: hn_submitted hn_submitted_pkey; Type: CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.hn_submitted
    ADD CONSTRAINT hn_submitted_pkey PRIMARY KEY (id);


--
-- Name: hn_users hn_users_pkey; Type: CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.hn_users
    ADD CONSTRAINT hn_users_pkey PRIMARY KEY (id);


--
-- Name: tg_subscriptions tg_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.tg_subscriptions
    ADD CONSTRAINT tg_subscriptions_pkey PRIMARY KEY (tg_user_chat_id, hn_user_id);


--
-- Name: tg_users tg_users_pkey; Type: CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.tg_users
    ADD CONSTRAINT tg_users_pkey PRIMARY KEY (chat_id);


--
-- Name: hn_kids hn_kids_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.hn_kids
    ADD CONSTRAINT hn_kids_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.hn_submitted(id);


--
-- Name: hn_submitted hn_submitted_hn_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.hn_submitted
    ADD CONSTRAINT hn_submitted_hn_user_id_fkey FOREIGN KEY (hn_user_id) REFERENCES public.hn_users(id);


--
-- Name: tg_subscriptions tg_subscriptions_hn_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.tg_subscriptions
    ADD CONSTRAINT tg_subscriptions_hn_user_id_fkey FOREIGN KEY (hn_user_id) REFERENCES public.hn_users(id);


--
-- Name: tg_subscriptions tg_subscriptions_tg_user_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db
--

ALTER TABLE ONLY public.tg_subscriptions
    ADD CONSTRAINT tg_subscriptions_tg_user_chat_id_fkey FOREIGN KEY (tg_user_chat_id) REFERENCES public.tg_users(chat_id);


--
-- PostgreSQL database dump complete
--

