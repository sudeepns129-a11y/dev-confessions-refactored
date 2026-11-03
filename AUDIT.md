# Dev Confessions Codebase Audit

## Original Problems

- The application logic was concentrated in one monolithic `handleAll()` function that mixed request parsing, validation, authorization, in-memory storage, and HTTP responses.
- `express` routes were tightly coupled to `handleAll()` and passed operation strings such as `create`, `getAll`, and `del`.
- Category names were duplicated in both the create and category routes.
- Port `3000` and the delete-token configuration were hardcoded in source code.
- The storage array, monotonically increasing ID counter, and response logic had no separation between data operations and HTTP concerns.
- Validation messages were inconsistent, and several branches and variables made control flow difficult to follow.
- The original route for category filtering could silently do nothing if its parameter was absent.
- The project had no centralized error middleware, environment setup example, or automated tests.

## Poor Variable Names

| Original | Problem |
|---|---|
| `x` | In `handleAll()` it was an ID counter, but its purpose was not clear. |
| `d` | Represented the request body. |
| `r` | Represented request route parameters. |
| `t` | Was an operation discriminator rather than a descriptive route action. |
| `tmp` | Was a confession object. |
| `arr`, `stuff`, `info` | Were collections or records with unclear domain meaning. |
| `i` | Mixed parse ID and array index semantics. |
| `handler` | Held an array index with no clear relationship to the deletion operation. |
| `res2` | Held a deletion result rather than a named deleted confession. |
| `fn` | Was an anonymous predicate with an unclear purpose. |
| `cats`, `categories` | Represented a duplicated domain list. |

## Monolith and MVC Issues

`handleAll()` used nested conditionals to implement five independent operations. Adding validation or a new endpoint required editing the same function, and testing one operation required starting the whole application. The refactor replaces it with Express routes, controller functions, and a service responsible for in-memory data operations.

The MVC-style structure now keeps HTTP concerns in controllers/routes, business and data operations in services, environment configuration in config, and cross-cutting HTTP behavior in middleware. Storage remains in memory as required.
