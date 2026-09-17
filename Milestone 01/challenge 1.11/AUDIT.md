# Pre-Refactor Audit

## Application Structure

- `app.js` owns application setup, route registration, request handling, business logic, in-memory storage, logging, and server startup.
- `handleAll` branches on a string argument for five unrelated operations, making each endpoint harder to locate and test.
- Routes call the monolithic handler instead of delegating to focused controllers.
- There are no `routes/`, `controllers/`, or `services/` layers.

## Naming

- `x` is an unexplained global counter for confession IDs.
- `d`, `r`, `t`, `i`, `cat`, `cats`, `arr`, `result`, `tmp`, `res2`, and `handler` do not clearly describe their values or roles.
- The callback parameter `x` in the category filter shadows the global counter name.

## Responsibilities and Logic

- Create-confession validation, ID generation, persistence, logging, and response formatting are mixed together.
- Listing confessions sorts the shared storage array in place, so a read operation mutates storage order.
- Category validation uses a duplicated category list instead of one shared source of truth.
- Delete authorization, ID parsing, lookup, mutation, logging, and response formatting are mixed in the request handler.
- The final `confessions.length > 500` check is outside request handling and has no effect on application behavior.

## Configuration and Security

- The server port is hardcoded as `3000` in both startup and its log message.
- The delete token is hardcoded as `supersecret123` in application logic.
- There is no `.env.example` documenting required configuration.
- The API path is repeated in every route declaration rather than being defined once.

## Documentation and Maintainability

- No comments explain why non-obvious choices such as newest-first ordering or the delete header are required.
- There is no change log documenting variable renames or function decomposition.
- There are no automated tests for the five endpoints or their error responses.