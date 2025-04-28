---
title: Search API
description: Search endpoints for the Cosdata vector database
---


The vector database supports multiple search modalities, including dense vector, sparse vector, and full-text search. Each 
search type offers both single and batch query options, as well as hybrid search capabilities that combine multiple 
modalities.

## Dense Vector Search

Searches for similar vectors using dense vector representation.

**Endpoint:** `POST /vectordb/collections/{collection_id}/search/dense`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to search in. |

**Request Body:**

  ```json
  {
    "query_vector": [0.1, 0.2, 0.3, ...],
    "top_k": 10,
    "return_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| query_vector  | array  | Yes      | Dense vector to search for. Must have the same dimension as the vectors in the collection. |
| top_k         | integer| No       | Maximum number of results to return. Default is 10. |
| return_raw_text | boolean | No    | Whether to include the raw text in the response (if available). Default is false. |

**Response:**

  ```json
  {
    "results": [
      {
        "id": "vector_id_1",
        "document_id": "doc_id_1",
        "score": 0.95,
        "text": "Optional raw text content"
      },
      {
        "id": "vector_id_2",
        "document_id": "doc_id_2",
        "score": 0.85,
        "text": "Optional raw text content"
      }
    ]
  }
  ```

**Response Fields:**

| Field                | Type   | Description                        |
|----------------------|--------|------------------------------------|
| results              | array  | List of search results.            |
| results[].id         | string | ID of the vector.                  |
| results[].document_id| string | ID of the document (if available). |
| results[].score      | float  | Similarity score.                  |
| results[].text       | string | Raw text content (if available).   |

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Search results returned.   |
| 400  | Bad Request. Invalid search parameters. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to perform search. |

---

## Batch Dense Vector Search

Performs batch search for similar vectors using dense vector representation.

**Endpoint:** `POST /vectordb/collections/{collection_id}/search/batch-dense`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to search in. |

**Request Body:**

  ```json
  {
    "queries": [
      {
        "vector": [0.1, 0.2, 0.3, ...]
      },
      {
        "vector": [0.4, 0.5, 0.6, ...]
      }
    ],
    "top_k": 10,
    "return_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| queries       | array  | Yes      | Array of query objects.            |
| queries[].vector | array | Yes     | Dense vector to search for.        |
| top_k         | integer| No       | Maximum number of results to return per query. Default is 10. |
| return_raw_text | boolean | No    | Whether to include the raw text in the response. Default is false. |

**Response:**

  ```json
  [
    {
      "results": [
        {
          "id": "vector_id_1",
          "document_id": "doc_id_1",
          "score": 0.95,
          "text": null
        }
      ]
    },
    {
      "results": [
        {
          "id": "vector_id_2",
          "document_id": "doc_id_2",
          "score": 0.85,
          "text": null
        }
      ]
    }
  ]
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Search results returned.   |
| 400  | Bad Request. Invalid search parameters. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to perform search. |

---

## Sparse Vector Search

Searches for similar vectors using sparse vector representation.

**Endpoint:** `POST /vectordb/collections/{collection_id}/search/sparse`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to search in. |

**Request Body:**

  ```json
  {
    "query_terms": [
      {"index": 1, "value": 0.5},
      {"index": 5, "value": 0.3},
      {"index": 10, "value": 0.2},
      {"index": 100, "value": 0.1}
    ],
    "top_k": 10,
    "early_terminate_threshold": 0.0,
    "return_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| query_terms   | array  | Yes      | Array of sparse vector entries, each with an index and value. |
| query_terms[].index | integer | Yes | Index position in the sparse vector. |
| query_terms[].value | float | Yes | Value at the specified index. |
| top_k         | integer| No       | Maximum number of results to return. Default is 10. |
| early_terminate_threshold | float | No | Threshold for early termination of search. Default is 0.0. |
| return_raw_text | boolean | No    | Whether to include the raw text in the response. Default is false. |

**Response:**

  ```json
  {
    "results": [
      {
        "id": "vector_id_1",
        "document_id": "doc_id_1",
        "score": 0.95,
        "text": null
      },
      {
        "id": "vector_id_2",
        "document_id": "doc_id_2",
        "score": 0.85,
        "text": null
      }
    ]
  }
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Search results returned.   |
| 400  | Bad Request. Invalid search parameters. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to perform search. |

---

## Batch Sparse Vector Search

Performs batch search for similar vectors using sparse vector representation.

**Endpoint:** `POST /vectordb/collections/{collection_id}/search/batch-sparse`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to search in. |

**Request Body:**

  ```json
  {
    "query_terms_list": [
      [
        {"index": 1, "value": 0.5},
        {"index": 5, "value": 0.3}
      ],
      [
        {"index": 10, "value": 0.2},
        {"index": 100, "value": 0.1}
      ]
    ],
    "top_k": 10,
    "early_terminate_threshold": 0.0,
    "return_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter            | Type   | Required | Description                        |
|----------------------|--------|----------|------------------------------------|
| query_terms_list     | array  | Yes      | Array of sparse vector query terms arrays. |
| top_k                | integer| No       | Maximum number of results to return per query. Default is 10. |
| early_terminate_threshold | float | No    | Threshold for early termination of search. Default is 0.0. |
| return_raw_text      | boolean | No      | Whether to include the raw text in the response. Default is false. |

**Response:**

  ```json
  [
    {
      "results": [
        {
          "id": "vector_id_1",
          "document_id": "doc_id_1",
          "score": 0.95,
          "text": null
        }
      ]
    },
    {
      "results": [
        {
          "id": "vector_id_2",
          "document_id": "doc_id_2",
          "score": 0.85,
          "text": null
        }
      ]
    }
  ]
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Search results returned.   |
| 400  | Bad Request. Invalid search parameters. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to perform search. |

---

## TF-IDF/BM25 Search

Searches for similar documents using TF-IDF/BM25 text search.

**Endpoint:** `POST /vectordb/collections/{collection_id}/search/tf-idf`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to search in. |

**Request Body:**

  ```json
  {
    "query": "search query text",
    "top_k": 10,
    "return_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| query         | string | Yes      | Text query to search for.          |
| top_k         | integer| No       | Maximum number of results to return. Default is 10. |
| return_raw_text | boolean | No    | Whether to include the raw text in the response. Default is false. |

**Response:**

  ```json
  {
    "results": [
      {
        "id": "vector_id_1",
        "document_id": "doc_id_1",
        "score": 0.95,
        "text": null
      },
      {
        "id": "vector_id_2",
        "document_id": "doc_id_2",
        "score": 0.85,
        "text": null
      }
    ]
  }
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Search results returned.   |
| 400  | Bad Request. Invalid search parameters. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to perform search. |

---

## Batch TF-IDF Search

Performs batch search for similar documents using TF-IDF/BM25 text search.

**Endpoint:** `POST /vectordb/collections/{collection_id}/search/batch-tf-idf`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to search in. |

**Request Body:**

  ```json
  {
    "queries": [
      "first search query",
      "second search query"
    ],
    "top_k": 10,
    "return_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| queries       | array  | Yes      | Array of text queries to search for. |
| top_k         | integer| No       | Maximum number of results to return per query. Default is 10. |
| return_raw_text | boolean | No    | Whether to include the raw text in the response. Default is false. |

**Response:**

  ```json
  [
    {
      "results": [
        {
          "id": "vector_id_1",
          "document_id": "doc_id_1",
          "score": 0.95,
          "text": null
        }
      ]
    },
    {
      "results": [
        {
          "id": "vector_id_2",
          "document_id": "doc_id_2",
          "score": 0.85,
          "text": null
        }
      ]
    }
  ]
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Search results returned.   |
| 400  | Bad Request. Invalid search parameters. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to perform search. |

---

## Hybrid Search

Combines multiple search modalities (dense vector, sparse vector, text) for more effective retrieval.

**Endpoint:** `POST /vectordb/collections/{collection_id}/search/hybrid`

**URL Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| collection_id  | string | Yes      | ID (name) of the collection to search in. |

**Request Body (Dense + Sparse):**

  ```json
  {
    "query_vector": [0.1, 0.2, 0.3, ...],
    "query_terms": [
      {"index": 1, "value": 0.5},
      {"index": 5, "value": 0.3}
    ],
    "sparse_early_terminate_threshold": 0.0,
    "top_k": 10,
    "fusion_constant_k": 60.0,
    "return_raw_text": false
  }
  ```

**Request Body (Dense + TF-IDF):**

  ```json
  {
    "query_vector": [0.1, 0.2, 0.3, ...],
    "query_text": "search query text",
    "top_k": 10,
    "fusion_constant_k": 60.0,
    "return_raw_text": false
  }
  ```

**Request Body (Sparse + TF-IDF):**

  ```json
  {
    "query_terms": [
      {"index": 1, "value": 0.5},
      {"index": 5, "value": 0.3}
    ],
    "query_text": "search query text",
    "sparse_early_terminate_threshold": 0.0,
    "top_k": 10,
    "fusion_constant_k": 60.0,
    "return_raw_text": false
  }
  ```

**Request Parameters:**

| Parameter      | Type   | Required | Description                        |
|---------------|--------|----------|------------------------------------|
| query_vector  | array  | Yes (for dense search) | Dense vector to search for. |
| query_terms   | array  | Yes (for sparse search) | Sparse vector entries to search for. |
| query_text    | string | Yes (for text search) | Text query to search for.   |
| sparse_early_terminate_threshold | float | No | Threshold for early termination of sparse search. Default is 0.0. |
| top_k         | integer| No       | Maximum number of results to return. Default is 10. |
| fusion_constant_k | float | No    | Constant used in score normalization during fusion. Default is 60.0. |
| return_raw_text | boolean | No    | Whether to include the raw text in the response. Default is false. |

**Response:**

  ```json
  {
    "results": [
      {
        "id": "vector_id_1",
        "document_id": "doc_id_1",
        "score": 0.95,
        "text": null
      },
      {
        "id": "vector_id_2",
        "document_id": "doc_id_2",
        "score": 0.85,
        "text": null
      }
    ]
  }
  ```

**Status Codes:**

| Code | Description                        |
|------|------------------------------------|
| 200  | Success. Search results returned.   |
| 400  | Bad Request. Invalid search parameters. |
| 404  | Not Found. Collection not found.    |
| 500  | Server Error. Failed to perform search. |