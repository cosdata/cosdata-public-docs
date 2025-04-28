---
title: Version Management API
description: Endpoints for managing and retrieving collection versions in the Cosdata vector database
---

## List Versions

Retrieves a list of all versions for a collection, including the current active version.

**Endpoint:** `GET /vectordb/collections/{collection_id}/versions`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID of the collection to retrieve versions for. |

**Response:**

  ```json
  {
    "versions": [
      {
        "hash": "a1b2c3d4",
        "version_number": 3,
        "timestamp": 1625097600,
        "vector_count": 1250
      },
      {
        "hash": "e5f6g7h8",
        "version_number": 2,
        "timestamp": 1625011200,
        "vector_count": 1000
      },
      {
        "hash": "i9j0k1l2",
        "version_number": 1,
        "timestamp": 1624924800,
        "vector_count": 750
      }
    ],
    "current_hash": "a1b2c3d4"
  }
  ```

**Response Fields:**

| Field                | Type    | Description                                 |
|----------------------|---------|---------------------------------------------|
| versions             | array   | List of version metadata objects.           |
| versions[].hash      | string  | Unique hash identifier for the version.     |
| versions[].version_number | integer | Sequential version number.             |
| versions[].timestamp | integer | Unix timestamp when the version was created.|
| versions[].vector_count | integer | Number of vectors in this version.      |
| current_hash         | string  | Hash of the currently active version.       |

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Returns the list of versions. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Internal database or server error. |

---

## Get Current Version

Retrieves metadata for the currently active version of a collection.

**Endpoint:** `GET /vectordb/collections/{collection_id}/versions/current`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID of the collection to retrieve current version for. |

**Response:**

  ```json
  {
    "hash": "a1b2c3d4",
    "version_number": 3,
    "timestamp": 1625097600,
    "vector_count": 1250
  }
  ```

**Response Fields:**

| Field           | Type    | Description                                 |
|-----------------|---------|---------------------------------------------|
| hash            | string  | Unique hash identifier for the version.     |
| version_number  | integer | Sequential version number.                  |
| timestamp       | integer | Unix timestamp when the version was created.|
| vector_count    | integer | Number of vectors in this version.          |

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Returns the current version metadata. |
| 404  | Not Found. Collection not found.    |
| 400  | Bad Request. Invalid version hash.  |
| 500  | Server Error. Internal database or server error. |