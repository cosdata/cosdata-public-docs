---
title: Python SDK
description: How to use the Cosdata Python SDK to interact with the vector database
---

The Cosdata Python SDK provides a convenient way to interact with the Cosdata vector database from Python applications. This guide will help you get started with the SDK and show you how to perform common operations.

## Installation

You can install the Cosdata Python SDK directly from GitHub:

```bash
# Clone the repository
git clone https://github.com/cosdata/cosdata-sdk-python.git

# Install the library
cd cosdata-sdk-python
pip install -e .
```

## Basic Usage

### Connecting to Cosdata

First, import the Cosdata client and establish a connection:

```python
from cosdata import CosdataClient

# Initialize the client with your server details
client = CosdataClient(
    host="localhost",
    port=8443,
    admin_key="your-admin-key"
)
```

### Creating a Collection

Create a new vector collection:

```python
# Create a collection for storing 768-dimensional vectors
collection = client.create_collection(
    name="my_embeddings",
    description="Collection for storing document embeddings",
    dense_vector={
        "enabled": True,
        "auto_create_index": True,
        "dimension": 768
    }
)
```

### Adding Vectors

Add vectors to your collection:

```python
# Single vector insertion
client.insert_vector(
    collection_name="my_embeddings",
    vector_id="doc1",
    vector=[0.1, 0.2, 0.3, ...],  # 768-dimensional vector
    metadata={
        "title": "Sample Document",
        "category": "documentation",
        "tags": ["example", "getting-started"]
    }
)

# Batch insertion
vectors = [
    {
        "id": "doc2",
        "values": [0.2, 0.3, 0.4, ...],
        "metadata": {"title": "Another Document"}
    },
    {
        "id": "doc3",
        "values": [0.3, 0.4, 0.5, ...],
        "metadata": {"title": "Third Document"}
    }
]

client.batch_insert_vectors(
    collection_name="my_embeddings",
    vectors=vectors
)
```

### Searching Vectors

Perform similarity search:

```python
# Search for similar vectors
results = client.search(
    collection_name="my_embeddings",
    query_vector=[0.1, 0.2, 0.3, ...],
    limit=5,
    include_metadata=True
)

# Process search results
for result in results:
    vector_id = result["id"]
    similarity = result["similarity"]
    metadata = result["metadata"]
    
    print(f"Vector ID: {vector_id}")
    print(f"Similarity: {similarity}")
    print(f"Metadata: {metadata}")
```

### Using Transactions

Perform operations within a transaction:

```python
# Start a transaction
transaction = client.start_transaction(collection_name="my_embeddings")

try:
    # Perform operations within the transaction
    client.insert_vector(
        collection_name="my_embeddings",
        vector_id="doc4",
        vector=[0.4, 0.5, 0.6, ...],
        metadata={"title": "Fourth Document"},
        transaction_id=transaction["transaction_id"]
    )
    
    # Commit the transaction
    client.commit_transaction(
        collection_name="my_embeddings",
        transaction_id=transaction["transaction_id"]
    )
except Exception as e:
    # Abort the transaction on error
    client.abort_transaction(
        collection_name="my_embeddings",
        transaction_id=transaction["transaction_id"]
    )
    raise e
```

### Creating and Managing Indexes

Create and manage search indexes:

```python
# Create an HNSW index
client.create_index(
    collection_name="my_embeddings",
    index_name="hnsw_index",
    index_type="hnsw",
    parameters={
        "M": 16,
        "efConstruction": 200,
        "efSearch": 100,
        "metric": "cosine"
    }
)

# List indexes
indexes = client.list_indexes(collection_name="my_embeddings")
```

## Advanced Usage

### Filtering Search Results

Filter search results based on metadata:

```python
# Search with metadata filters
results = client.search(
    collection_name="my_embeddings",
    query_vector=[0.1, 0.2, 0.3, ...],
    filter={
        "category": "documentation",
        "tags": {"$in": ["example"]}
    },
    limit=5
)
```

### Hybrid Search

Combine vector search with text search:

```python
# Hybrid search
results = client.hybrid_search(
    collection_name="my_embeddings",
    query_vector=[0.1, 0.2, 0.3, ...],
    query_text="sample documentation",
    hybrid_weight=0.7,  # 70% vector search, 30% text search
    limit=5
)
```

### Batch Operations

Perform batch operations for better performance:

```python
# Generate some example vectors
import numpy as np

vectors = []
for i in range(1000):
    # Create a random 768-dimensional vector
    vector_values = np.random.rand(768).tolist()
    
    vectors.append({
        "id": f"batch_doc_{i}",
        "values": vector_values,
        "metadata": {
            "batch_id": i // 100,
            "timestamp": "2024-11-23T12:00:00Z"
        }
    })

# Insert vectors in batches
batch_size = 100
for i in range(0, len(vectors), batch_size):
    batch = vectors[i:i+batch_size]
    
    # Start a transaction
    transaction = client.start_transaction(collection_name="my_embeddings")
    
    try:
        # Insert batch
        client.batch_insert_vectors(
            collection_name="my_embeddings",
            vectors=batch,
            transaction_id=transaction["transaction_id"]
        )
        
        # Commit transaction
        client.commit_transaction(
            collection_name="my_embeddings",
            transaction_id=transaction["transaction_id"]
        )
        
        print(f"Inserted batch {i//batch_size + 1}/{len(vectors)//batch_size + 1}")
    except Exception as e:
        # Abort transaction on error
        client.abort_transaction(
            collection_name="my_embeddings",
            transaction_id=transaction["transaction_id"]
        )
        print(f"Error inserting batch: {e}")
```

## Error Handling

Implement proper error handling in your applications:

```python
from cosdata.exceptions import (
    CosdataConnectionError,
    CosdataAuthenticationError,
    CosdataResourceNotFoundError,
    CosdataTransactionError
)

try:
    # Perform Cosdata operations
    client.search(
        collection_name="non_existent_collection",
        query_vector=[0.1, 0.2, 0.3, ...]
    )
except CosdataResourceNotFoundError as e:
    print(f"Collection not found: {e}")
except CosdataAuthenticationError as e:
    print(f"Authentication error: {e}")
except CosdataConnectionError as e:
    print(f"Connection error: {e}")
except CosdataTransactionError as e:
    print(f"Transaction error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
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

- Keep transactions short-lived
- Always commit or abort transactions
- Implement proper error handling and retry logic

### Performance Optimization

- Use appropriate batch sizes (100-1000 vectors)
- Create indexes for frequently searched collections
- Monitor and optimize query performance

## Reference

For more detailed information, refer to:
- [REST API Documentation](/api/documentation/)
- [cosQuery Language](/api/cosquery/)
- [GitHub Repository](https://github.com/cosdata/cosdata-sdk-python) 