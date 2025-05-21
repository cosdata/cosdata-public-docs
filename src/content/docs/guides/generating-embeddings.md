---
title: Generating Embeddings
slug: guides/generating-embeddings
---

Embeddings are essential for powering semantic search, recommendations, and retrieval-augmented generation (RAG) in Cosdata. This guide covers:

- How to generate embeddings using the Cosdata Python SDK (with `cosdata-fastembed`)
- Other popular ways to generate embeddings (open source libraries, API-based services, and Node.js options)
- Where to learn more about embeddings and their role in Cosdata

> **Note:** If you're new to embeddings or want a refresher on what they are and how they're used in Cosdata, see [What are Embeddings?](#what-are-embeddings) at the end of this guide, or for a more in depth explanation check out our [blog post on embeddings](https://www.cosdata.io/blog/what-are-embeddings).

---

## Generating Embeddings for Cosdata

Cosdata provides an embedding utility in the Python SDK for your convenience, but you can use any embedding method you prefer. Below are some common options for generating embeddings to use with Cosdata:

### 1. Cosdata Python SDK Utility

If you're using Python, the Cosdata SDK provides a convenient utility for generating embeddings using [cosdata-fastembed](https://github.com/cosdata/cosdata-fastembed). This is the recommended approach for Python users who want to generate embeddings locally or in their own infrastructure.

#### Installation

```bash
pip install cosdata-client cosdata-fastembed
```

#### Example Usage

```python
from cosdata.embedding import embed_texts

texts = [
    "Cosdata makes vector search easy!",
    "This is a test of the embedding utility."
]
# Specify any supported model (see cosdata-fastembed repo for options)
embeddings = embed_texts(texts, model_name="thenlper/gte-base")
```

- The output is a list of lists (one embedding per input text), ready to upsert into your Cosdata collection.
- See the [cosdata-fastembed supported models list](https://github.com/cosdata/cosdata-fastembed#supported-models) for available model names and dimensions.
- If `cosdata-fastembed` is not installed, a helpful error will be raised.
- See the [Python SDK docs](../python-sdk) for more details.

### 2. Open Source Libraries

You can use any open source embedding model from [Hugging Face](https://huggingface.co/models?pipeline_tag=sentence-similarity). Popular options include `sentence-transformers/all-mpnet-base-v2`, `BAAI/bge-base-en-v1.5`, and `nomic-ai/nomic-embed-text-v2`.

---

### 3. API-Based Embedding Services

Many providers offer high-quality embedding APIs. Some of the most popular are:

- [OpenAI](https://platform.openai.com/docs/guides/embeddings)
- [Google Gemini](https://ai.google.dev/gemini-api/docs/embeddings)
- [Cohere](https://docs.cohere.com/docs/embed)
- [Jina AI](https://jina.ai/embeddings/)
- [Voyage AI](https://docs.voyageai.com/docs/embeddings)

All of these APIs return embeddings as lists of floats, which can be upserted into Cosdata collections.

---

## What are Embeddings?

Embeddings are numerical vector representations of data (such as text, images, or code) that capture semantic meaning. In Cosdata, embeddings are used to power:

- **Semantic search**: Find similar items based on meaning, not just keywords.
- **Retrieval-augmented generation (RAG)**: Provide relevant context to LLMs.
- **Clustering and classification**: Group similar data points for analysis or recommendations.

Embeddings are typically high-dimensional (e.g., 384, 768, or 1024 floats per vector), and the choice of model determines the dimension and quality. Use the same model for both indexing and querying.

For more on how embeddings work in Cosdata, see the [our blog post on embeddings](https://www.cosdata.io/blog/what-are-embeddings).
