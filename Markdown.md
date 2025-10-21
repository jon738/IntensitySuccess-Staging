# 🚀 Deployment Workflow — Intensity Success

This document outlines the full GitHub Pages deployment workflow for **Intensity Success**, including staging and production pipelines.

---

## 🗂️ Repositories

| Environment | Repository | Description |
|--------------|-------------|--------------|
| **Production** | `jon738/IntensitySuccess` | Main site code and workflows. |
| **Staging** | `jon738/IntensitySuccess-Staging` | Receives automatic staging builds from workflow. |

---

## 🌿 Branch Structure

| Branch | Purpose | Deployment |
|--------|----------|-------------|
| `main` | Production-ready code | Deployed manually to live site |
| `staging` | Work-in-progress branch | Automatically deployed to staging site |
| `gh-pages` | GitHub Pages branch (auto-managed) | Hosts published production build |

---

## ⚙️ Workflow Overview

### 1. **Deploy Staging (Automatic)**  
File: `.github/workflows/deploy-staging.yml`

**Trigger:**  
Runs automatically whenever you push to the `staging` branch.

**Deploys To:**  
[`jon738/IntensitySuccess-Staging`](https://github.com/jon738/IntensitySuccess-Staging)

**Branch Deployed:**  
`main` (or `gh-pages`, depending on config)

**Secrets Required:**  
- `STAGING_TOKEN` — Personal Access Token (PAT) with `repo` scope, stored in `IntensitySuccess` repo secrets.

---

### 2. **Deploy Production (Manual)**  
File: `.github/workflows/deploy-production.yml`

**Trigger:**  
Manual (`workflow_dispatch`) from the **Actions** tab.

**Deploys To:**  
`gh-pages` branch of the **IntensitySuccess** repository (for your live site).

---

## 🔐 Repository Secrets

In **IntensitySuccess → Settings → Secrets → Actions**:

| Secret | Description |
|--------|--------------|
| `STAGING_TOKEN` | Personal Access Token for pushing from main repo to staging repo |

---

## 🧱 Supporting Files

| File | Location | Purpose |
|------|-----------|----------|
| `.gitignore` | Staging repo root | Excludes `.github`, `README.md`, and `CNAME` from being deployed |
| `.nojekyll` | Staging repo root | Prevents GitHub from processing files as Jekyll |
| `README.md` | Root | Project info (safe to edit freely) |

---

## 🔄 Deployment Flow

### 1. Work in Staging
```bash
# Switch to staging branch
git checkout staging

# Make your changes
git add .
git commit -m "Update hero section styling"
git push
