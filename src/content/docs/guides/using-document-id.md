---
title: Associating Vectors with Documents
slug: guides/document-id-use-case
---


When working with vector databases, it’s common to break down documents—such as PDFs, articles, or web pages—into smaller segments like pages, paragraphs, or sentences, and generate embeddings for each segment. To keep these related vectors organized, Cosdata lets you associate each vector with a `document_id`.

## Use Case: Grouping Vectors by Document


By specifying a `document_id` when upserting vectors, you can:

- Retrieve all vectors that belong to a specific document (for example, all chunks of a PDF)
- Reconstruct or display the original document from its vectorized parts
- Analyze, re-embed, or audit how a document was split and embedded

This approach is especially useful for semantic search, retrieval-augmented generation (RAG), and debugging embedding pipelines.


### How to Use `document_id` When Upserting


When you upsert vectors into a collection, simply include the `document_id` field in each vector object to indicate which document it belongs to. This field can be any string that uniquely identifies your document.




##### Example: Upserting Vectors with `document_id` Using the Python SDK


**Related:**

- [Transactions API reference](/api/rest-api/transactions)
- [Upsert Vectors in Transaction](/api/rest-api/transactions#upsert-vectors-in-transaction)

```python
from cosdata import Client

client = Client(
    host="http://127.0.0.1:8443",  # or your server URL
    username="admin",
    password="admin",
    verify=False
)

collection = client.get_collection("my_collection")

vectors = [
    {
        "id": "vec1",
        "document_id": "doc123",
        "dense_values": [0.1, 0.2, 0.3],
        "text": "First chunk of the document."
    },
    {
        "id": "vec2",
        "document_id": "doc123",
        "dense_values": [0.4, 0.5, 0.6],
        "text": "Second chunk of the document."
    }
]


# Add vectors using a transaction (recommended)
with collection.transaction() as txn:
    txn.batch_upsert_vectors(vectors)
```


### How to Query Vectors by `document_id` Using the Python SDK


To retrieve all vectors associated with a specific document, use the `get_by_document_id` method:

```python
# Fetch all vectors for a given document_id
doc_vectors = collection.vectors.get_by_document_id("doc123")
for v in doc_vectors:
    print(v.id, v.dense_values, v.text)
```


This is useful for reconstructing a document, analyzing its segments, or debugging your embedding pipeline.


For more details, see the [Vector Operations API documentation](/api/rest-api/vectors#query-vectors-by-documentid).

---
