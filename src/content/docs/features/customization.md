---
title: Customization
description: Learn how to customize Cosdata for your specific use cases
---

# Customization

Cosdata offers extensive customization options to tailor the system to your specific requirements.

## Vector Configurations

### Dimension Settings

Cosdata supports vectors of various dimensions:

- Low-dimensional (32-256): Ideal for simple embeddings
- Medium-dimensional (256-768): Suitable for most language models
- High-dimensional (768+): For advanced embedding models

### Distance Metrics

Choose from multiple distance metrics:

- Euclidean (L2)
- Cosine Similarity
- Dot Product
- Manhattan (L1)

## Index Tuning

### HNSW Parameters

Fine-tune your HNSW indexes:

  ```python
  # Example: Creating an optimized HNSW index
  client.create_index(
      collection_name="my_collection",
      index_name="optimized_index",
      index_type="hnsw",
      parameters={
          "M": 16,              # Number of connections per layer
          "efConstruction": 200, # Construction time/quality trade-off
          "efSearch": 100,      # Search time/quality trade-off
          "metric": "cosine"    # Distance metric
      }
  )
  ```

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

## Deployment Options

Cosdata can be deployed in various configurations:

- **Standalone**: Single-node deployment for simplicity
- **Distributed**: Multi-node deployment for high availability
- **Hybrid**: Combination of on-premise and cloud resources
