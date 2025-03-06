---
title: Benchmarks
description: Performance benchmarks comparing Cosdata with other vector databases
---

Cosdata delivers exceptional performance compared to other vector databases. The following benchmarks demonstrate Cosdata's capabilities in real-world scenarios.

## Benchmark Comparison

These benchmarks were conducted using the [Qdrant benchmark suite](https://qdrant.tech/benchmarks/), which provides standardized tests for vector database performance.

### Key Performance Metrics

| Metric | Cosdata | Next Best Competitor | Improvement |
|--------|---------|----------------------|-------------|
| Requests Per Second (RPS) | 1773 | 1238 (Qdrant) | 43% faster |
| Average Recall@5 | 98.08% | Similar (0.97-0.99) | Comparable accuracy |
| Upload + Index Time | 14.98 minutes | 13.04 minutes (Weaviate) | Competitive |
| Precision | 0.98 | 0.97-0.99 | Industry standard |

The complete benchmark data comparing all tested vector databases is available on the [Qdrant benchmarks page](https://qdrant.tech/benchmarks/).

## Additional Cosdata Performance Tests

We've conducted additional benchmarks on different hardware configurations and with various parameter settings to demonstrate Cosdata's versatility:

### Million Embeddings Test (768 dimensions)

Testing environment:
- Dataset: 1 million text embeddings (768 dimensions)
- Hardware: x86 machine, 4C/8T, 32 GB RAM

| Configuration | Upload + Index Time | Average Recall@5 | RPS |
|---------------|---------------------|------------------|-----|
| High Recall<br>`ef_construction: 128, ef_search: 128`<br>`neighbors: 16, layer_0_neighbors: 32` | 9.23 minutes | 97.60% | 2274.31 |
| Balanced<br>`ef_construction: 64, ef_search: 128`<br>`neighbors: 16, layer_0_neighbors: 32` | 8.64 minutes | 98.20% | 2242.33 |
| Fast Search<br>`ef_construction: 64, ef_search: 64`<br>`neighbors: 16, layer_0_neighbors: 32` | 7.80 minutes | 95.60% | 2621.02 |
| Maximum Speed<br>`ef_construction: 32, ef_search: 32`<br>`neighbors: 16, layer_0_neighbors: 32` | 7.05 minutes | 94.80% | 2959.85 |

### Performance Insights

These additional tests reveal important characteristics of Cosdata:

1. **Configurable Performance Tradeoffs**: By adjusting parameters like `ef_construction` and `ef_search`, you can optimize for either higher recall accuracy or faster indexing and search.

2. **Hardware Scaling**: Performance scales well with hardware resources. The 4-core machine achieved nearly 3000 RPS with optimized settings.

3. **Dimension Handling**: Cosdata efficiently handles both medium (768) and high (1536) dimensional vectors with excellent performance.

## What These Results Mean

These benchmarks demonstrate Cosdata's exceptional performance characteristics:

1. **High Throughput**: With up to 2959 RPS on modest hardware, Cosdata outperforms other vector databases, handling significantly more queries per second than competitors.

2. **Excellent Recall with High Precision**: Cosdata achieves 98%+ recall with high precision across configurations, providing accurate search results without sacrificing performance.

3. **Efficient Indexing**: Cosdata's indexing performance balances speed and quality, creating efficient indexes in minutes rather than hours.

4. **Flexible Configuration**: The ability to tune parameters allows you to optimize for your specific use case, whether you need maximum accuracy or maximum throughput.

## Benchmark Methodology

The benchmarks were conducted using:

- **Datasets**: 
  - dbpedia-openai-1M-1536-angular (1 million 1536-dimensional OpenAI embeddings)
  - million-text-embeddings (1 million 768-dimensional text embeddings)
- **Hardware**: Standardized cloud instances and on-premise hardware with consistent specifications
- **Metrics**: 
  - Upload time: Time to upload vectors
  - Index time: Time to build search indexes
  - Recall@5: Percentage of correct results in top 5 results
  - RPS: Requests per second (throughput)
  - Precision: Accuracy of results compared to ground truth

## Learn More

- [Performance Optimization](/features/performance/) - Learn how to optimize Cosdata for your specific use case
- [Scaling Guidelines](/features/performance/#scaling-guidelines) - Best practices for scaling Cosdata 