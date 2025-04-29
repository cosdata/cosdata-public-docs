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

To start Cosdata, simply run:
```bash
start-cosdata
```
You will be prompted to enter your admin key on first run.

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
You will be prompted to enter your admin key when the container starts.

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
cargo run --release -- --admin-key your-admin-key
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

Cosdata is configured using a `config.toml` file, which is included by default in your installation. **We recommend not editing this file unless you are an expert or have a specific need.** Most users will not need to change any settings.

Below is a reference of the available configuration options, as defined in `config.toml`:

  ```toml
  upload_threshold = 100
  upload_process_batch_size = 1000
  num_regions_to_load_on_restart = 10000
  inverted_index_data_file_parts = 8
  sparse_raw_values_reranking_factor = 5
  rerank_sparse_with_raw_values = false
  tree_map_serialized_parts = 8

  [server]
  host = "127.0.0.1"
  port = 8443
  mode = "http"   # Options: "http" or "https"

  [thread_pool]
  pool_size = 64

  [hnsw]
  default_neighbors_count = 32
  default_level_0_neighbors_count = 64
  default_ef_construction = 128
  default_ef_search = 256
  default_num_layer = 9
  default_max_cache_size = 1000

  [server.ssl]
  cert_file = "/etc/ssl/certs/cosdata-ssl.crt"
  key_file = "/etc/ssl/private/cosdata-ssl.key"

  [search]
  shortlist_size = 64
  early_terminate_threshold = 0.0

  [indexing]
  clamp_margin_percent = 1.0 # 1%
  mode = "sequential"   # Options: "sequential" or "batch"
  # batch_size = 32  # only required with "batch" indexing mode

  [grpc]
  host = "127.0.0.1" # Optional - if not specified uses default loopback address
  port = 50051       # Optional - if not specified will use default 50051
  ```

**Key sections:**
- `upload_threshold`, `upload_process_batch_size`, etc.: Control upload and indexing performance.
- `[server]`: Network settings for the main API server.
- `[thread_pool]`: Controls the thread pool size for parallel operations.
- `[hnsw]`: Parameters for the HNSW vector index.
- `[server.ssl]`: SSL certificate paths for HTTPS mode.
- `[search]`: Search and ranking parameters.
- `[indexing]`: Indexing mode and margin settings.
- `[grpc]`: gRPC server settings.

> **Note:** Only advanced users should modify these settings. For most deployments, the defaults are optimal.

## HTTPS Configuration (TLS)

By default, Cosdata runs over HTTP, but we strongly recommend enabling HTTPS in production.

### 1. Development Mode (HTTP)
If you just want to spin up the server quickly without TLS, edit your `config.toml`:

  ```toml
  [server]
  mode = "http"
  ```

  ⚠️ **Warning:** HTTP mode is not secure—only use this for local development or testing.

### 2. Enabling TLS (HTTPS)
To run Cosdata over HTTPS, you need:
- TLS certificates (self‑signed OK for testing)
- A valid `config.toml` pointing at your certs
- Proper file permissions

#### a. Generate a Self‑Signed Certificate
Create a new RSA key and self‑signed cert (valid 1 year):

  ```bash
  openssl req -newkey rsa:2048 -nodes -keyout private_key.pem -x509 -days 365 -out self_signed_certificate.crt
  ```
Convert the private key to PKCS#8 format:

  ```bash
  openssl pkcs8 -topk8 -inform PEM -outform PEM -in private_key.pem -out private_key_pkcs8.pem -nocrypt
  ```

#### b. Store & Secure Your Certificates
Set your cert directory (choose a secure path):

  ```bash
  export SSL_CERT_DIR="/etc/ssl"
  sudo mkdir -p $SSL_CERT_DIR/{certs,private}
  sudo mv self_signed_certificate.crt   $SSL_CERT_DIR/certs/cosdata.crt
  sudo mv private_key_pkcs8.pem         $SSL_CERT_DIR/private/cosdata.key
  sudo groupadd ssl-cert            || true
  sudo chgrp ssl-cert $SSL_CERT_DIR/private/cosdata.key
  sudo chmod 640  $SSL_CERT_DIR/private/cosdata.key
  sudo chmod 750  $SSL_CERT_DIR/private
  sudo usermod -aG ssl-cert $USER   # you may need to log out/in or run `newgrp ssl-cert`
  ```

#### c. Configure Cosdata to Use TLS
In your `config.toml`, update the `[server]` section:

  ```toml
  [server]
  mode     = "https"
  
  [server.ssl]
  cert_file = "/etc/ssl/certs/cosdata.crt"
  key_file  = "/etc/ssl/private/cosdata.key"
  ```

#### d. Restart Cosdata
If running directly:

  ```bash
  ./target/release/cosdata --admin-key YOUR_ADMIN_KEY
  ```
If using Docker, mount your cert directory:

  ```bash
  docker run -it --rm \
    -v "/etc/ssl/certs:/etc/ssl/certs:ro" \
    -v "/etc/ssl/private:/etc/ssl/private:ro" \
    cosdatateam/cosdata:latest \
    cosdata --admin-key YOUR_ADMIN_KEY
  ```

#### 🔎 Verify HTTPS
Open your browser or run:

  ```bash
  curl -kv https://localhost:8443/health
  ```
You should see a successful TLS handshake and a healthy status response.

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