---
title: Jobs
parent: Developer guide
permalink: /developer-guide/jobs
---

# Jobs

Jobs are used for long-running operations that cannot complete within a single HTTP request. The pattern follows a polling workflow using HTTP `202 Accepted` responses and `Location` headers.

## Workflow

1. **Start the job** — The client sends a request to initiate the long-running operation. The server creates a job and responds with `202 Accepted` and a `Location` header pointing to a status endpoint.
2. **Poll for status** — The client polls the status endpoint. If the job is still running, the server returns `202 Accepted` with the current status. Once the job is complete, the server returns `202 Accepted` with a `Location` header pointing to a result endpoint (appended with `/result`).
3. **Fetch the result** — The client calls the result endpoint and receives the final output, typically with a `200 OK` or `204 No Content` status.

## Example requests and responses

### Step 1: Start the job

```http
GET /@reindex HTTP/1.1
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzMTI0NDl9.RS1Ny_r0v7vIylFfK6q0JVJrkiDuTOh9iG9IL8xbzAk
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json
Location: /@jobs/550e8400-e29b-41d4-a716-446655440000
```

### Step 2a: Poll — job still running

```http
GET /@jobs/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzMTI0NDl9.RS1Ny_r0v7vIylFfK6q0JVJrkiDuTOh9iG9IL8xbzAk
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "@id": "http://localhost:8080/@jobs/550e8400-e29b-41d4-a716-446655440000",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Reindex",
  "description": "Reindex all content",
  "params": {
    "path": "/",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzMTI0NDl9.RS1Ny_r0v7vIylFfK6q0JVJrkiDuTOh9iG9IL8xbzAk",
    "method": "reindex",
    "data": {},
    "query": {},
    "header": {}
  },
  "actor": "admin",
  "created": "2022-04-02T20:00:00.000Z",
  "started": "2022-04-02T20:02:00.000Z",
  "finished": null,
  "status": "started",
  "result": {}
}
```

### Step 2b: Poll — job complete

```http
GET /@jobs/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzMTI0NDl9.RS1Ny_r0v7vIylFfK6q0JVJrkiDuTOh9iG9IL8xbzAk
```

```http
HTTP/1.1 202 Accepted
Location: /@jobs/550e8400-e29b-41d4-a716-446655440000/result
```

### Step 3: Fetch the result

```http
GET /@jobs/550e8400-e29b-41d4-a716-446655440000/result HTTP/1.1
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzMTI0NDl9.RS1Ny_r0v7vIylFfK6q0JVJrkiDuTOh9iG9IL8xbzAk
```

```http
HTTP/1.1 204 No Content
```

## Implementing a job handler

Below is an example route definition that starts a job and returns the polling location:

```ts
import jobs from '../../helpers/jobs/jobs';
import { getUrl } from '../../helpers/url/url';
import models from '../../models';

export default [
  {
    op: 'get',
    view: '/@reindex',
    permission: 'Manage Site',
    client: 'reindex',
    cache: 'manage',
    handler: async (req: Request, trx: Knex.Transaction) => {
      // Check if you need to run as job
      if (req.job) {
        const Document = models.get('Document');
        const documents = await Document.fetchAll({}, {}, trx);

        // Reindex the documents
        await mapAsync(documents, async (document: any) => {
          await document.reindex(trx);
        });

        return {
          status: 204,
        };
      }

      // Add a job to the queue
      const newUuid = await jobs.add(
        'Reindex',
        'Reindex all content',
        {
          path: '/',             // Optional path
          token: req.token,
          method: 'reindex',
          data: {},              // Optional data
          query: {},             // Optional query
          headers: {},           // Optional headers
        },
        req.user.id,
        trx,
      );

      // Return accepted and pass location header to check for status
      return {
        headers: {
          Location: `${getUrl(req)}/@jobs/${newUuid}`,
        },
        status: 202,
      };
    };
  }
];
```
