---
name: feedback-no-shell-tool
description: This agent instance has no Bash/Glob/Grep tool — only Read/Write/Edit/WebFetch/WebSearch/TaskStop
metadata:
  type: feedback
---

When auditing DevNest (and possibly other projects under this same agent config), the only available tools are Read, Write, Edit, WebFetch, WebSearch, TaskStop — there is no shell, glob, or grep tool registered.

**Why:** Attempted `Read` on a directory path (e.g. `/home/.../app`) and it throws `EISDIR: illegal operation on a directory`. There is no way to list directory contents directly.

**How to apply:** To discover the file tree, read known entry points first (`package.json`, `app/layout.tsx`, route page files) and follow their imports to find sibling/child files — treat imports as the directory listing mechanism. Cross-reference `context/current-feature.md` history notes, which often name specific files/components that were added, to seed the file-discovery list. Don't waste turns retrying directory reads.
