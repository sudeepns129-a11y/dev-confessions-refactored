# Refactoring Changes

## Variable Renames

| Old Name | New Name | Why |
|---|---|---|
| `x` | `nextConfessionId` | Describes the counter used to generate confession IDs. |
| `d` | `confessionData` | Explains that the value contains the submitted confession. |
| `r` | `req.params` | Makes the source of route parameters explicit. |
| `t` | route-specific controller | Removes the string switch and gives each operation its own name. |
| `i` | parsed confession ID | Describes the numeric identifier used for lookup. |
| `cat` | `category` | Explains that the value identifies a confession category. |
| `cats` | `categories` | Describes the allowed category collection. |
| `arr` | `sortedConfessions` | Describes the sorted confession results. |
| `result` | list response | Removes a vague temporary name from the controller boundary. |
| `tmp` | `confession` | Describes the record being created and stored. |
| `res2` | deleted confession | Describes the removed record returned to the client. |
| `handler` | `confessionIndex` | Explains that the value is an array index, not a request handler. |

## Function Splits

### `handleAll()` split into:

- `validateConfessionInput()` - validates required fields before persistence.
- `createConfession()` - creates and stores one confession.
- `listConfessions()` - returns all confessions in newest-first order.
- `findConfession()` - finds one confession by ID.
- `listConfessionsByCategory()` - validates a category and filters results.
- `deleteConfession()` - removes one confession by ID.
- Controller functions - translate service results into the original HTTP responses.

Why: the original function handled validation, persistence, querying, authorization, logging, and response formatting in one branch-heavy block. Separating those responsibilities makes the behavior easier to locate and test while preserving the existing endpoints.

## Configuration and Structure

- Moved route registration into `routes/confessionRoutes.js`.
- Moved HTTP request and response handling into `controllers/confessionController.js`.
- Moved confession business logic and in-memory storage into `services/confessionService.js`.
- Moved the delete token and port configuration to environment variables, with defaults that preserve local behavior.
- Added comments only where they explain a non-obvious decision, such as newest-first ordering.