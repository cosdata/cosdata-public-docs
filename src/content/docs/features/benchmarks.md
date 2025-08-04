---
title: Cosdata Vector Database Benchmarks - Complete Setup Guide
---


> **What is this?** This guide helps you test Cosdata's performance on your computer using industry-standard benchmarks for both vector similarity search and text search capabilities.

## Before You Start

### Required Software
Make sure you have these installed on your computer:

| Software         | Purpose                 | Installation Check     |
| ---------------- | ----------------------- | ---------------------- |
| **Rust & Cargo** | Compile and run Cosdata | Run `cargo --version`  |
| **Python**       | Run benchmark scripts   | Run `python --version` |
| **uv**           | Python package manager  | Run `uv --version`     |
| **Git**          | Download the code       | Run `git --version`    |

---

## Step 1: Get the Code

Start by cloning the cosdata repository.

```bash
git clone https://github.com/cosdata/cosdata.git
cd cosdata
```

---

## Step 2: Start the Cosdata Server

> **Important:** The server must be running for all benchmarks. Keep this terminal open throughout your testing.

### 2.1 Clean Start (Recommended)
If you've run tests before, start fresh:
```bash
rm -rf data
```

### 2.2 Choose Your Admin Key
Pick a secure password/key that you'll use throughout the session. For example: `my-secure-key-123`

### 2.3 Start the Server
```bash
cargo run --release -- --admin-key "my-secure-key-123"
```
*Replace `my-secure-key-123` with your chosen key*

### 2.4 Confirm Your Key
When prompted, enter the same key again:
```
Re-enter admin key: my-secure-key-123
```

### 2.5 Success Confirmation
You should see output:
```
Admin key confirmed successfully.
[2025-08-04T04:47:35Z WARN  cosdata::web_server] server.mode=http is not recommended in production
[2025-08-04T04:47:35Z INFO  cosdata::web_server] starting HTTP server at http://127.0.0.1:8443
[2025-08-04T04:47:35Z INFO  actix_server::builder] starting 10 workers
[2025-08-04T04:47:35Z INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[2025-08-04T04:47:35Z INFO  actix_server::server] starting service: "actix-web-service-127.0.0.1:8443", workers: 10, listening on: 127.0.0.1:8443
```

> **✅ Server is ready!** Leave this terminal running and open a new one for the next steps.

---

## Step 3: Choose Your Benchmark Type

Cosdata supports two types of search benchmarks:

| Benchmark Type   | What It Tests                         | Use Cases                                    |
| ---------------- | ------------------------------------- | -------------------------------------------- |
| **Dense Vector** | Similarity search with AI embeddings  | Semantic search, recommendation systems, RAG |
| **BM25**         | Traditional keyword-based text search | Document search, information retrieval       |

Choose one to start with, or run both for comprehensive testing.

---

## Option A: Dense Vector Benchmarks

> **What this tests:** How fast Cosdata can find similar vectors (like finding related documents based on meaning)

### A.1 Navigate to Tests Directory
Open a **new terminal** (keep the server running in the first one):
```bash
cd cosdata/tests
```

### A.2 Run the Benchmark
```bash
uv run test-dataset.py
```

### A.3 Enter Your Admin Key
When prompted, enter the same key you used for the server:
```
Enter your database password: my-secure-key-123
```

### A.4 Choose a Dataset

You'll see these options:

| Option | Dataset                    | Size            | Best For                       |
| ------ | -------------------------- | --------------- | ------------------------------ |
| **1**  | cohere-wiki-embedding-100k | 100k vectors    | **Recommended for most users** |
| **2**  | million-text-embeddings    | 1M vectors      | Heavy testing                  |
| **3**  | arxiv-embeddings-ada-002   | Research papers | Academic use cases             |
| **4**  | dbpedia-entities-openai-1M | 1M entities     | Knowledge graphs               |
| **5**  | glove-100                  | Word embeddings | NLP applications               |

**Recommendation:** Start with option `1` (cohere-wiki-embedding-100k)

### A.5 Choose Test Mode
```
Choose test mode:
1) Quick test (smaller dataset, faster)    ← Good for initial testing
2) Full test (complete dataset, slower)    ← Best for real benchmarks
```

**Recommendation:** Choose `2` for comprehensive results

### A.6 Understanding Dense Vector Results

Your results will look like this:
```
Latency Statistics (ms):
Average: 9.74        ← Average response time
p50: 9.86           ← 50% of queries faster than this
p90: 10.59          ← 90% of queries faster than this
p95: 11.11          ← 95% of queries faster than this

Final Matching Results:
Average Recall@5: 95.60%    ← Accuracy: found correct results 95.6% of the time

RPS Test Results:
Requests Per Second (RPS): 3689.67    ← Server can handle 3,690 queries/second
Success Rate: 100.00%                 ← No failed queries
```

**What good results look like:**
- ✅ **Latency:** Under 50ms for most applications
- ✅ **Recall@5:** Above 90% shows high accuracy
- ✅ **RPS:** Higher is better (depends on your hardware)
- ✅ **Success Rate:** Should be 100%

---

## Option B: BM25 Text Search Benchmarks

> **What this tests:** How well Cosdata performs traditional keyword-based text search

### B.1 Navigate to Tests Directory
Open a **new terminal** (keep the server running):
```bash
cd cosdata/tests
```

### B.2 Run the BM25 Benchmark
```bash
uv run test-tf-idf-ndcg.py
```

### B.3 Choose a Dataset

| Option | Dataset          | Description                      | Domain             | Difficulty             |
| ------ | ---------------- | -------------------------------- | ------------------ | ---------------------- |
| **1**  | trec-covid       | COVID-19 research papers         | Medical/Scientific | Medium                 |
| **2**  | fiqa             | Financial question answering     | Finance            | Medium                 |
| **3**  | arguana          | Argument search and reasoning    | **General*         | **Easy (Recommended)** |
| **4**  | webis-touche2020 | Comparative questions            | General            | Medium                 |
| **5**  | quora            | Question similarity matching     | General            | Easy                   |
| **6**  | scidocs          | Scientific document citations    | Academic           | Hard                   |
| **7**  | scifact          | Scientific fact verification     | Scientific         | Medium                 |
| **8**  | nq               | Natural Questions (Google)       | General Knowledge  | Medium                 |
| **9**  | msmarco          | Microsoft web search             | Web Search         | Medium                 |
| **10** | fever            | Fact extraction and verification | General            | Medium                 |
| **11** | climate-fever    | Climate change fact checking     | Environmental      | Hard                   |

**Recommendation:** Start with option `3` (arguana)

### B.4 Enter Your Admin Key
```
Enter admin password: my-secure-key-123
```

### B.5 Understanding BM25 Results

Your results will show:
```
NDCG@10: 0.39585              ← Quality score (0-1, higher is better)
Recall@10: 0.6458             ← Found correct results 64.58% of the time
Queries Per Second (QPS): 1432.46    ← Server handled 1,432 queries/second
p50 latency: 10.21ms          ← Half of queries completed under 10.21ms
p95 latency: 15.32ms          ← 95% of queries completed under 15.32ms
```

**What good results look like:**
- ✅ **NDCG@10:** Above 0.3 is good, above 0.5 is excellent
- ✅ **Recall@10:** Above 50% shows decent retrieval
- ✅ **QPS:** Higher throughput is better
- ✅ **Low latency:** Under 100ms for most applications

---


## Interpreting Your Results

### Comparing with Published Benchmarks & Leaderboard

The official Cosdata benchmarks were run on:
- **CPU:** 8 vCPUs
- **RAM:** 32GB
- **Setup:** Optimized configuration

Your results will likely be different based on:
- Your CPU speed and core count
- Available RAM
- Other running programs

---

### See the Official Leaderboard & Results

For the latest official Cosdata benchmark results and leaderboard, visit:

[Cosdata Benchmarks & Leaderboard](https://www.cosdata.io/resources/benchmarks)

This page provides up-to-date performance comparisons, hardware details, and ranking of Cosdata against other solutions. Use it as a reference to compare your own results and see how Cosdata performs in real-world scenarios.

---

## Troubleshooting

### Common Issues

- **Server not starting:** Ensure no other service is using port 8443
- **Authentication errors:** Make sure you're using the exact same admin key in both terminals
- **Missing dependencies:** Install Rust, Python, and uv if not already available

### Getting Help

1. **Check the server terminal** for error messages
2. **Verify your admin key** matches exactly
3. **Try a smaller dataset** if running out of resources
4. **Restart the server** between different tests

---

## Next Steps

### Running Multiple Tests
1. Complete one benchmark type
2. Stop the server (`Ctrl+C`)
3. Clean the data: `rm -rf data`
4. Restart the server
5. Run the other benchmark type

### Optimizing Performance
- Close unnecessary applications
- Increase system RAM if possible
- Run during low system activity

---

## Stopping Everything

When you're done testing:

1. **Stop benchmarks:** `Ctrl+C` in the test terminal
2. **Stop the server:** `Ctrl+C` in the server terminal
3. **Clean up (optional):** `rm -rf data` to save disk space