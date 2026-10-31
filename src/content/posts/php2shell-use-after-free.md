---
title: 'PHP2Shell, and why I started learning how memory works'
date: 2026-10-25
description: 'A security email from a hosting provider made me curious about what happens underneath the code.'
tags: [security, linux]
draft: false
code: https://github.com/eonix11/learning-log/tree/main/security/php2shell
---

## The email

DigitalOcean sent an email about two critical bugs in PHP,
CVE-2026-109618 and CVE-2026-109619. People started calling them PHP2Shell.
The message was simple: update PHP now.

## What PHP2Shell is

Two bugs in how PHP handles requests. They exist in every version since PHP 5.
Someone could send a crafted request and run their own code on the server.
No login needed. Patches came out for PHP 8.2 and above.

## What I checked on my server

The server I was working on was running `php8.1-fpm` on Ubuntu. PHP 8.1 is end of life,
so no official patch. But Ubuntu backports security fixes into its own packages.
I checked the package changelog and ran the updates.

## Why it made me curious

I have been writing and reviewing backend code for long. When I read the advisories,
words like "use-after-free" and "memory corruption" meant nothing to me.
I knew how to use PHP and Node, not what happens underneath them.

## What's next

I had already started learning C and how memory works, pointers,
`malloc`, `free` using boot.dev. PHP2Shell gave that a real reason. Now I want to
understand how bugs like this actually happen. I am writing down
what I learn here, with the code in my learning-log.