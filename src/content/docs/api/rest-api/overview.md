---
title: REST API Overview
description: Overview of the Cosdata vector database REST API
---

## Overview

This document provides an overview of the Cosdata vector database REST API, which supports high-dimensional vector storage, retrieval, and similarity search with transactional guarantees.

> **Note**: For the latest API implementation details, refer to our <a href="https://github.com/cosdata/cosdata" target="_blank" rel="noopener noreferrer">GitHub repository</a>. For questions or support, join our <a href="https://discord.gg/XMdtTBrtKT" target="_blank" rel="noopener noreferrer">Discord community</a>.

## Base URL and Authentication

The base URL for all API endpoints is: `https://host:port/vectordb`

For detailed authentication information, see [Authentication](/api/rest-api/authentication/).

## API Endpoints

The API is organized into the following sections:

### Collections

Collection management endpoints for creating, listing, and managing vector collections.

[View Collections API Documentation](/api/rest-api/collections/)

### Transactions

Transaction management endpoints for performing atomic operations on vectors.

[View Transactions API Documentation](/api/rest-api/transactions/)

### Search

Search endpoints for performing vector similarity search and text search.

[View Search API Documentation](/api/rest-api/search/)

### Index Management

Index management endpoints for optimizing search performance.

[View Index Management API Documentation](/api/rest-api/indexes/)

## Best Practices

### Transaction Management

1. Create transaction before batch operations
2. Group related operations in single transaction
3. Keep transaction duration short
4. Always commit or abort to release resources

### Error Handling

1. Implement proper error handling
2. Abort transactions on errors
3. Use retry logic for transient failures
4. Monitor transaction timeouts

### Performance Optimization

1. Batch vector operations (100-1000 vectors)
2. Use parallel requests for large datasets
3. Monitor response times
4. Index important vector fields

### Vector Operations

1. Normalize vectors to unit length
2. Keep values between -1.0 and 1.0
3. Consistent dimension across collection
4. Handle sparse vectors efficiently

### Search Optimization

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

## Additional Resources

- **Source Code**: Explore the implementation in our <a href="https://github.com/cosdata/cosdata" target="_blank" rel="noopener noreferrer">GitHub repository</a>
- **Community Support**: Join our <a href="https://discord.gg/XMdtTBrtKT" target="_blank" rel="noopener noreferrer">Discord server</a> for discussions and help
- **Issue Reporting**: Report bugs or request features through <a href="https://github.com/cosdata/cosdata/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a> 