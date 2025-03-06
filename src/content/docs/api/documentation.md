---
title: Vector Database REST API
description: Complete REST API specification for the Cosdata vector database service
---

## Overview

This document describes the complete REST API specification for the Cosdata vector database service, supporting high-dimensional vector storage, retrieval, and similarity search with transactional guarantees.

> **Note**: For the latest API implementation details, refer to our <a href="https://github.com/cosdata/cosdata" target="_blank" rel="noopener noreferrer">GitHub repository</a>. For questions or support, join our <a href="https://discord.gg/XMdtTBrtKT" target="_blank" rel="noopener noreferrer">Discord community</a>.

## Base URL and Authentication

### Base Configuration

The base URL for all API endpoints is: `https://host:port/vectordb`

### Authentication

All requests require Bearer token authentication obtained through the login endpoint.

#### Login Endpoint

Obtain authentication token for subsequent requests.

* **Method**: POST
* **Path**: `/auth/login`
* **Request Body**:

  ```json
  {
      "username": "admin",
      "password": "admin",
      "pretty_print": false
  }
  ```

* **Response**: JWT token as plain text

  ```
  eyJhbGciOiJIUzI1...
  ```

#### Using Authentication

For all subsequent requests, include the Bearer token in the Authorization header:

  ```
  Authorization: Bearer eyJhbGciOiJIUzI1...
  Content-Type: application/json
  ```

## Collections API

### Collection Management

Collections are the primary containers for vectors and their metadata.

#### Create Collection

Create a new vector collection with specified configuration.

* **Method**: POST
* **Path**: `/collections`
* **Request Body**:

  ```json
  {
      "name": "testdb",
      "description": "Test collection for vector database",
      "dense_vector": {
          "enabled": true,
          "auto_create_index": false,
          "dimension": 1024
      },
      "sparse_vector": {
          "enabled": false,
          "auto_create_index": false
      },
      "metadata_schema": null,
      "config": {
          "max_vectors": null,
          "replication_factor": null
      }
  }
  ```

* **Response**:

  ```json
  {
      "id": "col_123",
      "name": "testdb",
      "description": "Test collection for vector database",
      "created_at": "2024-11-23T12:00:00Z"
  }
  ```

#### Collection Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Unique identifier for the collection |
| description | string | No | Human-readable description |
| dense_vector.enabled | boolean | Yes | Enables dense vector storage and operations |
| dense_vector.auto_create_index | boolean | Yes | Creates search index automatically on vector insertion |
| dense_vector.dimension | integer | Yes | Dimension size for all vectors in collection |
| sparse_vector.enabled | boolean | Yes | Enables sparse vector storage and operations |
| sparse_vector.auto_create_index | boolean | Yes | Creates sparse vector index automatically |
| metadata_schema | object | No | JSON schema for vector metadata validation |
| config.max_vectors | integer | No | Maximum number of vectors allowed |
| config.replication_factor | integer | No | Number of replicas for high availability |

#### Get Collection

Retrieve collection details and configuration.

* **Method**: GET
* **Path**: `/collections/{collection_id}`
* **Response**: Same format as Create Collection response

## Transaction API

### Transaction Overview

The API implements transactions as resources, providing ACID guarantees for vector operations. This approach allows complex vector operations to be performed atomically across multiple requests while maintaining consistency.

### Transaction Lifecycle

#### Transaction Creation

Initiates a new transaction context.

* **Method**: POST
* **Path**: `/collections/{collection_name}/transactions`
* **Response**:

  ```json
  {
      "transaction_id": "txn_abc123",
      "created_at": "2024-11-23T12:00:00Z",
      "status": "active",
      "timeout_at": "2024-11-23T12:10:00Z"
  }
  ```

#### Transaction Operations

Multiple vector operations can be performed within the transaction context.

1. **Vector Insertion**
   * **Method**: POST
   * **Path**: `/collections/{collection_name}/transactions/{transaction_id}/vectors`
   * **Request Body**:
   
   ```json
   {
       "id": "vec1",
       "values": [0.1, 0.2, ...],
       "metadata": {
           "label": "example",
           "timestamp": "2024-11-23T12:00:00Z"
       }
   }
   ```

2. **Batch Upsert**
   * **Method**: POST
   * **Path**: `/collections/{collection_name}/transactions/{transaction_id}/upsert`
   * **Request Body**:
   
   ```json
   {
       "vectors": [
           {
               "id": "vec1",
               "values": [0.1, 0.2, ...],
               "metadata": {}
           },
           {
               "id": "vec2",
               "values": [0.3, 0.4, ...],
               "metadata": {}
           }
       ]
   }
   ```

#### Transaction Completion

Transactions must be explicitly completed through commit or abort.

1. **Commit Transaction**
   * **Method**: POST
   * **Path**: `/collections/{collection_name}/transactions/{transaction_id}/commit`
   * **Response**: 204 No Content

2. **Abort Transaction**
   * **Method**: POST
   * **Path**: `/collections/{collection_name}/transactions/{transaction_id}/abort`
   * **Response**: 204 No Content

### Transaction Field References

#### Transaction Operation Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transaction_id | string | Yes | Unique transaction identifier |
| vectors | array | Yes* | Array of vectors for batch operations |
| vector_db_name | string | Yes | Target collection name |
| timeout | integer | No | Custom timeout in seconds |

#### Vector Fields within Transactions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique vector identifier |
| values | float[] | Yes | Vector components (normalized -1.0 to 1.0) |
| metadata | object | No | Additional vector metadata |
| namespace | string | No | Vector namespace for organization |

### Transaction Guarantees and Constraints

#### ACID Properties

* **Atomicity**: All operations in a transaction either succeed or fail together
* **Consistency**: Vector relationships and indices remain consistent
* **Isolation**: Transactions are isolated from each other until commit
* **Durability**: Committed changes are permanent

#### Operational Constraints

| Constraint | Value | Description |
|------------|-------|-------------|
| Max Batch Size | 1000 | Maximum vectors per batch operation |
| Transaction Timeout | 600s | Default transaction timeout |
| Max Active Transactions | 100 | Per collection limit |
| Vector Dimension | Fixed | Must match collection configuration |

## Vector Search API

### Search Operations

The search API provides efficient similarity search capabilities for vectors.

#### Basic Vector Search

* **Method**: POST
* **Path**: `/search`
* **Request Body**:

  ```json
  {
      "vector_db_name": "testdb",
      "vector": [0.1, 0.2, ...],
      "k": 5,
      "include_metadata": true
  }
  ```

* **Response**:

  ```json
  {
      "RespVectorKNN": {
          "knn": [
              [
                  "vec1",
                  {
                      "CosineSimilarity": 0.95,
                      "metadata": {
                          "label": "example"
                      }
                  }
              ],
              [
                  "vec2",
                  {
                      "CosineSimilarity": 0.85,
                      "metadata": {
                          "label": "example2"
                      }
                  }
              ]
          ]
      }
  }
  ```

#### Search Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| vector_db_name | string | Yes | - | Collection to search in |
| vector | float[] | Yes | - | Query vector |
| k | integer | No | 10 | Number of nearest neighbors |
| include_metadata | boolean | No | false | Include vector metadata |
| namespace | string | No | default | Vector namespace |
| similarity_metric | string | No | cosine | Similarity metric to use |

## Index Management

### Index Operations

Manage search indices for vector collections.

#### Create Index

* **Method**: POST
* **Path**: `/indexes`
* **Request Body**:

  ```json
  {
      "collection_name": "testdb",
      "name": "testdb_index",
      "distance_metric_type": "cosine",
      "quantization": "scalar",
      "data_type": "u8",
      "index_type": "hnsw",
      "params": {
          "num_layers": 5,
          "max_cache_size": 1000
      }
  }
  ```

#### Index Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| collection_name | string | Yes | Target collection |
| name | string | Yes | Index identifier |
| distance_metric_type | string | Yes | Distance metric (cosine, euclidean, dot) |
| quantization | string | Yes | Vector quantization method |
| data_type | string | Yes | Vector data type |
| index_type | string | Yes | Index algorithm type |
| params.num_layers | integer | No | HNSW number of layers |
| params.max_cache_size | integer | No | Maximum cache size |

## Error Handling

### Error Response Format

All API errors follow a consistent format:

  ```json
  {
      "error": {
          "code": "ERROR_CODE",
          "message": "Human readable error message",
          "details": {
              "field": "Additional error context"
          }
      }
  }
  ```

### Common Error Codes

| Code | HTTP Status | Description | Resolution |
|------|-------------|-------------|------------|
| INVALID_REQUEST | 400 | Malformed request | Check request format |
| UNAUTHORIZED | 401 | Invalid authentication | Refresh token |
| COLLECTION_NOT_FOUND | 404 | Collection doesn't exist | Verify collection name |
| TRANSACTION_TIMEOUT | 408 | Transaction expired | Retry with new transaction |
| DIMENSION_MISMATCH | 400 | Vector dimension incorrect | Check vector dimensions |
| TRANSACTION_CONFLICT | 409 | Concurrent modification | Retry transaction |
| INTERNAL_ERROR | 500 | Server error | Contact support |

## Best Practices

### Transaction Management

#### Transaction Lifecycle

1. Create transaction before batch operations
2. Group related operations in single transaction
3. Keep transaction duration short
4. Always commit or abort to release resources

#### Error Handling

1. Implement proper error handling
2. Abort transactions on errors
3. Use retry logic for transient failures
4. Monitor transaction timeouts

#### Performance Optimization

1. Batch vector operations (100-1000 vectors)
2. Use parallel requests for large datasets
3. Monitor response times
4. Index important vector fields

### Vector Operations

#### Vector Normalization

1. Normalize vectors to unit length
2. Keep values between -1.0 and 1.0
3. Consistent dimension across collection
4. Handle sparse vectors efficiently

#### Search Optimization

1. Use appropriate k values
2. Include relevant metadata
3. Choose proper similarity metrics
4. Consider index parameters

## Implementation Notes

### Transaction Implementation

* Uses MVCC (Multi-Version Concurrency Control)
* Each transaction has isolated snapshot view
* Two-phase commit protocol
* Automatic rollback on failures

### Vector Storage

* Optimized for high-dimensional data
* Efficient similarity search
* Configurable indexing strategies
* Metadata indexing support

### Performance Considerations

* Index build time vs query performance
* Memory usage vs search speed
* Transaction overhead
* Batch operation efficiency

## Sample Workflows

### Batch Vector Insertion

```python
# 1. Login and get token
login_response = login()
token = login_response.text

# 2. Create collection
create_collection_response = create_db(
    name="testdb",
    dimension=1024
)

# 3. Start transaction
transaction_response = create_transaction("testdb")
transaction_id = transaction_response["transaction_id"]

# 4. Batch insert vectors
vectors = [
    {
        "id": f"vec_{i}",
        "values": [...],
        "metadata": {"label": f"example_{i}"}
    }
    for i in range(100)
]

try:
    upsert_in_transaction("testdb", transaction_id, vectors)
    commit_transaction("testdb", transaction_id)
except Exception as e:
    abort_transaction("testdb", transaction_id)
    raise e
```

### Search Workflow

```python
# 1. Prepare search vector
search_vector = [0.1, 0.2, ...]

# 2. Perform search
search_response = ann_vector(
    1,
    "testdb",
    search_vector
)

# 3. Process results
results = search_response[1]["RespVectorKNN"]["knn"]
for vector_id, similarity in results:
    print(f"Vector {vector_id}: {similarity}")
```

## API Version and Compatibility

* Current API Version: 1.0
* Base Path: /vectordb
* Backwards Compatibility: Guaranteed for minor versions
* Deprecation Policy: Minimum 6 months notice

## Security Considerations

### Authentication

* JWT-based authentication
* Token expiration and renewal
* Role-based access control

### Data Protection

* TLS encryption required
* Vector data encryption at rest
* Secure credential handling

### Access Control

* Collection-level permissions
* Operation-level authorization
* Transaction isolation

## Monitoring and Diagnostics

### Available Metrics

* Transaction success/failure rates
* Query latency
* Index performance
* Resource utilization

### Health Checks

1. API endpoint health
2. Database connectivity
3. Index status
4. Transaction manager status

## Additional Resources

- **Source Code**: Explore the implementation in our <a href="https://github.com/cosdata/cosdata" target="_blank" rel="noopener noreferrer">GitHub repository</a>
- **Community Support**: Join our <a href="https://discord.gg/XMdtTBrtKT" target="_blank" rel="noopener noreferrer">Discord server</a> for discussions and help
- **Issue Reporting**: Report bugs or request features through <a href="https://github.com/cosdata/cosdata/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a> 