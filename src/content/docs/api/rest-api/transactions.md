---
title: Transactions API
description: Transaction management endpoints for the Cosdata vector database
---

Cosdata uses transactions (atomic operations) for batch operations. This is ideal for importing large, logically cohesive datasets where partial imports would compromise data integrity.

Transactions are managed resources with a defined lifecycle: open → operate → commit/abort. They provide all-or-nothing semantics with rollback capability. All data modifications within a transaction are buffered and applied in a single atomic operation upon commit.

**Commit = atomic**

**Indexing = background process**

Once a transaction is committed, the system begins indexing the data in the background. You can monitor the progress of a transaction using the status endpoint.

## Create Transaction

Creates a new transaction for batch operations on a collection.

**Endpoint:** `POST /vectordb/collections/{collection_id}/transactions`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to create a transaction for. |

**Response:**

  ```json
  {
    "transaction_id": "123456789",
    "created_at": "2023-08-15T14:30:45.123Z"
  }
  ```

**Response Fields:**

| Field           | Type   | Description                                 |
|-----------------|--------|---------------------------------------------|
| transaction_id  | string | Unique identifier for the transaction.      |
| created_at      | string | ISO 8601 timestamp when the transaction was created. |

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 200  | Success. Transaction created successfully.          |
| 400  | Bad Request. Collection not found or invalid parameters. |
| 409  | Conflict. There is an ongoing transaction for this collection. |
| 500  | Server Error. Failed to create transaction.         |

---

## Get Transaction Status

Gets the current status of a transaction, which is useful for monitoring the progress of background indexing after commit.

**Endpoint:** `GET /vectordb/collections/{collection_id}/transactions/{transaction_id}/status`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection containing the transaction. |
| transaction_id | string | Yes      | ID of the transaction to get the status for.   |

**Response:**

```json
{
  "status": {
    "Complete": {
      "started_at": "2023-01-01T12:00:00Z",
      "completed_at": "2023-01-01T12:00:00Z",
      "stats": {
        "records_upserted": 1000,
        "records_deleted": 0,
        "total_operations": 5,
        "percentage_complete": 100.0,
        "processing_time_seconds": 120,
        "average_throughput": 8.33,
        "version_created": 42
      }
    }
  }
}
```

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 200  | Success. Transaction status retrieved successfully. |
| 400  | Bad Request. Collection or transaction not found.  |
| 404  | Not Found. Transaction not found.                  |
| 500  | Server Error. Failed to get transaction status.    |

---

## Commit Transaction

Commits a transaction, making all changes permanent. The commit is atomic. Use the `Get Transaction Status` endpoint to monitor background indexing progress.

**Endpoint:** `POST /vectordb/collections/{collection_id}/transactions/{transaction_id}/commit`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection containing the transaction. |
| transaction_id | string | Yes      | ID of the transaction to commit.   |

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 204  | No Content. Transaction commit accepted for processing. |
| 400  | Bad Request. Collection or transaction not found or invalid parameters. |
| 500  | Server Error. Failed to commit transaction.         |

---

## Abort Transaction

Aborts a transaction, discarding all changes.

**Endpoint:** `POST /vectordb/collections/{collection_id}/transactions/{transaction_id}/abort`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection containing the transaction. |
| transaction_id | string | Yes      | ID of the transaction to abort.    |

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 204  | No Content. Transaction aborted successfully.       |
| 400  | Bad Request. Collection or transaction not found or invalid parameters. |
| 500  | Server Error. Failed to abort transaction.          |

---

## Add Vector to Transaction

Adds a single vector to a transaction.

**Endpoint:** `POST /vectordb/collections/{collection_id}/transactions/{transaction_id}/vectors`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection containing the transaction. |
| transaction_id | string | Yes      | ID of the transaction to add the vector to. |

**Request Body:**

  ```json
  {
    "id": "vector_id",
    "document_id": "optional_document_id",
    "dense_values": [0.1, 0.2, 0.3, ...],
    "sparse_values": null,
    "text": "Optional text content",
    "metadata": { "key": "value" }
  }
  ```

  ```json
  {
    "id": "vector_id",
    "document_id": "optional_document_id",
    "sparse_indices": [1, 5, 10, 100],
    "sparse_values": [0.5, 0.3, 0.2, 0.1],
    "text": "Optional text content",
    "metadata": { "key": "value" }
  }
  ```

  ```json
  {
    "id": "vector_id",
    "document_id": "optional_document_id",
    "text": "Document text content for TF-IDF/BM25 indexing",
    "metadata": { "key": "value" }
  }
  ```

**Request Parameters:**

| Parameter        | Type   | Required | Description                        |
|------------------|--------|----------|------------------------------------|
| id               | string | Yes      | Unique identifier for the vector.  |
| document_id      | string | No       | Optional document identifier.      |
| dense_values     | array  | No*      | Dense vector values.               |
| sparse_indices   | array  | No*      | Indices for sparse vector.         |
| sparse_values    | array  | No*      | Values for sparse vector.          |
| text             | string | No*      | Text content.                      |
| metadata         | object | No       | Optional key-value metadata.       |

*At least one of dense_values, sparse_indices/sparse_values, or text must be provided for each vector.

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 200  | Success. Vector added to transaction successfully.  |
| 400  | Bad Request. Collection or transaction not found, or invalid vector data. |
| 500  | Server Error. Failed to add vector to transaction.  |

---

## Upsert Vectors in Transaction

Inserts or updates multiple vectors in a transaction in a single batch operation.

**Endpoint:** `POST /vectordb/collections/{collection_id}/transactions/{transaction_id}/upsert`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection containing the transaction. |
| transaction_id | string | Yes      | ID of the transaction to upsert vectors in. |

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
        "sparse_indices": [1, 5, 10],
        "sparse_values": [0.5, 0.3, 0.2]
      },
      {
        "id": "vector_id_3",
        "text": "Document text content"
      }
    ]
  }
  ```

**Request Parameters:**

| Parameter            | Type   | Required | Description                        |
|----------------------|--------|----------|------------------------------------| 
| vectors              | array  | Yes      | Array of vector objects to upsert. |
| vectors[].id         | string | Yes      | Unique identifier for each vector. |
| vectors[].document_id| string | No       | Optional document identifier for each vector. |
| vectors[].dense_values| array | No*      | Dense vector values.               |
| vectors[].sparse_indices| array| No*     | Indices for sparse vector.         |
| vectors[].sparse_values| array| No*      | Values for sparse vector.          |
| vectors[].text       | string | No*      | Text content.                      |
| vectors[].metadata   | object | No       | Optional key-value metadata for each vector. |

*At least one of dense_values, sparse_indices/sparse_values, or text must be provided for each vector.

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 200  | Success. Vectors upserted successfully.            |
| 400  | Bad Request. Collection or transaction not found, or invalid vector data. |
| 500  | Server Error. Failed to upsert vectors.            |

---

## Delete Vector in Transaction

Deletes a vector from a transaction.

**Endpoint:** `DELETE /vectordb/collections/{collection_id}/transactions/{transaction_id}/vectors/{vector_id}`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection containing the transaction. |
| transaction_id | string | Yes      | ID of the transaction containing the vector. |
| vector_id      | string | Yes      | ID of the vector to delete.        |

**Status Codes:**

| Code | Description                                        |
|------|----------------------------------------------------|
| 204  | No Content. Vector deleted successfully.            |
| 400  | Bad Request. Collection, transaction, or vector not found. |
| 500  | Server Error. Failed to delete vector.              |