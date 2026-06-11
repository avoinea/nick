---
title: Recycle Bin
nav_order: 8
permalink: /admin-guide/recyclebin
parent: Admin guide
---

# Recycle Bin

The recycle bin provides a safety net for content deletion. When enabled, deleted content is soft-deleted — moved to the recycle bin where it can be restored or permanently purged.

## Configuration

The recycle bin is disabled by default. Enable it by setting `recyclebin: true` in `config.ts`:

```typescript
export const config = {
  recyclebin: true,
};
```

When disabled, content is permanently deleted immediately with no way to recover it.

## How It Works

### Deleting Content

When `recyclebin` is enabled and a `DELETE` request is sent to a content item:

1. The document and all its descendants are marked with `deleted: true` in the database
2. The deletion actor and timestamp are recorded in the workflow history
3. The documents remain in the database with their paths, children, versions, and files intact
4. Deleted documents are excluded from all normal queries — listing, search, navigation, and translations

### Restoring Content

A POST to `/@recyclebin/{uuid}/restore` brings the document back:

- Restores to the original parent location by default
- Optionally accepts a `target_path` to restore to a different location
- Generates a new unique ID for the document to avoid clashes
- Updates paths for the document and all its descendants
- Creates redirects from old paths to new paths

### Purging Content

There are two purge operations:

- **Single item** — `DELETE /@recyclebin/{uuid}` permanently removes the document, its files, images, and version history
- **Empty all** — `DELETE /@recyclebin` permanently removes every item in the recycle bin

## Notes

- Deleted documents still count toward database size — purge periodically if storage is a concern
- There is no automatic expiry — items remain in the recycle bin indefinitely until explicitly purged
