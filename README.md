# CrazySushi

## Run With Docker Compose

From the project root, build and start both services:

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

To run in detached mode:

```bash
docker compose up --build -d
```

To stop everything:

```bash
docker compose down
```