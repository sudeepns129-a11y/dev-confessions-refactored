# Refactoring Changes

## 1. Pre-refactor summary

The original `app.js` combined server setup, all five API operations, validation, storage, and response handling in `handleAll()`. Variable names were ambiguous, configuration and the delete token were hardcoded, and there were no MVC layers, automated tests, or complete setup instructions. The starter stored confessions only in memory.

## 2. Variable renames

| Old name | New name | Reason |
|---|---|---|
| `x` (ID counter) | `nextConfessionId` | Describes the next identifier to allocate. |
| `x` (filter callback) | `confession` | Describes each record inspected by the category filter. |
| `d` | `confessionData` | Describes the submitted request data. |
| `r` | Removed; controllers access `req.params` directly | Avoids an unnecessary alias for route parameters. |
| `t` | Removed; each endpoint has a named controller | Removes the operation-selector string. |
| `i` | `parsedConfessionId` | Describes the numeric ID used for lookup or deletion. |
| `info` | `confession` | Describes the retrieved record. |
| `cat` | `category` | Describes the selected category. |
| `cats` | `categories` | Describes the allowed category collection. |
| `arr` | `sortedConfessions` | Describes the returned, sorted records. |
| `result` | `serviceResult` | Identifies the service's status and response body. |
| `tmp` | `confession` | Describes the record created and stored. |
| `res2` | `confession` | Describes the record removed and returned to the client. |
| `handler` | `confessionIndex` | Describes the array index returned by the lookup. |
| `fn` | `confession` | Describes each record inspected by a predicate. |

## 3. Function splits

The original `handleAll()` was decomposed into:

- `validateConfessionInput()` for create-request validation.
- `createConfession()` for assigning an ID and storing a record.
- `listConfessions()` for newest-first listing.
- `findConfession()` for ID lookup.
- `listConfessionsByCategory()` for category validation and filtering.
- `deleteConfession()` for removing a record.
- Named controller functions for translating each request into its existing HTTP response.

Server startup was also moved out of `app.js` into `server.js`, allowing tests to import the Express app without binding a fixed port.

## 4. MVC structure changes

- `routes/confessionRoutes.js` declares routes under the shared API prefix.
- `controllers/confessionController.js` handles request parameters, authorization, and HTTP responses.
- `services/confessionService.js` contains validation and in-memory confession operations.
- `config.js` loads environment configuration and exposes allowed categories.
- `app.js` configures Express middleware and mounts routes; `server.js` starts listening.
- `tests/confessions.test.js` exercises the API endpoints.

No database module was added because the starter has no database integration. The in-memory behavior is retained and documented rather than replaced with a different storage technology.

## 5. Environment variable changes

- `PORT` configures the listener and defaults to `3000`.
- `DELETE_TOKEN` configures the `x-delete-token` required for deletion. Deletion fails closed when it is unset.
- `dotenv` loads local `.env` configuration. `.env.example` contains placeholders, and `.gitignore` excludes local environment files.
- No API URL or database URL is configured because the application does not use an external API or database.

## 6. Inline comments added

- The list operation explains why it sorts a copy: reads should not mutate the stored array order.
- Delete authorization explains why the request is rejected when no token has been configured.

## 7. API compatibility and testing results

All five endpoint paths and the established success/error response shapes are retained. A malformed non-string `text` value is now rejected with `400` and `{ "msg": "need text" }` rather than being accidentally accepted by the refactored validation logic. Deletion with no configured token now returns `403`.

Verification performed:

- `npm ci` — completed.
- `npm test` — passed: 14 tests, 0 failures, covering the health check, malformed JSON, missing input, invalid text/category, create, list, lookup, category filtering, configured and missing-token authorization, deletion, and response formats.
- `npm audit fix` — updated a compatible transitive dependency; final audit reported 0 vulnerabilities.
- `npm start` — the application was smoke-tested with a non-default `PORT`; `GET /api/v1/confessions` returned HTTP 200 with the expected empty-list response.
- `GET /health` — returned HTTP 200 with `{ "status": "ok" }`; malformed JSON returned a safe HTTP 400 JSON error.

There are no database operations or database dependency in this project, so database failures cannot be simulated without introducing a new persistence layer.

## 8. Important design decisions

- Kept the original in-memory storage because the starter has no database to preserve.
- Made `app.js` importable independently from the process listener so endpoint tests can bind an ephemeral port.
- Kept the existing route prefix, category values, response formats, and deletion header.
- Failed closed when `DELETE_TOKEN` is missing instead of treating an absent header as valid authorization.
- Added `GET /health` for deployment health checks and a JSON error handler that returns a safe response for malformed request bodies and unexpected server errors.

## 9. Known limitations

- Confessions are lost when the process exits and are not shared between instances.
- No live deployment has been created or verified; therefore no live URL is claimed.
- Database error handling and persistence tests are not applicable until a database is introduced.
