---
title: 'Idempotency keys: retries without double payments'
date: 2026-11-08
description: 'A retry created a second payment. One unique constraint and a saved response fixed it.'
tags: [backend, postgres, system-design]
code: 'https://github.com/eonix11/learning-log/tree/main/backend/idempotency-keys'
draft: false
---

A user clicks "Pay" twice, or the request times out and the client retries.
The server can't tell it's a retry, so the payment happens twice.
I’ve built payment integrations before, so I wanted to see the fix work end to end.

## The fix

The client sends an `Idempotency-Key` header. The server saves the response
for that key. If the same key comes again, it returns the saved response.

```sql
response   jsonb,
status     text not null default 'processing',
locked_at  timestamptz not null default now(),
unique (user_id, key)
```

## Two requests at once

The server inserts the key first, before doing any work:

```js
insert into idempotency_keys (user_id, key)
values ($1, $2)
on conflict (user_id, key) do nothing
returning id
```

Because of the unique constraint, only one insert can win.
The winner makes the payment. The other gets 409.

```
{"error":"request in progress"}
{"paymentId":1793548885700,"amount":100}
```

## Retry later

```
{"amount":100,"paymentId":1793548885700}
```

Same paymentId. The server returned the saved response, no new payment.

## Server crash

If the server dies mid-payment, the key stays in `processing` forever.
Every retry gets 409.

Fix: if the key has been `processing` for more than 10 seconds, a retry can take it over.

```sql
update idempotency_keys
set locked_at = now()
where user_id = $1 and key = $2
  and status = 'processing'
  and locked_at < now() - interval '10 seconds'
returning id
```

If two retries reclaim at the same time, the first one updates locked_at, so second one sees a fresh locked_at and gets 409.

I killed the server with `kill -9` mid-payment, then retried:

```
--- crashed
--- Immediate retry:
{"error":"request in progress"}
--- retry after 11s:
{"paymentId":1794131524441,"amount":100}
--- again
{"amount":100,"paymentId":1794131524441}
```

## What I'm still curious about

The server can't tell a crashed request from a slow one.
If a payment takes longer than 10 seconds, a retry can reclaim it and pay twice.

Two fixes I want to try:
- Pass the same key to the payment provider, so it blocks the duplicate charge.
- Heartbeat - while working, the server keeps updating `locked_at`, so a slow request never looks stuck.