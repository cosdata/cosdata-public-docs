---
title: Quick Start
description: Get up and running with Cosdata quickly
---

# Quick Start Guide

This guide will help you quickly get started with Cosdata by running a simple test script.

## Testing Cosdata Server

After installing and running the Cosdata server, you can test it using the provided test scripts.

### Using test.py

The `test.py` script performs the following:

1. Creates a test collection and a Dense HNSW Index
2. Submits batches of random vectors in a transaction
3. Uses about 10% of the vectors as query vectors by adding small perturbations
4. Issues queries to the server and performs a brute force search locally
5. Compares the results

To run the test:

  ```bash
  # Install dependencies
  uv sync

  # Run the test script
  uv run test.py
  ```

### Using Real-World Datasets

For testing with real-world datasets, you can use the `test-dataset.py` script:

  ```bash
  uv run test-dataset.py
  ```

## Next Steps

Once you've verified that Cosdata is working correctly, you can:

- Explore the [API Reference](/api/overview/) to learn how to interact with Cosdata
- Learn about [Search Relevance](/features/search-relevance/) features
- Discover how to optimize [Performance](/features/performance/)
