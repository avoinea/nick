---
title: Blobs
nav_order: 5
permalink: /admin-guide/blobs
parent: Admin guide
---

# Blobs

Blobs (Binary Large Objects) are files uploaded to Nick — images, documents, videos, and other binary content. Nick supports three storage backends for blobs.

## Storage Types

| Type   | Backend                      | Best for                          |
| ------ | ---------------------------- | --------------------------------- |
| `file` | Local filesystem             | Development, single-server setups |
| `db`   | PostgreSQL database          | Simplicity, no external services  |
| `s3`   | S3-compatible object storage | Production, horizontal scaling    |

## Config Reference

All blob settings go under the top-level `config` export in your `config.ts`:

```typescript
export const config = {
  // ...
  blobs: 'file',       // 'file' | 'db' | 's3'
  blobsDir: '...',     // path (only used when blobs === 'file')
  s3: { ... },         // S3 connection (only used when blobs === 's3')
  // ...
};
```

| Key        | Default                                            | Description                             |
| ---------- | -------------------------------------------------- | --------------------------------------- |
| `blobs`    | `'file'`                                           | Storage backend                         |
| `blobsDir` | `{packageRoot}/../../../var/blobstorage`           | Filesystem path (file backend only)     |
| `s3`       | `{ bucket, region, accessKeyId, secretAccessKey }` | S3 connection details (s3 backend only) |

The `blobsDir` can also be overridden via the `BLOBS_DIR` environment variable, which takes priority over the config file value.

## File Storage (`'file'`)

Files are stored as individual files on disk inside the `blobsDir` directory. Each blob is saved with its UUID as the filename.

This is the default backend and works out of the box with no additional setup.

### Configuration

```typescript
export const config = {
  blobs: 'file',
  blobsDir: `${__dirname}/var/blobstorage`,
};
```

The `blobsDir` path is relative to your project root. The directory is created automatically on startup if it does not exist.

**Important:** The `blobsDir` directory contains user-uploaded files and should be included in your backup strategy. It is also listed in `.gitignore` — do not commit it to version control.

**When to use this backend:**

- Development and testing
- Single-server deployments
- Small to medium traffic volumes
- When you want simplicity and direct filesystem access

## Database Storage (`'db'`)

Blobs are stored inside PostgreSQL itself, in a `File` table with a `bytea` (binary) column. This keeps everything in one place — no separate blob directory to manage.

### Configuration

```typescript
export const config = {
  blobs: 'db',
};
```

No additional settings are needed — Nick uses the same database connection configured for the rest of the application.

**Considerations:**

- Increases database size, which affects backups and restore times
- May require tuning PostgreSQL's `max_allowed_packet` for large files
- Simpler operational overhead — one less thing to back up and sync

**When to use this backend:**

- When you want a single storage location for all data
- Small to medium deployments
- Environments where writing to disk is restricted

## 3. S3 Storage (`'s3'`)

Blobs are stored in an S3-compatible object storage service. This includes AWS S3, MinIO, DigitalOcean Spaces, Backblaze B2, or any service with an S3 API.

### Configuration

```typescript
export const config = {
  blobs: 's3',
  s3: {
    bucket: 'my-nick-blobs',
    region: 'us-east-1',
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
};
```

### Using an S3-compatible service (MinIO, DigitalOcean Spaces, etc.)

For non-AWS S3 services, set the endpoint via the `S3_ENDPOINT` environment variable:

```bash
# MinIO running locally
export S3_ENDPOINT=http://localhost:9000

# DigitalOcean Spaces
export S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

### IAM Permissions

When using AWS S3, the access key must have the following permissions on the bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": ["arn:aws:s3:::my-nick-blobs", "arn:aws:s3:::my-nick-blobs/*"]
    }
  ]
}
```

**When to use this backend:**

- Production deployments with multiple application servers
- When you need scalable, off-server storage
- Environments where blobs are served directly from object storage via CDN

## Switching Between Backends

Migrating blobs between backends is not currently automated. To switch:

1. Set the new backend in `config.ts`
2. Manually transfer existing blobs from the old location to the new one
3. Restart Nick

Future versions may include a built-in migration command.
