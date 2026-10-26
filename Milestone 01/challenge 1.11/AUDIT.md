# Pre-Refactor Audit

## Application Structure

- `app.js:1-5,97-116` combines Express setup, route registration, request handling, in-memory storage, logging, server startup, and a top-level storage-size check.
- `handleAll()` (`app.js:6-96`) branches on a string argument for five unrelated operations, making each endpoint harder to locate and test.
- Route callbacks (`app.js:97-109`) call the monolithic handler instead of delegating to focused controllers.
- The application has no `routes/`, `controllers/`, or `services/` layers.
- Confessions are stored only in a process-local array (`app.js:4`); data is lost when the process restarts and is not shared between instances.

## Naming

- `x` is an unexplained global counter for confession IDs (`app.js:5`).
- `d`, `r`, and `t` do not describe the request body, route parameters, or operation selector (`app.js:6-9`).
- `i`, `info`, `cat`, `cats`, `arr`, `result`, `tmp`, `res2`, and `handler` do not clearly describe their values or roles (`app.js:18-23,41-50,62-85`).
- The category-filter callback parameter `x` shadows the global counter name (`app.js:65`).

## Responsibilities and Logic

- Create-confession validation, ID generation, storage mutation, logging, and response formatting are mixed together (`app.js:9-39`).
- Listing confessions sorts the shared storage array in place, so a read operation mutates storage order (`app.js:40-47`).
- Category validation uses a duplicated category list rather than a shared source of truth (`app.js:16,63-64`).
- Delete authorization, ID parsing, lookup, mutation, logging, and response formatting are mixed in the request handler (`app.js:75-92`).
- IDs are parsed with `parseInt()` without validating the complete route value (`app.js:49,80`), so values with a numeric prefix may be treated as valid IDs.
- The final `confessions.length > 500` check is outside request handling and has no effect on application behavior (`app.js:114-116`).

## Configuration and Security

- The server port is hardcoded as `3000` in startup and its log message (`app.js:110-112`).
- The delete token is hardcoded as `supersecret123` in application logic (`app.js:76`).
- There is no `.env.example` documenting configuration.
- The API path is repeated in each route declaration rather than being mounted once (`app.js:97-109`).
- There is no explicit JSON error handler for malformed JSON or unexpected request-processing errors.

## Documentation and Maintainability

- No comments explain non-obvious choices such as newest-first ordering or the delete header.
- The README only lists endpoint paths and a one-line start command; it does not document configuration, project structure, or tests.
- There is no change log documenting variable renames or function decomposition.
- `package.json` has no test script, and there are no automated tests for the five endpoints or their error responses.
- No database integration is present in the starter, so database failures and persistence behavior cannot be tested without adding a new storage dependency.