# Dev Confessions

Dev Confessions is a small Express API for sharing anonymous developer confessions about bugs, deadlines, imposter syndrome, and vibe coding.

## Requirements

- Node.js 18 or later
- npm

## Install and configure

```powershell
npm ci
Copy-Item .env.example .env
```

Set the values in `.env` before starting the server:

```env
PORT=3000
DELETE_TOKEN=replace-with-a-secure-delete-token
```

`PORT` is optional and defaults to `3000`. Configure `DELETE_TOKEN` to enable deletion; requests are denied if it is unset. `.env` files are ignored by Git; only `.env.example` belongs in source control.

## Start the application

```powershell
npm start
```

For development with automatic restarts:

```powershell
npm run dev
```

The application listens on the configured port. `GET /api/v1/confessions` can be used as a smoke check.

## API endpoints

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/api/v1/confessions` | Returns `{ "data": [...], "count": n }`. |
| `POST` | `/api/v1/confessions` | Creates a confession. JSON body: `{ "text": "…", "category": "bug" }`. |
| `GET` | `/api/v1/confessions/:id` | Returns one confession or `404`. |
| `GET` | `/api/v1/confessions/category/:cat` | Returns confessions in `bug`, `deadline`, `imposter`, or `vibe-code`; invalid categories return `400`. |
| `DELETE` | `/api/v1/confessions/:id` | Deletes a confession when the `x-delete-token` header matches `DELETE_TOKEN`. |

Confession text must be a string shorter than 500 characters. The API retains its existing success and validation response formats.

## Tests

```powershell
npm test
```

The Node.js built-in test runner exercises creation, listing, lookup, category filtering, input errors, deletion authorization, deletion, and response formats. There is no database in the starter application, so database failure behavior cannot be exercised.

## MVC structure

```text
app.js                              Express middleware and route mounting
server.js                           Server startup
routes/confessionRoutes.js          API route declarations
controllers/confessionController.js HTTP request/response handling
services/confessionService.js       Validation and confession operations
config.js                           Environment-backed configuration
tests/confessions.test.js           Endpoint tests
```

The service uses the starter's in-memory array. Confessions are lost on restart and are not shared between application instances; a persistent database has not been added.

## Refactoring and deployment

See [AUDIT.md](./AUDIT.md) for the pre-refactor findings and [CHANGES.md](./CHANGES.md) for the actual variable renames, function decomposition, compatibility notes, and verification results.

No live deployment URL is available: the application has not been deployed. To deploy on Render, create a Web Service from this repository and branch, set the root directory to `Milestone 01/challenge 1.11`, the build command to `npm ci`, and the start command to `npm start`. Set `DELETE_TOKEN` in Render's environment settings; Render supplies `PORT`. After deployment, verify `GET /api/v1/confessions` before publishing the URL. The current in-memory store is not suitable for durable multi-instance operation.
