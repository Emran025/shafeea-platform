# Laravel Docker Environment for Render

This directory contains the necessary files to build and run the Laravel application in a Docker container, optimized for deployment on Render.com.

## Local Testing Instructions

The `docker-compose.yml` file is provided to facilitate local testing and development, closely mimicking the production environment.

### Prerequisites

-   [Docker](https://docs.docker.com/get-docker/) installed on your local machine.
-   An `.env` file in the root of the project. You can copy the existing `.env.example`:
    ```bash
    cp .env.example .env
    ```

### 1. Build and Start the Containers

To build the Docker image and start the application and database containers, run the following command from the root of your project:

```bash
docker-compose up -d --build
```

-   `up`: Creates and starts the containers.
-   `-d`: Runs the containers in detached mode (in the background).
-   `--build`: Forces a rebuild of the image, which is necessary when you make changes to the `Dockerfile` or related configuration files.

### 2. Accessing the Application

Once the containers are running, the application will be accessible in your web browser at:

-   **URL**: [http://localhost:8080](http://localhost:8080)

### 3. Running Artisan Commands

You can execute `php artisan` commands inside the application container. For example, to check the migration status:

```bash
docker-compose exec app php artisan migrate:status
```

To open a shell inside the container:

```bash
docker-compose exec app /bin/sh
```

### 4. Stopping the Containers

To stop the running containers, use the following command:

```bash
docker-compose down
```

This will stop and remove the containers. If you want to also remove the database volume (deleting all database data), you can use:

```bash
docker-compose down -v
```
