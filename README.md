# CrazySushi

## Run With Docker Compose

Copy the example env file and edit the backend URL used by the frontend:

```bash
cp .env.example .env
```

In `.env`, set:

```bash
REACT_APP_API_URL=http://YOUR_PUBLIC_IP:3001
```

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

## Public Backend IP Checklist

1. Run the backend on a host reachable from the internet.
2. Open TCP port `3001` in cloud security groups/firewall.
3. If hosted at home, configure router port-forward `3001 -> backend machine:3001`.
4. Set `REACT_APP_API_URL` in `.env` to the public backend URL.
5. Rebuild frontend container so the value is embedded:

```bash
docker compose up --build -d
```

Note: because this is a browser app, `localhost` always means the end user's own machine. Use public IP or domain for remote access.