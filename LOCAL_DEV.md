# Local Development Guide

This project deploys via GitHub Actions (native PHP + Node on the CI runner).
Docker is **not** required for day-to-day development.

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| PHP | 8.2+ | with extensions: `pdo_pgsql`, `bcmath`, `gd`, `intl`, `zip`, `opcache` |
| Composer | 2.x | [getcomposer.org](https://getcomposer.org) |
| Node.js | 22 LTS | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 15+ | Local instance or a cloud DB |

### Recommended local setups

- **Windows / macOS**: [Laravel Herd](https://herd.laravel.com/) — ships with PHP, Composer, and a zero-config Nginx server.
- **macOS**: [Laravel Valet](https://laravel.com/docs/valet)
- **Linux**: System PHP + Nginx/Apache or `php artisan serve`
- **Any OS**: [DBngin](https://dbngin.com/) or [Postgres.app](https://postgresapp.com/) for a local PostgreSQL instance.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd web_platform
```

### 2. Install dependencies

```bash
composer install
npm ci
```

### 3. Configure the environment

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and set your local database credentials:

```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=shafeea
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### 4. Run migrations and seed

```bash
php artisan migrate
php artisan db:seed
```

### 5. Start the development server

```bash
# In one terminal — PHP dev server
php artisan serve

# In a second terminal — Vite HMR (hot module replacement)
npm run dev
```

The app will be available at **<http://localhost:8000>**.

---

## Useful artisan commands

```bash
php artisan migrate:fresh --seed   # Drop all tables and re-seed
php artisan route:list             # List all registered routes
php artisan tinker                 # Interactive REPL
php artisan storage:link           # Create public/storage symlink
```

---

## Deployment

Deployments are fully automated via GitHub Actions.
Push to the `main` branch to trigger a production deploy.

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for the full pipeline.

### Required GitHub Secrets

| Secret | Description |
| --- | --- |
| `SERVER_SSH_KEY` | Private SSH key (ed25519) that has access to the server |
| `SERVER_HOST` | Hostname or IP of the production server |
| `SERVER_USERNAME` | SSH username on the production server |
| `PROJECT_DOMAIN` | Domain name used as the deploy path (e.g. `example.com`) |
