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
import { Client } from 'cosdata-sdk';

// Initialize the client with your server details
const client = new Client({
  host: 'http://localhost:8443',
  username: 'admin',
  password: 'admin',
  verifySSL: false
});
```

### Creating a Collection

Create a new vector collection:

```typescript
// Create a collection for storing 768-dimensional vectors
const collection = await client.createCollection({
  name: 'my_embeddings',
  dimension: 768,
  description: 'Collection for storing document embeddings'
});
```

### Adding Vectors

Add vectors to your collection using transactions:

```typescript
// Get the collection and create an index
const collection = await client.getCollection('my_embeddings');
const index = await collection.createIndex();

// Using automatic transaction management (recommended)
await index.transaction(async (txn) => {
  // Single vector insertion
  await txn.upsert([{
    id: 'doc1',
    values: [0.1, 0.2, 0.3, ...], // 768-dimensional vector
    title: 'Sample Document',
    category: 'documentation',
    tags: ['example', 'getting-started']
  }]);

  // Batch insertion
  const vectors = [
    {
      id: 'doc2',
      values: [0.2, 0.3, 0.4, ...],
      title: 'Another Document'
    },
    {
      id: 'doc3',
      values: [0.3, 0.4, 0.5, ...],
      title: 'Third Document'
    }
  ];
  await txn.upsert(vectors);
});

// Using manual transaction management
const txn = index.createTransaction();
try {
  await txn.upsert([{
    id: 'doc4',
    values: [0.4, 0.5, 0.6, ...],
    title: 'Fourth Document'
  }]);
  await txn.commit();
} catch (error) {
  await txn.abort();
  throw error;
}
```

### Searching Vectors

Perform similarity search:

```typescript
// Get the collection and create an index
const collection = await client.getCollection('my_embeddings');
const index = await collection.createIndex();

// Search for similar vectors
const results = await index.query({
  vector: [0.1, 0.2, 0.3, ...],
  nnCount: 5
});

// Process search results
for (const result of results) {
  console.log(`Vector ID: ${result.id}`);
  console.log(`Similarity: ${result.similarity}`);
  console.log(`Metadata: ${JSON.stringify(result.metadata)}`);
}

// Fetch a specific vector
const vector = await index.fetchVector('doc1');
console.log('Fetched vector:', vector);
```

### Creating and Managing Indexes

Create and manage search indexes:

```typescript
// Get the collection
const collection = await client.getCollection('my_embeddings');

// Create an HNSW index with custom parameters
const index = await collection.createIndex({
  distanceMetric: 'cosine',
  numLayers: 7,
  maxCacheSize: 1000,
  efConstruction: 512,
  efSearch: 256,
  neighborsCount: 32,
  level0NeighborsCount: 64
});

// Get collection information including indexes
const collectionInfo = await collection.getInfo();
console.log('Collection info:', collectionInfo);
```

## Advanced Usage

### Batch Operations

Perform batch operations for better performance:

```typescript
// Get the collection and create an index
const collection = await client.getCollection('my_embeddings');
const index = await collection.createIndex();

// Generate example vectors
const vectors = [];
for (let i = 0; i < 1000; i++) {
  // Create a random 768-dimensional vector
  const values = Array.from({ length: 768 }, () => Math.random());
  
  vectors.push({
    id: `batch_doc_${i}`,
    values,
    metadata: {
      batch_id: Math.floor(i / 100),
      timestamp: new Date().toISOString()
    }
  });
}

// Insert vectors in batches using transactions
const batchSize = 200; // Maximum batch size
for (let i = 0; i < vectors.length; i += batchSize) {
  const batch = vectors.slice(i, i + batchSize);
  
  await index.transaction(async (txn) => {
    await txn.upsert(batch);
    console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(vectors.length/batchSize)}`);
  });
}
```

## Error Handling

Implement proper error handling in your applications:

```typescript
try {
  // Perform Cosdata operations
  const collection = await client.getCollection('non_existent_collection');
} catch (error) {
  if (error.message.includes('Failed to get collection')) {
    console.error('Collection not found:', error);
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

- Use the `index.transaction()` method for automatic commit/abort handling
- Keep transactions short-lived
- Implement proper error handling and retry logic

### Performance Optimization

- Use appropriate batch sizes (200 vectors per batch)
- Create indexes for frequently searched collections
- Monitor and optimize query performance

## API Reference

### Client

- `new Client(options)`: Create a new client instance
  - `options.host`: Server host URL (default: 'http://127.0.0.1:8443')
  - `options.username`: Username for authentication (default: 'admin')
  - `options.password`: Password for authentication (default: 'admin')
  - `options.verifySSL`: Whether to verify SSL certificates (default: false)
- `client.createCollection(options)`: Create a new collection
  - `options.name`: Name of the collection
  - `options.dimension`: Vector dimension (default: 1024)
  - `options.description`: Optional collection description
- `client.getCollection(name)`: Get an existing collection
- `client.collection(name)`: Alias for getCollection
- `client.listCollections()`: List all collections
- `client.collections()`: Get all collections as Collection objects

### Collection

- `collection.createIndex(options)`: Create a new index
  - `options.distanceMetric`: Type of distance metric (default: 'cosine')
  - `options.numLayers`: Number of layers in HNSW graph (default: 7)
  - `options.maxCacheSize`: Maximum cache size (default: 1000)
  - `options.efConstruction`: ef parameter for construction (default: 512)
  - `options.efSearch`: ef parameter for search (default: 256)
  - `options.neighborsCount`: Number of neighbors (default: 32)
  - `options.level0NeighborsCount`: Level 0 neighbors count (default: 64)
- `collection.index(distanceMetric)`: Get or create an index
- `collection.getInfo()`: Get collection information

### Index

- `index.createTransaction()`: Create a new transaction
- `index.transaction(callback)`: Execute operations in a transaction
- `index.query(options)`: Search for similar vectors
  - `options.vector`: Query vector
  - `options.nnCount`: Number of nearest neighbors (default: 5)
- `index.fetchVector(id)`: Fetch a specific vector by ID

### Transaction

- `transaction.upsert(vectors)`: Insert or update vectors
- `transaction.commit()`: Commit the transaction
- `transaction.abort()`: Abort the transaction

## Reference

For more detailed information, refer to:
- [REST API Documentation](/api/documentation/)
- [cosQuery Language](/api/cosquery/)
- [GitHub Repository](https://github.com/cosdata/cosdata-sdk-node) 