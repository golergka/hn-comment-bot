#!/usr/bin/env bash
pg_dump --schema-only --host=127.0.0.1 --port=5432 --dbname=hn-comment-bot --username=postgres --schema=public | sed -e "s/postgres/db/" > schema.sql