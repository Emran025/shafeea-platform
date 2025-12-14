<div align="center">
  <img src="docs/logo.png" alt="Shafeea Platform Logo" width="240" height="auto" />
  
  <h1>Shafeea Platform</h1>
  
  <p>
    <strong>Enterprise Digital Ecosystem for Quranic Education Management</strong>
  </p>

  <p>
    <a href="https://github.com/Emran025/shafeea-platform/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/Emran025/shafeea-platform/laravel.yml?branch=main&style=flat-square&logo=githubactions&logoColor=white&label=Build" alt="Build Status" />
    </a>
    <a href="https://laravel.com">
      <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel&logoColor=white" alt="Laravel" />
    </a>
    <a href="https://php.net">
      <img src="https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP" />
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/github/license/Emran025/shafeea-platform?style=flat-square&color=005eb8" alt="License" />
    </a>
  </p>

  <p>
    <a href="#overview">Overview</a> &nbsp;|&nbsp;
    <a href="#technical-architecture">Architecture</a> &nbsp;|&nbsp;
    <a href="https://github.com/Emran025/shafeea-platform/issues">Report Bug</a> &nbsp;|&nbsp;
    <a href="https://github.com/Emran025/shafeea-platform/discussions">Discussions</a>
  </p>
</div>

---

## Overview

**Shafeea** is an advanced Learning Management System (LMS) specifically engineered for Quranic education circles (Halqas). The platform addresses the administrative challenges of traditional education by providing a centralized, scalable digital infrastructure.

By integrating distinct portals for **Supervisors**, **Teachers**, and **Students**, Shafeea facilitates real-time academic tracking, seamless communication, and data-driven decision-making within a secure environment.

## Key Features

### Management & Administration

- **Role-Based Access Control (RBAC):** comprehensive permission systems ensuring data integrity across Student, Teacher, Supervisor, and Administrator roles.
- **Halqa Lifecycle Management:** Full administrative control over the creation, scheduling, modification, and archiving of educational circles.
- **Enrollment History:** Persistent logging of student placements, transfers, and academic history.

### Academic Tracking & Analytics

- **Performance Metrics:** Detailed daily and monthly tracking of memorization, revision, and recitation quality.
- **Reporting Engine:** Generation of aggregated reports regarding attendance trends, circle efficiency, and individual student progress.
- **Digital Integration:** Seamless interface designed to support digital Quranic text interaction.

### System Workflow

- **Notification Service:** Automated alerts for assignments, administrative approvals, and system-wide announcements.
- **Approval Pipelines:** Structured workflows for user registration and critical data modification requests.

## Technical Architecture

The platform is constructed upon a modern, monolithic architecture designed for reliability and maintainability.

| Component             | Specification                                     | Purpose                                                     |
| :-------------------- | :------------------------------------------------ | :---------------------------------------------------------- |
| **Backend Framework** | Laravel 12                                        | Provides robust API routing, ORM, and queue management.     |
| **Language**          | PHP 8.2+                                          | Utilizes strict typing and latest engine optimizations.     |
| **Frontend**          | React 19 + TypeScript + Tailwind CSS + Inertia.js | Modern component-based SPA integrated with Laravel backend. |
| **Database**          | MySQL / PostgreSQL                                | Manages relational data with high integrity constraints.    |
| **Testing Suite**     | Pest                                              | Delivers expressive syntax for unit and feature testing.    |
| **Web Server**        | Nginx / Apache                                    | Handles HTTP requests and load balancing.                   |

## Getting Started

### Prerequisites

Ensure the following are installed in the local development environment:

- **PHP** version 8.2 or higher
- **Composer**
- **Node.js** & **NPM**

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/Emran025/shafeea-platform.git
    cd shafeea-platform
    ```

2.  **Install Dependencies**

    ```bash
    composer install
    npm install
    ```

3.  **Environment Configuration**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    **Note:** Update the `.env` file with the appropriate local database credentials.

4.  **Database Migration & Seeding**
    To set up the schema and populate initial data:

    ```bash
    php artisan migrate --seed
    ```

    To reset the database entirely:

    ```bash
    php artisan migrate:fresh --seed
    ```

5.  **Application Launch**
    ```bash
    npm build run
    php artisan serve
    ```
    _Or_
    ```bash
    npm run deploy
    ```
    _Or_
    ```bash
    npm run ds
    ```
    The application will be accessible at `http://localhost:8000`.

## Contributing

Contributions are essential to the open-source community. To contribute to the Shafeea Platform:

1.  Review the **Contributing Guidelines** in `CONTRIBUTING.md`.
2.  Fork the repository.
3.  Create a feature branch (`git checkout -b feature/NewFeature`).
4.  Commit changes (`git commit -m 'Add NewFeature'`).
5.  Push to the branch (`git push origin feature/NewFeature`).
6.  Open a **Pull Request**.

## License

This project is licensed under the **MIT License**. Please refer to the `LICENSE` file for full terms and conditions.

## Contact

**Emran Nasser** - Lead Developer  
Email: [amrannaser3@gmail.com](mailto:amrannaser3@gmail.com)

Project Repository: [https://github.com/Emran025/shafeea-platform](https://github.com/Emran025/shafeea-platform)

<br />
<div align="center">
  <sub>&copy; 2025 Shafeea Platform. All Rights Reserved.</sub>
</div>
