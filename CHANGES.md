# Refactoring Changes

## Variable Renames

| Original | Refactored | Location / Purpose |
|---|---|---|
| `x` | `nextId` | Service ID counter |
| `d` | `body` | Controller request body |
| `r` | `req.params` / named parameters | Controller route parameters |
| `t` | Removed | Independent controller functions replace operation strings |
| `tmp` | `confession` | Newly created confession |
| `arr` | `data` | Sorted confession collection |
| `stuff` | `confessions` | Category-filtered service collection |
| `info` | `confession` | Confession found by ID |
| `i` | `id` / `confessionIndex` | Parsed ID or storage index |
| `handler` | `confessionIndex` | Deletion array index |
| `res2` | `deletedConfession` | Confession removed from storage |
| `fn` | `confession => ...` | Named arrow callback expression |
| `cats` | `CATEGORIES` | Shared centralized category list |

## Functions Split from `handleAll()`

- `createConfession()` validates text and category, calls the service, and returns status `201`.
- `getAllConfessions()` retrieves sorted data and returns `{ data, count }`.
- `getConfession()` parses the route ID and returns the confession or a `404`.
- `getConfessionsByCategory()` validates the category and returns filtered data.
- `deleteConfession()` validates authorization and deletion ID, then calls the service.
- `parseId()` centralizes route ID parsing.
- `createConfession()` through deletion are matched directly by route definitions rather than operation discriminators.

## MVC Restructuring

- `routes/` maps API paths to controller functions.
- `controllers/` handles request/response behavior and input validation.
- `services/` owns the confession array, ID generation, filtering, sorting, and deletion.
- `middleware/` provides centralized 404 and error handling.
- `config/` loads environment variables and centralizes categories.

## Environment Configuration

`PORT` controls the listening port and defaults to `3000` only when unset. `DELETE_TOKEN` controls the `x-delete-token` delete authorization header. The token has no secret source-code fallback, and `.env.example` documents both settings without containing real credentials. `.env` remains ignored by Git.

## Important Improvements

- Category definitions now exist once in `config/categories.js`.
- Route handlers no longer know in-memory storage implementation details.
- The service returns data without mutating the stored array during all-confession reads.
- Authorization is centralized in the delete controller.
- The app exports its Express instance for integration tests and only listens when started directly.
- Automated Node tests cover create, list, get, category, validation, authorization, and deletion behavior.
