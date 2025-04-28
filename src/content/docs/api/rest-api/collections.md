---
title: Collections API
description: Collection management endpoints for the Cosdata vector database
---

Collections are the primary way to organize vectors in the database. Each collection can be configured for dense vectors, sparse vectors, and full-text search with different options.

## Create Collection

Creates a new collection in the vector database.

**Endpoint:** `POST /vectordb/collections`

**Request Body:**

  ```json
  {
    "name": "collection_name",
    "description": "optional description",
    "dense_vector": {
      "enabled": true,
      "dimension": 1024
    },
    "sparse_vector": {
      "enabled": false
    },
    "tf_idf_options": {
      "enabled": false
    },
    "config": {
      "max_vectors": null,
      "replication_factor": null
    },
    "store_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter                 | Type    | Required | Description                                                        |
|---------------------------|---------|----------|--------------------------------------------------------------------|
| name                      | string  | Yes      | Unique name for the collection.                                    |
| description               | string  | No       | Optional description for the collection.                           |
| dense_vector              | object  | Yes      | Configuration for dense vector support.                            |
| dense_vector.enabled      | boolean | Yes      | Whether to enable dense vector operations.                         |
| dense_vector.dimension    | integer | Yes      | Dimension of dense vectors to be stored.                           |
| sparse_vector             | object  | Yes      | Configuration for sparse vector support.                           |
| sparse_vector.enabled     | boolean | Yes      | Whether to enable sparse vector operations.                        |
| tf_idf_options            | object  | Yes      | Configuration for text search/BM25 support.                        |
| tf_idf_options.enabled    | boolean | Yes      | Whether to enable text search operations.                          |
| config                    | object  | Yes      | Collection-level configuration options.                            |
| config.max_vectors        | integer | No       | Maximum number of vectors in the collection (null for unlimited).  |
| config.replication_factor | integer | No       | Replication factor for the collection (null for default).          |
| store_raw_text            | boolean | No       | Whether to store raw text in addition to processed text.           |

**Response:**

  ```json
  {
    "id": "collection_name",
    "name": "collection_name",
    "description": "optional description"
  }
  ```

**Response Fields:**

| Field       | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| id          | string | Unique identifier for the collection (same as name). |
| name        | string | Name of the collection.                          |
| description | string | Optional description of the collection.          |

**Status Codes:**

| Code | Description                               |
|------|-------------------------------------------|
| 201  | Created. Collection created successfully.  |
| 400  | Bad Request. Invalid collection parameters.|
| 409  | Conflict. Collection ID already exists.    |
| 500  | Server Error. Failed to create collection. |

---

## List Collections

Lists all collections in the database.

**Endpoint:** `GET /vectordb/collections`

**Response:**

  ```json
  {
    "collections": [
      {
        "name": "collection_name_1",
        "description": "optional description"
      },
      {
        "name": "collection_name_2",
        "description": "optional description"
      }
    ]
  }
  ```

**Response Fields:**

| Field                | Type   | Description                        |
|----------------------|--------|------------------------------------|
| collections          | array  | List of collection summaries.      |
| collections[].name   | string | Name of the collection.            |
| collections[].description | string | Optional description of the collection. |

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Collections list returned. |
| 500  | Server Error. Failed to retrieve collections. |

---

## Get Collection

Retrieves a collection by ID or name.

**Endpoint:** `GET /vectordb/collections/{collection_id}`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID of the collection to retrieve.  |

**Response:**

  ```json
  {
    "name": "collection_name",
    "description": "optional description",
    "dense_vector": {
      "enabled": true,
      "dimension": 1024
    },
    "sparse_vector": {
      "enabled": false
    },
    "tf_idf_options": {
      "enabled": false
    }
  }
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Collection details retrieved. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to retrieve collection details. |

---

## Delete Collection

Deletes a collection by ID or name.

**Endpoint:** `DELETE /vectordb/collections/{collection_id}`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to delete. |

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 204  | No Content. Collection deleted successfully. |
| 400  | Bad Request. Collection not found. |
| 500  | Server Error. Failed to delete collection. |

---

## Load Collection

Loads a collection into memory for faster access.

**Endpoint:** `POST /vectordb/collections/{collection_id}/load`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to load. |

**Response:**

  ```json
  {
    "name": "collection_name",
    "description": "optional description",
    "dense_vector": {
      "enabled": true,
      "dimension": 1024
    },
    "sparse_vector": {
      "enabled": false
    },
    "tf_idf_options": {
      "enabled": false
    }
  }
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Collection loaded successfully. |
| 400  | Bad Request. Collection not found. |
| 500  | Server Error. Failed to load collection. |

---

## Unload Collection

Unloads a collection from memory to free up resources.

**Endpoint:** `POST /vectordb/collections/{collection_id}/unload`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to unload. |

**Response:**

  ```json
  "Collection 'collection_name' successfully unloaded"
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Collection unloaded successfully. |
| 400  | Bad Request. Collection not found. |
| 500  | Server Error. Failed to unload collection. |

---

## Get Loaded Collections

Retrieves a list of collections currently loaded in memory.

**Endpoint:** `GET /vectordb/collections/loaded`

**Response:**

  ```json
  [
    "collection_name_1",
    "collection_name_2"
  ]
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. List of loaded collections returned. |
| 500  | Server Error. Failed to retrieve loaded collections. |