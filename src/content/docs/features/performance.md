---
title: Performance
description: Learn about Cosdata's performance characteristics and optimization techniques
---

Cosdata is designed from the ground up for exceptional performance, even at scale. Our benchmarks demonstrate industry-leading throughput and efficiency.

## Benchmark Results

In independent benchmarks conducted using the [Qdrаnt benchmark suite](https://qdrant.tech/benchmarks/), Cosdata outperforms other vector databases:

| Metric | Value | Comparison |
|--------|-------|------------|
| Requests Per Second | 1773 | 43% faster than the next fastest option |
| Average Recall@5 | 98.08% | With 0.98 precision |
| Upload + Index Time | 14.98 minutes | For 1M vectors with 1536 dimensions |

For complete benchmark details, see our [Benchmarks](/features/benchmarks/) page.

## Optimization Techniques

### HNSW Indexing

Cosdata uses Hierarchical Navigable Small World (HNSW) graphs for approximate nearest neighbor search, providing:

- Logarithmic search complexity
- Configurable precision/speed tradeoff
- Efficient memory usage

### Parallel Processing

Cosdata leverages multi-threading and SIMD instructions to maximize performance:

- Parallel query processing
- Vectorized distance calculations
- Efficient memory access patterns

### Smart Quantization

Reduce memory usage while maintaining search quality:

- Scalar quantization for moderate compression
- Product quantization for higher compression needs
- Configurable precision/memory tradeoffs

## Scaling Guidelines

For optimal performance as your data grows:

1. **Hardware Recommendations**:
   - 16+ CPU cores
   - 64GB+ RAM
   - NVMe SSD storage

2. **Configuration Tuning**:
   - Adjust HNSW parameters (M, efConstruction, efSearch)
   - Optimize batch sizes for your workload
   - Configure memory limits appropriately

## Performance Monitoring

Cosdata provides built-in performance monitoring tools:

```bash
# Get performance metrics
curl http://localhost:8443/metrics
```

Key metrics to monitor:

- Query latency (p95, p99)
- Throughput (requests per second)
- Memory usage
- Index size

## Performance Optimization Tips

### Batch Operations

Use batch operations for better throughput:

```python
# Batch insertion is more efficient than individual inserts
client.batch_insert_vectors(
    collection_name="my_collection",
    vectors=batch_vectors  # List of vectors
)
```

### Index Tuning

Optimize your indexes for your specific workload:

```python
# For higher recall at the cost of indexing time
client.create_index(
    collection_name="my_collection",
    index_name="high_recall_index",
    index_type="hnsw",
    parameters={
        "M": 32,              # Higher M = more connections = better recall
        "efConstruction": 200, # Higher efConstruction = better index quality
        "efSearch": 100,      # Higher efSearch = better search quality
        "metric": "cosine"
    }
)

# For faster indexing and lower memory usage
client.create_index(
    collection_name="my_collection",
    index_name="fast_index",
    index_type="hnsw",
    parameters={
        "M": 16,              # Lower M = fewer connections = faster indexing
        "efConstruction": 100, # Lower efConstruction = faster indexing
        "efSearch": 50,       # Lower efSearch = faster search
        "metric": "cosine"
    }
)
```

### Vector Normalization

Normalize vectors before insertion for better search quality:

```python
import numpy as np

def normalize_vector(vector):
    """Normalize a vector to unit length."""
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return vector / norm

# Normalize before insertion
normalized_vector = normalize_vector(my_vector)
client.insert_vector(
    collection_name="my_collection",
    vector_id="doc1",
    vector=normalized_vector.tolist()
)
```
