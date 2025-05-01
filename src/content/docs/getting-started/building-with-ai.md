---
title: Building with AI?
description: Learn how to integrate Cosdata documentation and resources into your AI assistant workflow using the Cosdata MCP server.
---

This page provides an overview of how to use the Cosdata MCP server to integrate Cosdata documentation and resources into your AI assistant workflow.

## What is the Cosdata MCP Server?

The Cosdata MCP server is a Model Control Protocol (MCP) server that provides programmatic access to Cosdata documentation and resources. It is designed to work seamlessly with AI assistants like Cursor, Claude, Windsurf, and others, allowing you to fetch up-to-date documentation, best practices, and community resources directly from your development environment.

## What Does This MCP Server Provide?

Once running, this MCP server exposes tools for:
- Cosdata introduction and getting started guides
- Installation and quick start documentation
- API documentation (authentication, collections, transactions, search, indexes, vectors, versions)
- SDK documentation (Python and Node.js)
- Best practices for vector search
- Security guidelines
- Community resources (GitHub and Discord)

You can use these tools from within Cursor, Claude, Windsurf, or other compatible AI assistants to quickly access Cosdata documentation and best practices.

## Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/cosdata/cosdata-mcp.git
   cd cosdata-mcp
   ```

2. **Set up a Python virtual environment**
   ```bash
   # On Windows
   python -m venv .venv
   .venv\Scripts\activate

   # On macOS/Linux
   python -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the MCP server**
   ```bash
   python src/server.py
   ```

5. **Register the MCP Server in your AI assistant**
   - For most assistants (Cursor, Claude, Windsurf, etc.), you will need to add an entry to your MCP configuration file. The format is generally the same across services, but consult the official documentation for any service-specific details:
     - [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol)
     - [Claude MCP documentation](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
     - [Windsurf MCP documentation](https://docs.windsurf.com/windsurf/mcp)

   **Example configuration for Windows (cmd):**
   ```json
   {
     "mcpServers": {
       "cosdata-mcp": {
         "command": "cmd",
         "args": [
           "/c",
           "python",
           "C:\\path\\to\\cosdata-mcp\\src\\server.py"
         ]
       }
     }
   }
   ```

   **Example configuration for macOS/Linux (bash/sh):**
   ```json
   {
     "mcpServers": {
       "cosdata-mcp": {
         "command": "sh",
         "args": [
           "-c",
           "python3 /path/to/cosdata-mcp/src/server.py"
         ]
       }
     }
   }
   ```
   - Replace the path with the actual location of your `server.py` file.
   - On macOS/Linux, use `python3` if that's how you invoke Python 3 on your system.
   - For Windows, use double backslashes (`\\`) in the path.

## Getting Markdown Versions of Documentation

You can always get a markdown version of any page in our documentation by inserting `md` between the domain and the route. For example, if you are looking at `docs.cosdata.io/getting-started/installation-and-quickstart/`, you can get the markdown version at `docs.cosdata.io/md/getting-started/installation-and-quickstart/`. 