#!/bin/bash
set -e

echo "Esperando PostgreSQL en ${DB_HOST}:${DB_PORT}..."

until node -e "
const knex = require('knex')(require('./knexfile').development);
knex.raw('SELECT 1')
  .then(() => { knex.destroy(); process.exit(0); })
  .catch(() => { knex.destroy(); process.exit(1); });
" > /dev/null 2>&1; do
  sleep 2
done

echo "PostgreSQL listo. Ejecutando migraciones y seeds..."
npm run setup

echo "Iniciando servidor Austral..."
exec npm start
