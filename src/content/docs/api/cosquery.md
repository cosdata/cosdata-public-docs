---
title: cosQuery Language
description: Learn how to use the cosQuery language to interact with Cosdata
---

# cosQuery Language

cosQuery is a powerful query language designed specifically for Cosdata to enable complex vector search operations.

## Basic Syntax

cosQuery uses a JSON-like syntax for defining queries:

  ```json
  {
    "collection": "my_collection",
    "vector": [0.1, 0.2, 0.3, ...],
    "limit": 10,
    "filter": {
      "category": "electronics",
      "price": {"$lt": 1000}
    }
  }
  ```

## Query Components

### Vector Search

The core of cosQuery is vector similarity search:

  ```json
  {
    "collection": "products",
    "vector": [0.1, 0.2, 0.3, ...],
    "limit": 10
  }
  ```

### Filtering

You can narrow down results using metadata filters:

  ```json
  {
    "collection": "products",
    "vector": [0.1, 0.2, 0.3, ...],
    "filter": {
      "category": "electronics",
      "brand": {"$in": ["Apple", "Samsung", "Google"]},
      "price": {"$gte": 500, "$lte": 1500}
    }
  }
  ```

### Hybrid Search

Combine vector search with text search for better results:

  ```json
  {
    "collection": "articles",
    "vector": [0.1, 0.2, 0.3, ...],
    "text": "machine learning applications",
    "hybrid_weight": 0.7
  }
  ```

## Advanced Features

### Aggregations

Perform aggregations on search results:

  ```json
  {
    "collection": "products",
    "vector": [0.1, 0.2, 0.3, ...],
    "aggregations": [
      {
        "field": "category",
        "type": "terms"
      },
      {
        "field": "price",
        "type": "range",
        "ranges": [
          {"from": 0, "to": 100},
          {"from": 100, "to": 500},
          {"from": 500}
        ]
      }
    ]
  }
  ```

### Graph Traversal

Navigate through connected entities:

  ```json
  {
    "collection": "users",
    "vector": [0.1, 0.2, 0.3, ...],
    "traverse": {
      "edge": "purchased",
      "target": "products",
      "depth": 2
    }
  }
  ```

## Examples

### Product Recommendation

  ```json
  {
    "collection": "products",
    "vector": [0.1, 0.2, 0.3, ...],
    "filter": {
      "in_stock": true
    },
    "limit": 5
  }
  ```

### Semantic Document Search

  ```json
  {
    "collection": "documents",
    "vector": [0.1, 0.2, 0.3, ...],
    "text": "climate change solutions",
    "hybrid_weight": 0.6,
    "filter": {
      "published_date": {"$gte": "2020-01-01"}
    }
  }
  ```
