---
title: Cos Graph Query Language
description: Learn how to use the Cos Graph Query Language to interact with Cosdata's knowledge graph capabilities
---

The Cos Graph Query Language is a powerful query language designed specifically for Cosdata to enable complex knowledge graph operations and vector search capabilities.

## Schema Definition

### Entity Definition

Define entities in your knowledge graph:

```
define entity <entity_name> as
    <attribute_name>: <data_type>
    [, <attribute_name>: <data_type>]*;
```

Example:

```
define entity person as
    name: string
    , age: int
    , email: string;

define entity company as
    name: string
    , founded_year: int;
```

### Relationship Definition

Define relationships between entities:

```
define relationship <relationship_name> as
    (<role1>: <entity_type1>, <role2>: <entity_type2>[, <role3>: <entity_type3>]*),
    [attribute1: <data_type1>,
     attribute2: <data_type2>,
     ...];
```

Example (binary relationship):

```
define relationship works_in as
    (employee: person, department: department);

define relationship employment as
    (employee: person, employer: company),
    start_date: date,
    salary: double;
```

Example (ternary relationship):

```
define relationship contributes_research as
    (author: person,
     research_entity: research_entity,
     domain: domain),
    date: date;
```

## Data Manipulation

### Entity Instance Insertion

Insert entity instances:

```
insert $<variable_name> isa <entity_type> (
    <attribute_name>: <value>
    [, <attribute_name>: <value>]*
);
```

Example:

```
insert $john isa person (
    name: "John Doe"
    , age: 30
    , email: "john@example.com"
);

insert $techcorp isa company (
    name: "TechCorp"
    , founded_year: 2000
);
```

### Relationship Instance Insertion

Insert relationship instances:

```
insert $<variable_name> (
    <role_name>: $<entity_variable> 
    [, <role_name>: $<entity_variable>]*
) forms <relationship_type> (
    <attribute_name>: <value>
    [, <attribute_name>: <value>]*
);
```

Example:

```
insert $job1 (
    employee: $john,
    employer: $techcorp
) forms employment (
    salary: 100000.00
    , start_date: 2022-03-01
);
```

## Querying

### Basic Query Structure

Query your knowledge graph:

```
match
    $<variable> isa <entity_type> (
        <attribute_name>: <value_or_variable>
        [, <attribute_name>: <value_or_variable>]*
    )
    [, $<relationship_variable> (
        <role_name>: $<entity_variable> 
        [, <role_name>: $<entity_variable>]*
    ) forms <relationship_type> (
        <attribute_name>: <value_or_variable>
        [, <attribute_name>: <value_or_variable>]*
    )]*
get $<variable> [, $<variable>]*;
```

Example:

```
match
    $employee isa person (
        name: $name
    ),
    $project isa project (
        name: "AI Initiative"
    ),
    $assignment (
        employee: $employee,
        project: $project,
        department: $dept
    ) forms project_assignment (
        start_date: $start_date
    ),
    $dept isa department (
        name: "Tech Department"
    )
get $name, $start_date;
```

## Rules

Rules allow you to define new relationships or entities based on existing ones.

### Rule Definition

```
define rule <rule_name> as
    match
        <pattern1>,
        <pattern2>,
        ...
    infer
        <conclusion>;
```

### Example: Transitive Closure of Flight Connections

```
// Base case: A city is reachable if there's a direct flight
define rule reachable_direct as
    match
        (from: $city1, to: $city2) forms direct_flight
    infer
        materialize (from: $city1, to: $city2) forms reachable;

// Recursive case: A city is reachable if we can reach an intermediate city
define rule reachable_indirect as
    match
        (from: $city1, to: $intermediate) forms reachable,
        (from: $intermediate, to: $city2) forms reachable,
        $city1 != $city2  // Prevent trivial cycles
    infer
        materialize (from: $city1, to: $city2) forms reachable;
```

## Inferred Relationships

By default, the system will determine whether to materialize inferred relationships or compute them on-demand based on internal heuristics. Users can override this behavior by specifying 'materialize' or 'derive' in the 'infer' clause of a rule.

```
define rule colleagues as
    match
        $emp1 (employee: $person1, employer: $company) isa employment,
        $emp2 (employee: $person2, employer: $company) isa employment,
        $person1 != $person2
    infer [materialize | derive]
        ($person1, $person2) isa colleague;
```

## Joins

Complex queries can join across multiple entities:

```
match
    $manager isa person (
        name: $manager_name,
        email: $manager_email
    ),
    $department isa department (
        name: $dept_name,
        budget: $budget
    ),
    $project isa project (
        name: $project_name,
        end_date: $end_date
    ),
    (manager: $manager, department: $department) forms manages,
    (employee: $manager, department: $department) forms works_in,
    (employee: $manager, project: $project) forms assigned_to,
    $budget > 1000000,
    $end_date >= date("2023-01-01") and $end_date <= date("2023-12-31")
get $manager_name, $manager_email, $dept_name, $project_name;
```

## Query vs Rule

### Match/Get (Direct Querying)

Used for direct, one-time queries to retrieve existing data.

```
match
    $person isa person (
        name: $name,
        age: $age
    ),
    $age > 30
get $name, $age;
```

### Rule/Match/Infer (Rule-Based Inference)

Used to define reusable patterns for inferring new data or relationships.

```
define rule categorize_senior_employees as
    match
        $employee isa person (
            name: $name,
            hire_date: $hire_date
        ),
        $years_employed = years_between($hire_date, current_date()),
        $years_employed >= 10
    infer derive
        $employee (
            employee_category: "Senior"
       );
```

## Custom or System Procedure (cosproc)

The cosproc keyword is used to invoke built-in or user-defined functions within rules:

```
define rule infer_collaboration as
    match
        $emp1 isa employee,
        $emp2 isa employee,
        $emp1 != $emp2
    cos_proc calculate_collaboration($emp1, $emp2, global.projects, "last_6_months", 0.7)
```

## Data Types

* `string`: Text data
* `int`: Integer numbers
* `double`: Floating-point numbers
* `date`: Date in the format YYYY-MM-DD
* `boolean`: True or false values

## Comments

Single-line comments start with `//`:

```
// This is a single-line comment
```

Multi-line comments are enclosed in `/*` and `*/`:

```
/*
This is a
multi-line comment
*/
```

## Vector Search Integration

Cosdata uniquely combines knowledge graph capabilities with vector search:

```
match
    $document isa document (
        embedding: $embedding
    ),
    $query_embedding = vector("What is machine learning?"),
    vector_similarity($embedding, $query_embedding) > 0.8,
    $document (topic: $topic) forms has_topic
get $document, $topic;
```

This allows for powerful hybrid search capabilities that combine the structured relationships of knowledge graphs with the semantic understanding of vector embeddings.

## Learn More

For more detailed information about the Cos Graph Query Language, visit the [official documentation](https://www.cosdata.io/docs/cos-graph-query-language).
