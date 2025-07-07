---
title: Vector Operations API
description: Endpoints for querying and retrieving vectors in the Cosdata vector database
---
---


> **Note:** To add vectors to the database, use the [Transactions API](./transactions.md). The endpoints below are for querying and retrieving vectors only.

---


## Query Vectors by DocumentId

Retrieves all vectors associated with a specific document ID in a collection. This is especially useful when you want to fetch all the vectorized chunks of a document (such as a PDF split into pages or sections) for downstream processing, analysis, or display.

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


### Use Case: Fetching All Vectors for a Document (Chunked PDF Example)

When working with documents such as PDFs, it's common to split ("chunk") the document into smaller sections such as pages, paragraphs, or sentences. Each chunk is then processed through an embedding model to generate a vector representation, and these vectors are indexed in the Cosdata vector database. All vectors generated from the same document are associated with a shared `document_id`.

**Why is this useful?**

- **Semantic Search:** Enables searching or analyzing specific parts of a document at a fine-grained level.
- **Reconstruction:** Allows you to retrieve all vectorized chunks for a document, which can be used to reconstruct or display the original content in context.
- **Debugging & Auditing:** Useful for inspecting how a document was split and embedded, or for troubleshooting embedding/modeling issues.

**Example Scenario:**

Suppose you have a PDF with 3 pages. Each page is chunked and embedded, resulting in multiple vectors (one per chunk). All these vectors are stored with the same `document_id` (e.g., `doc123`). If you want to fetch all the vectors for this document (to analyze, re-embed, or display them), you can use the API below.

**Example using curl:**

```bash
curl -X GET \
  "https://localhost:8443/vectordb/collections/my_collection/vectors?document_id=doc123" \
  -H "Authorization: Bearer <YOUR_API_KEY>"
```

Replace `my_collection` with your collection ID, `doc123` with your document ID, and `<YOUR_API_KEY>` with your actual API key.

Retrieves all vectors associated with a specific document ID in a collection. This is especially useful when you want to fetch all the vectorized chunks of a document (such as a PDF split into pages or sections) for downstream processing, analysis, or display.



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