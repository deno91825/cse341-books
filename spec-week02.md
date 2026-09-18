# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add an authors collection and provide full CRUD operations for authors. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Books reference authors using the book's `authorId` field.

An author cannot be deleted while one or more books still reference that author.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "Maya Rivera",
      "birthYear": 1985
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "Maya Rivera",
      "birthYear": 1986
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `400` if books still reference the author
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route, including request bodies, parameters, success responses, and error responses.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.


# Books API Week 02 Specification — Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 Book API so that:

* Book documents include a reference to an author.
* The API supports full CRUD operations for books.
* Every book route is documented and testable in Swagger.
* Book-to-author references are validated.
* The API works locally and from the deployed Render application.

---

## Data Model

Book documents will be stored in the `books` collection.

Each book must contain these fields:

| Field             | Type   | Required | Rules                                                                                      |
| ----------------- | ------ | -------- | ------------------------------------------------------------------------------------------ |
| `id`              | string | Yes      | Unique custom ID, normally using the format `b` followed by one or more characters/numbers |
| `authorId`        | string | Yes      | Must match the `id` of an existing author                                                  |
| `title`           | string | Yes      | Must not be empty or whitespace only                                                       |
| `publicationDate` | string | Yes      | Must use `YYYY-MM-DD` format                                                               |

Books will continue to use custom string IDs rather than MongoDB `_id` values for route parameters.

MongoDB's `_id` may still exist internally, but API routes must use the custom `id` field.

### Writable Fields

The API will only accept the fields defined for a book:

* `id`
* `authorId`
* `title`
* `publicationDate`

Unknown fields should be rejected rather than stored.

---

## Relationship to Authors

Each book identifies its author through `authorId`.

The `authorId` value must match the custom `id` value of an existing author document.

When creating or updating a book:

* If `authorId` is missing, return `400`.
* If `authorId` does not match an existing author, return `400`.

Deleting an author is not allowed while books reference that author.

Book responses should contain the `authorId` value only. They do not need to embed the complete author object.

---

# Book Routes

## GET /books

### Purpose

Return all books.

### Success

* Status: `200`
* Response body: an array of book objects.

Example:

```json
[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Example Book",
    "publicationDate": "2026-01-15"
  }
]
```

### Errors

* `500` if an unexpected server or database error occurs.

---

## GET /books/:id

### Purpose

Return one book using its custom `id`.

### Success

* Status: `200`
* Response body: the matching book object.

### Errors

* `404` if no book exists with the specified ID.
* `500` if an unexpected server or database error occurs.

The API should not expose MongoDB error details to the client.

---

## POST /books

### Purpose

Create a new book.

### Request Body

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

### Validation

All four fields are required.

The API must reject the request with `400` if:

* A required field is missing.
* A required string field is empty or contains only whitespace.
* A field has the wrong data type.
* `publicationDate` does not use `YYYY-MM-DD` format.
* The `id` already exists.
* The `authorId` does not match an existing author.
* An unknown field is included.

The `id` supplied in the request becomes the book's custom ID.

### Success

* Status: `201`
* Response body: the newly created book object.

### Errors

* `400` for validation errors, duplicate IDs, or an invalid `authorId`.
* `500` for unexpected server or database errors.

---

## PUT /books/:id

### Purpose

Replace the specified book's editable data.

The `id` is determined by the URL and cannot be changed through the request body.

### Request Body

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

All three fields are required.

The request body must not contain `id`.

### Validation

The API must reject the request with `400` if:

* A required field is missing.
* A required string field is empty or contains only whitespace.
* A field has the wrong data type.
* `publicationDate` does not use `YYYY-MM-DD` format.
* `authorId` does not match an existing author.
* An unknown field is included.
* `id` is included in the request body.

### Success

* Status: `200`
* Response body: the updated book object.

### Errors

* `400` for validation errors or an invalid `authorId`.
* `404` if no book exists with the specified ID.
* `500` for unexpected server or database errors.

---

## DELETE /books/:id

### Purpose

Delete an existing book using its custom ID.

### Success

* Status: `204`
* Response body: none.

### Errors

* `404` if no book exists with the specified ID.
* `500` if an unexpected server or database error occurs.

A successful `204` response must not contain a response body.

---

# Feature 2: Author CRUD Operations

## Goal

Add an `authors` collection and provide full CRUD operations for authors.

Every author route must be documented and testable in Swagger.

---

## Author Data Model

Author documents will be stored in the `authors` collection.

Each author must contain:

| Field       | Type   | Required | Rules                                                                                      |
| ----------- | ------ | -------- | ------------------------------------------------------------------------------------------ |
| `id`        | string | Yes      | Unique custom ID, normally using the format `a` followed by one or more characters/numbers |
| `name`      | string | Yes      | Must not be empty or whitespace only                                                       |
| `birthYear` | number | Yes      | Must be a valid four-digit year                                                            |

Authors will use custom string IDs rather than MongoDB `_id` values for route parameters.

### Writable Fields

The API will only accept:

* `id`
* `name`
* `birthYear`

Unknown fields should be rejected rather than stored.

---

## Relationship to Books

Books reference authors through `authorId`.

An author cannot be deleted while one or more books reference that author.

The API must check for existing book references before deleting an author.

---

# Author Routes

## GET /authors

### Purpose

Return all authors.

### Success

* Status: `200`
* Response body: an array of author objects.

### Errors

* `500` if an unexpected server or database error occurs.

---

## GET /authors/:id

### Purpose

Return one author using their custom ID.

### Success

* Status: `200`
* Response body: the matching author object.

Example:

```json
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1985
}
```

The response does not need to include the author's books.

### Errors

* `404` if no author exists with the specified ID.
* `500` if an unexpected server or database error occurs.

---

## POST /authors

### Purpose

Create a new author.

### Request Body

```json
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1985
}
```

### Validation

All three fields are required.

The API must reject the request with `400` if:

* A required field is missing.
* `name` is empty or contains only whitespace.
* A field has the wrong data type.
* `birthYear` is not a valid four-digit year.
* The `id` already exists.
* An unknown field is included.

### Success

* Status: `201`
* Response body: the newly created author object.

### Errors

* `400` for validation errors or duplicate IDs.
* `500` for unexpected server or database errors.

---

## PUT /authors/:id

### Purpose

Replace the specified author's editable data.

The author's `id` is determined by the URL and cannot be changed through the request body.

### Request Body

```json
{
  "name": "Maya Rivera",
  "birthYear": 1986
}
```

Both fields are required.

The request body must not contain `id`.

### Validation

The API must reject the request with `400` if:

* A required field is missing.
* `name` is empty or contains only whitespace.
* A field has the wrong data type.
* `birthYear` is not a valid four-digit year.
* An unknown field is included.
* `id` is included in the request body.

### Success

* Status: `200`
* Response body: the updated author object.

### Errors

* `400` for validation errors.
* `404` if no author exists with the specified ID.
* `500` for unexpected server or database errors.

---

## DELETE /authors/:id

### Purpose

Delete an existing author.

### Relationship Rule

An author must not be deleted if one or more books reference the author's ID through `authorId`.

### Success

* Status: `204`
* Response body: none.

### Errors

* `400` if one or more books still reference the author.
* `404` if no author exists with the specified ID.
* `500` if an unexpected server or database error occurs.

A successful `204` response must not contain a response body.

---

# Error Response Format

All client-error responses (`400` and `404`) should use a consistent JSON format.

Example:

```json
{
  "error": "Author not found"
}
```

Validation errors should provide a useful message describing the problem.

Examples:

```json
{
  "error": "authorId does not match an existing author"
}
```

```json
{
  "error": "Required field 'title' is missing"
}
```

Unexpected `500` errors should return a safe generic message and should not expose MongoDB, stack-trace, or other internal implementation details.

Example:

```json
{
  "error": "Internal server error"
}
```

---

# ID Rules

Custom IDs are strings and must be unique within their collection.

Book IDs and author IDs are independent.

For example:

* `b1` identifies a book.
* `a1` identifies an author.

The API must enforce uniqueness for the custom `id` field. MongoDB should have a unique index on the custom `id` field for each collection.

The API routes must use the custom `id`, not MongoDB's `_id`.

---

# General Validation Rules

For all endpoints that accept JSON:

* The request body must contain valid JSON.
* Only documented fields may be supplied.
* Fields must have the documented data types.
* Required fields cannot be missing.
* Required string fields cannot be empty or whitespace only.
* The API should not store arbitrary fields supplied by the client.

---

# Swagger Documentation

Swagger must document every book and author route.

For each route, Swagger must include:

* HTTP method
* Route/path
* Path parameters where applicable
* Request body where applicable
* Request body schema
* Required fields
* Success response
* Error responses
* Response schemas/examples where useful

The Swagger UI must allow users to test every route directly.

The deployed Swagger page must be available at:

```text
/api-docs
```

---

# Deployment Expectations

After implementation:

1. All book routes must work locally.
2. All author routes must work locally.
3. All book routes must work from the deployed Render application.
4. All author routes must work from the deployed Render application.
5. The deployed Swagger page at `/api-docs` must load successfully.
6. Swagger must allow testing of every book and author route.
7. The deployed API must return the documented status codes and response formats.

---

# Scope

This week's implementation is limited to:

* Book CRUD operations.
* Author CRUD operations.
* Book-to-author references.
* Validation of author references.
* Prevention of deleting authors that are still referenced by books.
* Swagger documentation and testing.
* Local and Render deployment.

Authentication, pagination, filtering, sorting, and other features are outside the scope of this specification unless separately required by the assignment.
