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
start-cosdata

# The 'start-cosdata' command is installed globally and available in your PATH after installation.
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

> **Note:**
> If you installed Cosdata from source, a default `config.toml` is already present in the `cosdata` directory. You only need to edit this file to customize your configuration. For Docker or other install methods, you may need to create or mount your own `config.toml` as shown below.

Create or edit a `config.toml` file:

```toml
[server]
host = "127.0.0.1"
port = 8443
mode = "http"   # Options: "http" or "https"
# 443 = official HTTPS for production
# 8443 = unofficial HTTPS for dev/testing/alternative endpoints
# 80 is the standard port for HTTP
# 8080 is the common alternative port for HTTP

admin_key = "your-admin-key"
data_dir = "/path/to/data"
log_level = "info"
```
Then run Cosdata with:

```bash
start-cosdata --config config.toml
```

> **Recommended:**
> Use the provided script to start Cosdata:
>
>   ```bash
>   start-cosdata
>   ```
>
> The 'start-cosdata' command is available globally in your PATH after installation and securely handles your admin key.

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
from cosdata import Client
import numpy as np

# Connect to the Cosdata server
client = Client(
  host="http://127.0.0.1:8443",  # or your server address
  username="admin",               # your username
  password="admin",               # your password
  verify=False                     # set to True if using HTTPS with valid certs
)

# Create a collection for document embeddings
collection = client.create_collection(
  name="documents",
  dimension=768,  # 768-dimensional vectors
  description="Collection for document embeddings"
)

# Generate and insert vectors
def generate_random_vector(id: int, dimension: int) -> dict:
  values = np.random.uniform(-1, 1, dimension).tolist()
  return {
    "id": f"doc_{id}",
    "dense_values": values,
    "metadata": {
      "title": f"Document {id}",
      "category": "technology"
    }
  }

vectors = [generate_random_vector(i, 768) for i in range(10)]

# Add vectors using a transaction
with collection.transaction() as txn:
  for v in vectors:
    txn.upsert_vector(v)

# Search for similar vectors
results = collection.search.dense(
  query_vector=vectors[0]["dense_values"],
  top_k=5,
  return_raw_text=True
)

# Print results
for result in results["results"]:
  print(f"Vector ID: {result['id']}")
  print(f"Similarity: {result['similarity']}")
  print(f"Metadata: {result['metadata']}")
```

## Verifying Your Installation

To verify that Cosdata is running correctly, you can use the health check endpoint:

```bash
curl http://localhost:8443/health
```

If everything is working, you should receive a `200 OK` response.


## Running Cosdata as a Service (systemd)

To run Cosdata in the background and ensure it restarts automatically, you can use a systemd service:

Create a file at `/etc/systemd/system/cosdata.service` with the following content:

```ini
[Unit]
Description=Cosdata Server
After=network.target

[Service]
ExecStart=/path/to/your/cosdata
WorkingDirectory=/path/to/your/
Restart=always
RestartSec=3
Environment=RUST_LOG=info
User=your-username
Group=your-username

[Install]
WantedBy=multi-user.target
```

**Explanation:**
- `ExecStart`: Full path to your compiled Cosdata server binary.
- `WorkingDirectory`: Directory where your server binary is (helps if it reads config files relative to cwd).
- `Restart=always`: Restarts automatically if it crashes.
- `RestartSec=3`: Wait 3 seconds before restarting.
- `Environment=RUST_LOG=info`: Optional, enables info-level logging.
- `User` and `Group`: Runs under your username (never run as root unless necessary).

**Enable and start the service:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable cosdata
sudo systemctl start cosdata
```

**Check status:**

```bash
sudo systemctl status cosdata
```

**View logs:**

```bash
journalctl -u cosdata -f
```

*(Add `StandardOutput` and `StandardError` lines to the service file if you want to capture logs to a file instead of using `journalctl`.)* 

## Next Steps

Now that you have Cosdata up and running, you can:

- Explore the [API Reference](/api/overview/) to learn how to interact with Cosdata
- Learn about [Search Relevance](/features/search-relevance/) features
- Discover how to optimize [Performance](/features/performance/)
- Try out the [Cos Graph Query Language](/api/cosquery/) for complex queries
- Use the [Python SDK](/api/python-sdk/) to build applications with Cosdata
- Contribute to the project on <a href="https://github.com/cosdata/cosdata" target="_blank" rel="noopener noreferrer">GitHub</a>
- Join our <a href="https://discord.gg/XMdtTBrtKT" target="_blank" rel="noopener noreferrer">Discord community</a> to connect with other Cosdata users