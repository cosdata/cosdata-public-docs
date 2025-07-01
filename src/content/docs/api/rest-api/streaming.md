---
title: Streaming API
description: Real-time data ingestion endpoints for the Cosdata vector database
---

Cosdata's streaming data ingestion is designed for scenarios where individual records must become immediately searchable upon insertion. This is ideal for real-time monitoring systems, live content feeds, and streaming analytics.

Streaming ingestion uses a simplified fire-and-forget API that abstracts away transactional complexity. Each operation is atomic at the record level and immediately available for querying.

## Streaming Data: Upsert Vectors

This API provides a simplified fire-and-forget way to upsert vectors, abstracting away the complexity of atomic operations. The entire workflow is handled in a single request.

**Endpoint:** `POST /vectordb/collections/{collection_id}/streaming/upsert`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection. |

**Request Body:**

```json
{
  "vectors": [
    {
      "id": "vector_id_1",
      "dense_values": [0.1, 0.2, 0.3, ...]
    },
    {
      "id": "vector_id_2",
      "text": "Document text content"
    }
  ]
}
```

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 200  | Success. Vectors upserted successfully.            |
| 404  | Not Found. Collection not found.                   |
| 500  | Server Error. Failed to upsert vectors.            |

---

## Streaming Data: Delete a Vector

This API provides a simplified fire-and-forget way to delete a vector, abstracting away the complexity of atomic operations. The entire workflow is handled in a single request.

**Endpoint:** `DELETE /vectordb/collections/{collection_id}/streaming/delete/{vector_id}`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection. |
| vector_id      | string | Yes      | ID of the vector to delete.        |

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 204  | No Content. Vector deleted successfully.            |
| 404  | Not Found. Collection or vector not found.         |
| 500  | Server Error. Failed to delete vector.              |
