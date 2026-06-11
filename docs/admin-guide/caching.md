---
title: Caching
nav_order: 10
permalink: /admin-guide/caching
parent: Admin guide
---

# Caching

Nick provides HTTP header-based caching that works with reverse proxies (Varnish, CDNs, Nginx) to improve response times and reduce server load. It does not use an in-memory or Redis cache — all caching is driven by response headers.

## Configuration

Caching is **disabled by default** and must be explicitly enabled:

```typescript
export const config = {
  cache: {
    enabled: true,
    anonymousOnly: true,
    etag: true,
    xkeys: true,
    purge: {
      enabled: true,
      urls: ['http://localhost:9000'],
    },
    policies: {
      alter: { method: 'no-cache' },
      manage: { method: 'no-cache' },
      content: { method: 'no-cache' },
      dynamic: { method: 'public', maxAge: 10, sMaxAge: 0 },
      resource: { method: 'public', maxAge: 86400, sMaxAge: 0 },
      stable: { method: 'public', maxAge: 31536000, sMaxAge: 0 },
      static: { method: 'public', maxAge: 31536000, sMaxAge: 0 },
    },
  },
};
```

## Options Reference

| Key             | Default                     | Description                                                |
| --------------- | --------------------------- | ---------------------------------------------------------- |
| `enabled`       | `false`                     | Enable or disable all caching                              |
| `anonymousOnly` | `true`                      | Only apply caching to anonymous (unauthenticated) requests |
| `etag`          | `false`                     | Enable ETag-based conditional requests                     |
| `xkeys`         | `false`                     | Enable Xkey surrogate key tagging                          |
| `purge.enabled` | `false`                     | Enable outbound PURGE requests to reverse proxy            |
| `purge.urls`    | `['http://localhost:9000']` | URLs to send PURGE requests to                             |

## Cache Policies

Each route declares a cache policy name. The mapping of policy names to Cache-Control headers is configured in `cache.policies`:

```typescript
policies: {
  alter:    { method: 'no-cache' },                             // Alter requests
  manage:   { method: 'no-cache' },                             // Management responses
  content:  { method: 'no-cache' },                             // Content editing
  dynamic:  { method: 'public', maxAge: 10, sMaxAge: 0 },       // 10s browser cache
  resource: { method: 'public', maxAge: 86400, sMaxAge: 0 },    // 1 day browser cache
  stable:   { method: 'public', maxAge: 31536000, sMaxAge: 0 }, // 1 year
  static:   { method: 'public', maxAge: 31536000, sMaxAge: 0 }, // 1 year
},
```

| Policy     | Cache-Control Header                                    | Intended For              |
| ---------- | ------------------------------------------------------- | ------------------------- |
| `alter`    | `no-cache, no-store, must-revalidate`                   | Write operations          |
| `manage`   | `no-cache, no-store, must-revalidate`                   | Management endpoints      |
| `content`  | `no-cache, no-store, must-revalidate`                   | Content editing endpoints |
| `dynamic`  | `public, max-age=10, s-maxage=0, must-revalidate`       | Search results, listings  |
| `resource` | `public, max-age=86400, s-maxage=0, must-revalidate`    | Images, files             |
| `stable`   | `public, max-age=31536000, s-maxage=0, must-revalidate` | Never-changing resources  |
| `static`   | `public, max-age=31536000, s-maxage=0, must-revalidate` | Static assets             |

## ETag Support

When `etag: true`, Nick computes an MD5 hash of the JSON or HTML response body and sends it as the `ETag` header. On subsequent requests, the client sends `If-None-Match` with the hash; if the content has not changed, the server responds with `304 Not Modified` (no body), saving bandwidth.

This is useful for API clients that poll for updates.

## Xkey Surrogate Key Tagging

When `xkeys: true`, routes set the `Xkey` response header with keys identifying the content. A reverse proxy (such as Varnish) can use these keys to group cached responses and invalidate them by key.

Typical xkey values:

| Xkey              | Description                 |
| ----------------- | --------------------------- |
| `{document-uuid}` | A specific document         |
| `{user-id}`       | A specific user             |
| `'users'`         | All user-related responses  |
| `'groups'`        | All group-related responses |
| `'roles'`         | All role-related responses  |

## Cache Purge (Invalidation)

When `purge.enabled: true`, Nick sends HTTP `PURGE` requests to the configured URLs whenever content changes. The request includes the `X-Xkey-Purge` header with the relevant xkey value, telling the reverse proxy which cached responses to invalidate.

Purge events are triggered by:

| Event                         | Xkey Purged          |
| ----------------------------- | -------------------- |
| Document created/modified     | Document UUID        |
| Document deleted              | Document UUID        |
| Document moved                | Document UUID        |
| User created/updated/deleted  | User ID, `'users'`   |
| Group created/updated/deleted | Group ID, `'groups'` |

For purge to work, the reverse proxy must support the `PURGE` method and `X-Xkey-Purge` header (Varnish with xkey vmod, for example).

## Example: Varnish Setup

This configuration pairs Nick with a Varnish cache:

```typescript
export const config = {
  cache: {
    enabled: true,
    anonymousOnly: true,
    etag: true,
    xkeys: true,
    purge: {
      enabled: true,
      urls: ['http://localhost:9000'],
    },
    policies: {
      alter: { method: 'no-cache' },
      manage: { method: 'no-cache' },
      content: { method: 'no-cache' },
      dynamic: { method: 'public', maxAge: 10, sMaxAge: 0 },
      resource: { method: 'public', maxAge: 86400, sMaxAge: 0 },
      stable: { method: 'public', maxAge: 31536000, sMaxAge: 0 },
      static: { method: 'public', maxAge: 31536000, sMaxAge: 0 },
    },
  },
};
```

With Varnish receiving requests on port 9000 and forwarding them to Nick.

## Notes

- Caching only applies when the request method is `GET` or `HEAD`
- With `anonymousOnly: true`, authenticated users always receive fresh responses regardless of policy
- There is no built-in TTL expiry of cached responses — the `max-age` and `s-maxage` values in the Cache-Policy header instruct downstream proxies how long to cache
- Without a reverse proxy that supports xkey purging, enabling `cache` will only produce response headers (no functional caching)
