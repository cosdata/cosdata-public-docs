---
title: Customization
description: Learn how to customize Cosdata for your specific use cases
---

Cosdata offers extensive customization options to tailor the system to your specific requirements.

## Vector Configurations

### Dimension Settings

Cosdata supports vectors of various dimensions:

- Low-dimensional (32-256): Ideal for simple embeddings
- Medium-dimensional (256-768): Suitable for most language models
- High-dimensional (768+): For advanced embedding models

When creating a collection, you can specify the exact dimension:

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
    }
}
```

### Distance Metrics

Choose from multiple distance metrics:

- Euclidean (L2)
- Cosine Similarity
- Dot Product
- Manhattan (L1)

When creating an index, you can specify the distance metric:

```json
{
    "collection_name": "testdb",
    "name": "testdb_index",
    "distance_metric_type": "cosine",
    "quantization": "scalar",
    "data_type": "u8",
    "index_type": "hnsw"
}
```

## Index Tuning

### HNSW Parameters

Fine-tune your HNSW indexes with these advanced parameters:

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

Key parameters include:
- `num_layers`: Controls the number of layers in the HNSW graph
- `max_cache_size`: Maximum number of vectors to cache for performance

### Filtering Options

Implement custom filters to narrow search results:

```python
# Example: Searching with metadata filters
results = client.search(
    collection_name="products",
    query_vector=embedding,
    filter={
        "category": "electronics",
        "price": {"$lt": 1000}
    },
    limit=10
)
```

## Transaction Management

Cosdata provides ACID transaction guarantees for vector operations, allowing you to:

1. Group related operations in a single transaction
2. Ensure atomicity across multiple vector operations
3. Maintain consistency during concurrent access

### Transaction Best Practices

For optimal performance:

1. Keep transaction duration short
2. Batch vector operations (100-1000 vectors per batch)
3. Always commit or abort transactions to release resources
4. Implement proper error handling with retry logic

## Deployment Options

Cosdata can be deployed in various configurations:

- **Standalone**: Single-node deployment for simplicity
- **Distributed**: Multi-node deployment for high availability
- **Hybrid**: Combination of on-premise and cloud resources

### Performance Optimization

For production deployments, consider these optimization strategies:

1. Use parallel requests for large datasets
2. Monitor response times and transaction timeouts
3. Index important vector fields
4. Normalize vectors to unit length (values between -1.0 and 1.0)
5. Choose appropriate similarity metrics for your use case
