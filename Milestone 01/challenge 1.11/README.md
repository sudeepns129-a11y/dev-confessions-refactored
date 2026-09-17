# Dev Confessions

An anonymous confession app for developers to share their bugs, deadline stress, imposter syndrome, and vibe-coding sessions.

## Endpoints

- GET /api/v1/confessions
- POST /api/v1/confessions
- GET /api/v1/confessions/:id
- GET /api/v1/confessions/category/:cat
- DELETE /api/v1/confessions/:id

## Run with:
cp .env.example .env
npm install && npm start

Configuration is loaded from `.env`:

- `PORT` controls the server port.
- `DELETE_TOKEN` is required by the delete endpoint's `x-delete-token` header.

## Structure

- `routes/` registers HTTP endpoints and delegates to controllers.
- `controllers/` translates HTTP requests and responses.
- `services/` contains validation, storage, and confession business logic.

See [AUDIT.md](AUDIT.md) for the pre-refactor findings and [CHANGES.md](CHANGES.md) for the refactor decisions.
