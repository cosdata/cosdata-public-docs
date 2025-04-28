---
title: Vector Operations API
description: Endpoints for querying and retrieving vectors in the Cosdata vector database
---

> **Note:** To add vectors to the database, use the [Transactions API](./transactions.md). The endpoints below are for querying and retrieving vectors only.

## Query Vectors by DocumentId

Retrieves all vectors associated with a specific document ID in a collection.

**Endpoint:** `GET /vectordb/collections/{collection_id}/vectors?document_id={document_id}`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID of the collection containing the vectors. |

**Query Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| document_id    | string | Yes      | Document ID to query vectors for.  |

**Response:**

  ```json
  [
    {
      "id": "vector_id_1",
      "document_id": "doc123",
      "dense_values": [0.1, 0.2, 0.3, ...],
      "sparse_values": null,
      "text": "Optional text content"
    },
    {
      "id": "vector_id_2",
      "document_id": "doc123",
      "dense_values": [0.4, 0.5, 0.6, ...],
      "sparse_values": null,
      "text": "Optional text content"
    }
  ]
  ```

**Status Codes:**

| Code | Description                                                |
|------|------------------------------------------------------------|
| 200  | Success. Returns the vectors associated with the document ID. |
| 400  | Bad Request. Collection not found or other validation error. |
| 500  | Server Error. Internal database or server error.           |

---

## Get Vector by ID

Retrieves a specific vector by its ID.

**Endpoint:** `GET /vectordb/collections/{collection_id}/vectors/{vector_id}`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID of the collection containing the vector. |
| vector_id      | string | Yes      | ID of the vector to retrieve.      |

**Response:**

  ```json
  {
    "id": "vector_id_1",
    "document_id": "doc123",
    "dense_values": [0.1, 0.2, 0.3, ...],
    "sparse_values": null,
    "text": "Optional text content"
  }
  ```

**Status Codes:**

| Code | Description                                                |
|------|------------------------------------------------------------|
| 200  | Success. Returns the requested vector.                     |
| 400  | Bad Request. Collection not found or other validation error. |
| 404  | Not Found. Vector with the specified ID not found.         |
| 500  | Server Error. Internal database or server error.           |

---

## Check Vector Existence

Checks if a vector exists in a collection without retrieving its data.

**Endpoint:** `HEAD /vectordb/collections/{collection_id}/vectors/{vector_id}`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID of the collection to check.     |
| vector_id      | string | Yes      | ID of the vector to check.         |

**Response:**

No response body is returned for HEAD requests.

**Status Codes:**

| Code | Description                                                |
|------|------------------------------------------------------------|
| 200  | Success. The vector exists.                                |
| 404  | Not Found. The vector does not exist.                      |
| 500  | Server Error. Internal database or server error.           |