---
name: staging-workflow
description: "**WORKFLOW SKILL** — Enforce staging-first development workflow. USE WHEN: user requests code changes, new features, file creation, updates to layouts/components/pages, adding tracking pixels, or any modification to the codebase. ALWAYS check current branch and switch to staging if not already there BEFORE making any changes. DO NOT USE FOR: read-only operations, checking status, viewing files, or running queries."
---

# Staging-First Workflow

## Core Rule

**NEVER make code changes on any branch except `staging`.**

## Workflow

### 1. Check Current Branch
Before ANY code modification, check the current branch:
```bash
git branch --show-current
```

### 2. Switch to Staging (if needed)
If not on `staging`:
```bash
git checkout staging
```

### 3. Verify Branch Switch
Confirm you're on staging before proceeding:
```bash
git branch --show-current
```

### 4. Make Changes
Only after confirming you're on `staging`, proceed with the requested changes.

## What Requires Staging Branch

**Always use staging for:**
- ✅ Creating new files (components, pages, layouts)
- ✅ Editing existing code
- ✅ Adding tracking pixels, scripts, or analytics
- ✅ Updating dependencies
- ✅ Configuration changes
- ✅ Any modification to `src/`, `public/`, or config files

**Skip staging check for:**
- ❌ Reading files
- ❌ Searching code  
- ❌ Viewing git status/logs
- ❌ Running builds (without code changes)
- ❌ Deploying existing built code

## Deployment Flow

```
staging branch → build → test → merge to main → deploy to production
```

## Enforcement

1. **First action**: Check branch
2. **If not staging**: Switch to staging
3. **Then proceed**: Make the requested changes
4. **Never assume**: Always verify before editing

## Error Prevention

**Before making ANY edit:**
- Run `git branch --show-current`
- If output is NOT `staging`, run `git checkout staging`
- Then and only then, proceed with edits

**Do not:**
- Make changes and switch branches after
- Assume you're on staging
- Skip the branch check "just this once"
- Work on `main` or other branches directly
