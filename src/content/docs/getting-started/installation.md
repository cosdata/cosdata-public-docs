---
title: Installation
description: Learn how to install and set up Cosdata on your system
---

# Installing Cosdata

This guide provides step-by-step instructions for installing Cosdata on Linux systems.

## Prerequisites

Before installing Cosdata, ensure you have the following:

- Git
- Rust (version 1.81.0 or higher)
- Cargo (Rust's package manager, toolchain version 1.81.0 or higher)
- A C++ compiler (GCC 4.8+ or Clang 3.4+)

## Installation Steps

### Building Cosdata as a developer

Clone the Cosdata repository:

  ```bash
  git clone https://github.com/cosdata/cosdata.git
  cd cosdata
  ```

Build the project:

  ```bash
  cargo build --release
  ```

### Running Cosdata

To run Cosdata as a user:

  ```bash
  # Install the binaries
  cargo install --path .

  # Run the binary
  cosdata --admin-key <your admin key>
  ```

You should see log lines similar to the following:

  ```
  [2025-02-21T02:30:29Z INFO  cosdata::web_server] starting HTTP server at http://127.0.0.1:8443
  [2025-02-21T02:30:29Z INFO  actix_server::builder] starting 20 workers
  [2025-02-21T02:30:29Z INFO  actix_server::server] Actix runtime found; starting in Actix runtime
  [2025-02-21T02:30:29Z INFO  actix_server::server] starting service: "actix-web-service-127.0.0.1:8443", workers: 20, listening on: 127.0.0.1:8443
  [2025-02-21T02:30:29Z INFO  cosdata::grpc::server] gRPC server listening on [::1]:50051
  ```

## Configuration

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

## Verifying Installation

To verify that Cosdata is running correctly, you can use the health check endpoint:

  ```bash
  curl http://localhost:8443/health
  ```

If everything is working, you should receive a `200 OK` response.
