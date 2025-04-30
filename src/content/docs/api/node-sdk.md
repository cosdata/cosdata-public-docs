---
title: "Node.js SDK"
description: "How to use the Cosdata Node.js SDK to interact with the vector database"
---

The Cosdata Node.js SDK provides a convenient way to interact with the Cosdata vector database from Node.js applications. This guide will help you get started with the SDK and show you how to perform common operations.

## Installation

You can install the Cosdata Node.js SDK using npm:

```bash
npm install cosdata-sdk
```

## Basic Usage

### Connecting to Cosdata

First, import the Cosdata client and establish a connection:

```typescript
import { createClient } from 'cosdata-sdk';

// Initialize the client (all parameters are optional)
const client = createClient({
  host: 'http://127.0.0.1:8443',  // Default host
  username: 'admin',              // Default username
  password: 'test_key',           // Default password
  verifySSL: false                // SSL verification
});
```

### Creating a Collection

Create a new vector collection:

```typescript
// Create a collection for storing vectors
const collection = await client.createCollection({
  name: 'my_collection',
  dimension: 128,
  dense_vector: {
    enabled: true,
    dimension: 128,
    auto_create_index: false
  }
});
```

### Creating an Index

Create a search index for your collection:

```typescript
// Create an index with custom parameters
const index = await collection.createIndex({
  name: 'my_collection_dense_index',
  distance_metric: 'cosine',
  quantization_type: 'auto',
  sample_threshold: 100,
  num_layers: 16,
  max_cache_size: 1024,
  ef_construction: 128,
  ef_search: 64,
  neighbors_count: 10,
  level_0_neighbors_count: 20
});
```

### Adding Vectors

Add vectors to your collection using transactions:

```typescript
// Generate some vectors
function generateRandomVector(dimension: number): number[] {
  return Array.from({ length: dimension }, () => Math.random());
}

const vectors = Array.from({ length: 100 }, (_, i) => ({
  id: `vec_${i}`,
  dense_values: generateRandomVector(128),
  document_id: `doc_${i}`
}));

// Add vectors using a transaction
const txn = collection.transaction();
await txn.batch_upsert_vectors(vectors);
await txn.commit();
```

### Searching Vectors

Perform similarity search:

```typescript
// Search for similar vectors
const results = await collection.getSearch().dense({
  query_vector: generateRandomVector(128),
  top_k: 5,
  return_raw_text: true
});

// Process search results
for (const result of results) {
  console.log(`Vector ID: ${result.id}`);
  console.log(`Similarity: ${result.similarity}`);
  console.log(`Metadata: ${JSON.stringify(result.metadata)}`);
}
```

## Advanced Usage

### Batch Operations

Perform batch operations for better performance:

```typescript
// Generate example vectors
const vectors = Array.from({ length: 1000 }, (_, i) => ({
  id: `vec_${i}`,
  dense_values: generateRandomVector(128),
  document_id: `doc_${i}`,
  metadata: {
    batch_id: Math.floor(i / 100),
    timestamp: new Date().toISOString()
  }
}));

// Insert vectors in batches using transactions
const batchSize = 200; // Maximum batch size
for (let i = 0; i < vectors.length; i += batchSize) {
  const batch = vectors.slice(i, i + batchSize);
  
  const txn = collection.transaction();
  await txn.batch_upsert_vectors(batch);
  await txn.commit();
  
  console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(vectors.length/batchSize)}`);
}
```

## Error Handling

Implement proper error handling in your applications:

```typescript
try {
  // Perform Cosdata operations
  const collection = await client.createCollection({
    name: 'my_collection',
    dimension: 128,
    dense_vector: {
      enabled: true,
      dimension: 128,
      auto_create_index: false
    }
  });
} catch (error) {
  if (error.message.includes('Collection already exists')) {
    console.error('Collection already exists:', error);
  } else if (error.message.includes('Authentication failed')) {
    console.error('Authentication error:', error);
  } else if (error.message.includes('Connection error')) {
    console.error('Connection error:', error);
  } else if (error.message.includes('Transaction error')) {
    console.error('Transaction error:', error);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Best Practices

### Connection Management

- Reuse client instances when possible
- Implement connection pooling for high-throughput applications
- Handle connection errors with appropriate retry logic

### Vector Operations

- Normalize vectors before insertion
- Use batch operations for better performance
- Keep vector dimensions consistent

### Transaction Management

- Use transactions for batch operations
- Always call `commit()` after successful operations
- Use `abort()` in case of errors
- Maximum batch size is 200 vectors per transaction

### Performance Optimization

- Use appropriate batch sizes (200 vectors per batch)
- Create indexes for frequently searched collections
- Monitor and optimize query performance

## API Reference

### Client

- `createClient(options)`: Create a new client instance
  - `options.host`: Server host URL (default: 'http://127.0.0.1:8443')
  - `options.username`: Username for authentication (default: 'admin')
  - `options.password`: Password for authentication (default: 'test_key')
  - `options.verifySSL`: Whether to verify SSL certificates (default: false)
- `client.createCollection(options)`: Create a new collection
  - `options.name`: Name of the collection
  - `options.dimension`: Vector dimension
  - `options.dense_vector`: Dense vector configuration
    - `enabled`: Whether dense vectors are enabled
    - `dimension`: Dense vector dimension
    - `auto_create_index`: Whether to auto-create index
- `client.getCollection(name)`: Get an existing collection
- `client.listCollections()`: List all collections

### Collection

- `collection.createIndex(options)`: Create a new index
  - `options.name`: Name of the index
  - `options.distance_metric`: Type of distance metric
  - `options.quantization_type`: Type of quantization
  - `options.sample_threshold`: Sample threshold
  - `options.num_layers`: Number of layers
  - `options.max_cache_size`: Maximum cache size
  - `options.ef_construction`: ef parameter for construction
  - `options.ef_search`: ef parameter for search
  - `options.neighbors_count`: Number of neighbors
  - `options.level_0_neighbors_count`: Level 0 neighbors count
- `collection.getInfo()`: Get collection information
- `collection.transaction()`: Create a new transaction (synchronous, returns a Transaction instance)
- `collection.getSearch()`: Get search interface
- `collection.getVectors()`: Get vectors interface
- `collection.getVersions()`: Get versions interface

### Transaction

- `transaction.upsert_vector(vector)`: Insert or update a single vector
- `transaction.batch_upsert_vectors(vectors)`: Insert or update multiple vectors
- `transaction.commit()`: Commit the transaction
- `transaction.abort()`: Abort the transaction

### Search

- `search.dense(options)`: Perform dense vector search
  - `options.query_vector`: Query vector
  - `options.top_k`: Number of nearest neighbors
  - `options.return_raw_text`: Whether to return raw text

### Vectors

- `vectors.get(vector_id: string): Promise<VectorObject>`
  - Returns a plain object matching the vector schema:
    ```typescript
    interface VectorObject {
      id: string;
      document_id?: string;
      dense_values?: number[];
      sparse_indices?: number[];
      sparse_values?: number[];
      text?: string;
    }
    ```
- `vectors.exists(vector_id: string): Promise<boolean>`

### Versions

- `versions.getCurrent(): Promise<Version>`
- `versions.list(): Promise<Version[]>`
- `versions.get(version_hash: string): Promise<Version>`

Where `Version` is:
```typescript
interface Version {
  hash: string;
  version_number: number;
  timestamp: number;
  vector_count: number;
}
```

## Reference

For more detailed information, refer to:
- [REST API Documentation](/api/documentation/)
- [cosQuery Language](/api/cosquery/)
- [GitHub Repository](https://github.com/cosdata/cosdata-sdk-node) 