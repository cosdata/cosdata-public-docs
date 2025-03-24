---
title: Installation & Quick Start
description: Install Cosdata and get up and running quickly with your first vector database
---

This guide will walk you through installing Cosdata and running your first test to verify everything is working correctly.

## Installation Options

### 1. Quick Install (Linux)
For a simple one-step installation on Linux, run:
```bash
curl -sL https://cosdata.io/install.sh | bash
```

This script will handle all dependencies and set up Cosdata automatically.

### 2. Docker Install (Mac & Windows)
For **Mac & Windows** users, we recommend using our Docker-based installation:

1. Ensure **Docker** is installed and running
2. Pull the latest image from Docker Hub:
```bash
docker pull cosdatateam/cosdata:latest
```

3. Run the container:
```bash
docker run -it \
  --name cosdata-server \
  -p 8443:8443 \
  -p 50051:50051 \
  cosdatateam/cosdata:latest
```

The server will be available at `http://localhost:8443`.

### 3. Build from Source (Development)

#### Prerequisites

Before building from source, ensure you have:
- Git
- Rust (version 1.81.0 or higher)
- Cargo (Rust's package manager)
- C++ compiler (GCC 4.8+ or Clang 3.4+)
- Python 3.8+ (for running test scripts)

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/cosdata/cosdata.git
cd cosdata

# Build the project
cargo build --release

# Run Cosdata
./target/release/cosdata --admin-key your_admin_key
```

You should see output similar to:

```
[2025-02-21T02:30:29Z INFO  cosdata::web_server] starting HTTP server at http://127.0.0.1:8443
[2025-02-21T02:30:29Z INFO  actix_server::builder] starting 20 workers
[2025-02-21T02:30:29Z INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[2025-02-21T02:30:29Z INFO  actix_server::server] starting service: "actix-web-service-127.0.0.1:8443", workers: 20, listening on: 127.0.0.1:8443
[2025-02-21T02:30:29Z INFO  cosdata::grpc::server] gRPC server listening on [::1]:50051
```

## Configuration Options

Cosdata can be configured using command-line arguments or a configuration file:

### Command-line Arguments

```bash
cosdata --admin-key <your-admin-key> --port 8443 --data-dir /path/to/data
```

### Configuration File

Create a `config.toml` file:

```toml
admin_key = "your-admin-key"
port = 8443
data_dir = "/path/to/data"
log_level = "info"
```

Then run Cosdata with:

```bash
cosdata --config config.toml
```

## Quick Start: Testing Your Installation

Now that Cosdata is running, let's verify the installation by running a simple test script.

### Setting Up the Test Environment

1. **Install Python Dependencies**

   ```bash
   # Navigate to the test directory
   cd tests
   
   # Install dependencies using uv (or pip)
   uv sync
   ```

2. **Run the Basic Test Script**

   The `test.py` script performs the following:
   
   - Creates a test collection and a Dense HNSW Index
   - Submits batches of random vectors in a transaction
   - Uses about 10% of the vectors as query vectors by adding small perturbations
   - Issues queries to the server and performs a brute force search locally
   - Compares the results

   ```bash
   uv run test.py
   ```

   If successful, you should see output confirming that the test passed, with metrics on query performance.

### Testing with Real-World Datasets

For a more comprehensive test with real-world data:

```bash
uv run test-dataset.py
```

This script loads sample datasets and performs similarity searches to demonstrate Cosdata's capabilities in a realistic scenario.

## Creating Your First Collection

Let's create a simple collection and add some vectors using the Python SDK:

```python
from cosdata import CosdataClient

# Connect to the Cosdata server
client = CosdataClient(
    host="localhost",
    port=8443,
    admin_key="your-admin-key"
)

# Create a collection for document embeddings
collection = client.create_collection(
    name="documents",
    description="Collection for document embeddings",
    dense_vector={
        "enabled": True,
        "auto_create_index": True,
        "dimension": 768
    }
)

# Add some vectors
client.insert_vector(
    collection_name="documents",
    vector_id="doc1",
    vector=[0.1, 0.2, 0.3, ...],  # 768-dimensional vector
    metadata={
        "title": "Introduction to Vector Databases",
        "category": "technology"
    }
)

# Search for similar vectors
results = client.search(
    collection_name="documents",
    query_vector=[0.1, 0.2, 0.3, ...],
    limit=5,
    include_metadata=True
)

# Print results
for result in results:
    print(f"Document: {result['id']}")
    print(f"Similarity: {result['similarity']}")
    print(f"Metadata: {result['metadata']}")
```

## Verifying Your Installation

To verify that Cosdata is running correctly, you can use the health check endpoint:

```bash
curl http://localhost:8443/health
```

If everything is working, you should receive a `200 OK` response.

## Next Steps

Now that you have Cosdata up and running, you can:

- Explore the [API Reference](/api/overview/) to learn how to interact with Cosdata
- Learn about [Search Relevance](/features/search-relevance/) features
- Discover how to optimize [Performance](/features/performance/)
- Try out the [Cos Graph Query Language](/api/cosquery/) for complex queries
- Use the [Python SDK](/api/python-sdk/) to build applications with Cosdata
- Contribute to the project on <a href="https://github.com/cosdata/cosdata" target="_blank" rel="noopener noreferrer">GitHub</a>
- Join our <a href="https://discord.gg/XMdtTBrtKT" target="_blank" rel="noopener noreferrer">Discord community</a> to connect with other Cosdata users 