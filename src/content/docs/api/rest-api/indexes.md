---
title: Index Management
description: Index management endpoints for the Cosdata vector database
---

The vector database supports different types of indexes for optimizing vector search operations. Each collection can have 
separate indexes for dense vectors, sparse vectors, and text search.

## Create Dense Vector Index

Creates an index for dense vector search using approximate nearest neighbor (ANN) algorithms.

**Endpoint:** `POST /vectordb/collections/{collection_id}/indexes/dense`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| collection_id | string | Yes | ID (name) of the collection to create an index for. |

**Request Body:**
```json
{
  "name": "index_name",
  "distance_metric_type": "cosine",
  "quantization": {
    "type": "auto",
    "properties": {
      "sample_threshold": 100
    }
  },
  "index": {
    "type": "hnsw",
    "properties": {
      "num_layers": 7,
      "max_cache_size": 1000,
      "ef_construction": 512,
      "ef_search": 256,
      "neighbors_count": 32,
      "level_0_neighbors_count": 64
    }
  }
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Name of the index. |
| distance_metric_type | string | Yes | Distance metric to use: "cosine", "euclidean", or "dot_product". |
| quantization | object | Yes | Configuration for vector quantization. |
| quantization.type | string | Yes | Type of quantization: "auto" or "scalar". |
| quantization.properties | object | Yes | Properties specific to the quantization type. |
| quantization.properties.sample_threshold | integer | Yes (if auto) | Number of vectors to sample for automatic quantization. |
| quantization.properties.data_type | string | Yes (if scalar) | Data type for scalar quantization: "binary", "quaternay", "octal", "u8", "f16", or "f32". |
| quantization.properties.range | object | Yes (if scalar) | Value range for scalar quantization. |
| index | object | Yes | Configuration for index algorithm. |
| index.type | string | Yes | Type of index algorithm. Currently only "hnsw" is supported. |
| index.properties | object | Yes | Properties specific to the index algorithm. |
| index.properties.num_layers | integer | No | Number of layers in the HNSW graph. |
| index.properties.max_cache_size | integer | No | Maximum number of elements in the cache. |
| index.properties.ef_construction | integer | No | Size of the dynamic candidate list during index construction. |
| index.properties.ef_search | integer | No | Size of the dynamic candidate list during search. |
| index.properties.neighbors_count | integer | No | Number of established connections per node. |
| index.properties.level_0_neighbors_count | integer | No | Number of connections at the ground layer. |

**Response:**
```json
{}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 201 | Created. Index created successfully. |
| 400 | Bad Request. Invalid index parameters. |
| 404 | Not Found. Collection not found. |
| 409 | Conflict. Index already exists for this collection. |
| 500 | Server Error. Failed to create index. |

---

## Create Sparse Vector Index

Creates an index for sparse vector search.

**Endpoint:** `POST /vectordb/collections/{collection_id}/indexes/sparse`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| collection_id | string | Yes | ID (name) of the collection to create an index for. |

**Request Body:**
```json
{
  "name": "index_name",
  "quantization": 64,
  "sample_threshold": 1000
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Name of the index. |
| quantization | integer | Yes | Quantization bit value. Allowed values: 16, 32, 64, 128, or 256. |
| sample_threshold | integer | Yes | Number of vectors to sample for calibrating the index. |

**Response:**
```json
{}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 201 | Created. Index created successfully. |
| 400 | Bad Request. Invalid index parameters. |
| 404 | Not Found. Collection not found. |
| 409 | Conflict. Index already exists for this collection. |
| 500 | Server Error. Failed to create index. |

---

## Create TF-IDF Index

Creates an index for text search using TF-IDF/BM25.

**Endpoint:** `POST /vectordb/collections/{collection_id}/indexes/tf-idf`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| collection_id | string | Yes | ID (name) of the collection to create an index for. |

**Request Body:**
```json
{
  "name": "index_name",
  "sample_threshold": 1000,
  "k1": 1.2,
  "b": 0.75
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Name of the index. |
| sample_threshold | integer | Yes | Number of documents to sample for calibrating the index. |
| k1 | float | Yes | BM25 k1 parameter that controls term frequency saturation. Typical values range from 1.2 to 2.0. |
| b | float | Yes | BM25 b parameter that controls document length normalization. Typical value is 0.75. |

**Response:**
```json
{}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 201 | Created. Index created successfully. |
| 400 | Bad Request. Invalid index parameters. |
| 404 | Not Found. Collection not found. |
| 409 | Conflict. Index already exists for this collection. |
| 500 | Server Error. Failed to create index. |

---

## Get Index

Retrieves information about the indexes defined for a collection.

**Endpoint:** `GET /vectordb/collections/{collection_id}/indexes`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| collection_id | string | Yes | ID (name) of the collection to get indexes for. |

**Response:**
```json
{
  "dense": {
    "name": "dense_index_name",
    "distance_metric_type": "cosine",
    "quantization": {
      "type": "auto",
      "properties": {
        "sample_threshold": 100
      }
    },
    "index": {
      "type": "hnsw",
      "properties": {
        "num_layers": 7,
        "max_cache_size": 1000,
        "ef_construction": 512,
        "ef_search": 256,
        "neighbors_count": 32,
        "level_0_neighbors_count": 64
      }
    }
  },
  "sparse": {
    "name": "sparse_index_name",
    "quantization": 64,
    "sample_threshold": 1000
  },
  "tf-idf": {
    "name": "tf_idf_index_name",
    "sample_threshold": 1000,
    "k1": 1.2,
    "b": 0.75
  }
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success. Index information returned. |
| 404 | Not Found. Collection not found. |
| 500 | Server Error. Failed to retrieve index information. |

---

## Delete Index

Deletes an index from a collection.

**Endpoint:** `DELETE /vectordb/collections/{collection_id}/indexes/{index_type}`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| collection_id | string | Yes | ID (name) of the collection containing the index. |
| index_type | string | Yes | Type of index to delete: "dense", "sparse", or "tf_idf". |

**Status Codes:**

| Code | Description |
|------|-------------|
| 204 | No Content. Index deleted successfully. |
| 400 | Bad Request. Invalid index type. |
| 404 | Not Found. Collection or index not found. |
| 500 | Server Error. Failed to delete index. | 