# Dev Confessions

Dev Confessions is an Express API for anonymously sharing developer bugs, deadline stress, imposter syndrome, and vibe-code moments. Confessions are stored in memory and reset whenever the application process restarts.

## Installation

```bash
npm install
```

## Environment Setup

Copy the example configuration:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env` securely:

```dotenv
PORT=3000
DELETE_TOKEN=replace-with-a-secure-random-token
```

Do not commit `.env`. `.env.example` contains placeholders only.

## Run

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The API is available at `http://localhost:3000/api/v1`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/confessions` | Create a confession |
| GET | `/api/v1/confessions` | List confessions newest-first |
| GET | `/api/v1/confessions/:id` | Get one confession |
| GET | `/api/v1/confessions/category/:cat` | Filter by category |
| DELETE | `/api/v1/confessions/:id` | Delete with the configured token |

Supported categories: `bug`, `deadline`, `imposter`, `vibe-code`.

### Create Example

```bash
curl -X POST http://localhost:3000/api/v1/confessions \
  -H "Content-Type: application/json" \
  -d '{"text":"I pushed to main on Friday.","category":"bug"}'
```

### List Example

```bash
curl http://localhost:3000/api/v1/confessions
```

### Get Example

```bash
curl http://localhost:3000/api/v1/confessions/1
```

### Category Example

```bash
curl http://localhost:3000/api/v1/confessions/category/bug
```

### Delete Example

```bash
curl -X DELETE http://localhost:3000/api/v1/confessions/1 \
  -H "x-delete-token: replace-with-a-secure-random-token"
```

## Validation

- `text` is required and must be between 1 and 499 characters.
- `category` must be one of the supported categories.
- Deletion requires `x-delete-token` to equal `DELETE_TOKEN`.

## Testing

Run the automated integration tests:

```bash
npm test
```

The tests start the app on an ephemeral local port and cover valid and invalid creation, listing, retrieval, category filtering, delete-token authorization, deletion, and missing resources.

## Deployment

No deployment is configured yet. Deployment URL: not yet deployed.

## Refactoring Documentation

- [AUDIT.md](./AUDIT.md)
- [CHANGES.md](./CHANGES.md)
