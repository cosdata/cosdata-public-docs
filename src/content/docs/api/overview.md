---
title: API Overview
description: Overview of the Cosdata API
---

# Cosdata API Overview

Cosdata provides a comprehensive API for interacting with your vector database. This overview will help you understand the key concepts and endpoints.

## API Endpoints

Cosdata offers both REST and gRPC interfaces:

- **REST API**: Available at `http://localhost:8443/api/v1`
- **gRPC API**: Available at `localhost:50051`

## Authentication

All API requests require authentication using an API key. You can pass this key in the `Authorization` header:

  ```bash
  Authorization: Bearer YOUR_API_KEY
  ```

## Common Operations

### Collections

- Create a collection
- List collections
- Get collection details
- Delete a collection

### Vectors

- Insert vectors
- Search vectors
- Delete vectors
- Update vectors

### Indexes

- Create an index
- List indexes
- Get index details
- Delete an index

### Transactions

- Create a transaction
- Commit a transaction
- Abort a transaction
- Perform operations within a transaction

## Client Libraries

Cosdata provides official client libraries to simplify integration:

- **Python SDK**: A Python client library for Cosdata
- **JavaScript SDK**: Coming soon
- **Java SDK**: Coming soon

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Next Steps

For detailed information about specific endpoints, refer to:
- [cosQuery Language](/api/cosquery/) - Learn about our query language
- [REST API Documentation](/api/documentation/) - Complete REST API specification
- [Python SDK](/api/python-sdk/) - How to use the Python client library
