---
title: 'PHP2Shell: what I learned about use-after-free'
date: 2026-10-25
description: 'Notes on a PHP use-after-free bug that leads to a shell, and the memory basics I needed to follow it.'
tags: [security, linux]
draft: false
---

> Placeholder. I will rewrite this post.

## What happened

I worked through a challenge where a bug in a PHP extension gave remote code execution.
The root cause was a use-after-free: the program kept using memory after it gave that memory back.

## Memory basics

A C program asks the allocator for memory with `malloc` and gives it back with `free`.
After `free`, the pointer still holds the old address. Nothing stops the program from using it.

```c
#include <stdlib.h>
#include <string.h>

int main(void) {
    char *buf = malloc(32);
    strcpy(buf, "hello");
    free(buf);
    // buf still points to the old chunk.
    return 0;
}
```

## Use-after-free

If the program writes through a freed pointer, it can change memory that now belongs to something else.
The allocator often gives the same chunk to the next `malloc` of a similar size.
An attacker who controls that next allocation can control what the stale pointer sees.

```bash
# Build with AddressSanitizer to catch the bug early.
gcc -g -fsanitize=address uaf.c -o uaf && ./uaf
```

## What I'll explore next

- How the glibc heap (`tcache`, fastbins) reuses freed chunks.
- How PHP's own allocator (`zend_alloc`) differs from glibc.
- How to turn a stale pointer into a controlled write.
