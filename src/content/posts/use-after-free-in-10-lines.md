---
# Copy this file to src/content/posts/<slug>.md (or .mdx).
# The file name becomes the URL: /posts/<slug>/
# Files that start with "_" are ignored, so this template never builds.

# Required. The post title.
title: 'Use after free in 10 lines of C'

# Required. Publish date, YYYY-MM-DD. Posts are sorted by this date.
date: 2026-10-31

# Required. One sentence. Used for the meta description, link previews, and RSS.
description: 'Freed memory, kept the pointer, and got someone else''s data back.'

# List of tags. Suggested: security, ai, js, backend, linux, c, ctf
tags: [c, security]

# Optional. Link to the matching folder in learning-log.
# Shows a "Code for this post" link at the bottom. Delete the line if not needed.
code: 'https://github.com/eonix11/learning-log/tree/main/c/use-after-free'

# Optional. true = shown in dev only, hidden in production. Default: false.
draft: false
---

While reading about PHP2Shell, the term "use-after-free" kept coming up.
So I wrote the smallest C program I could to see it happen.

## code

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char *name = malloc(16);
    strcpy(name, "junaid");
    printf("before free: %s (%p)\n", name, (void *)name);

    free(name);

    char *other = malloc(16);
    strcpy(other, "hacker");
    printf("other:       %s (%p)\n", other, (void *)other);

    printf("after free:  %s\n", name);
    return 0;
}
```
## Output

```
before free: junaid (0x1016dd320)
other: hacker (0x1016dd320)
after free:  hacker

```

`other` got the same address that `name` had. So when I printed `name`
after freeing it, I got "hacker". The memory was reused, but the old
pointer still pointed to it.

## Catching it

```bash
clang -fsanitize=address -g uaf.c -o uaf && ./uaf
```

AddressSanitizer stopped the program and reported `heap-use-after-free`,
with the exact line. I will build every C experiment with it from now on.

## What I'm still curious about

Here I only read the reused memory. In real bugs like PHP2Shell, the
program trusts that memory and acts on it. I want to understand how
that turns into running code.