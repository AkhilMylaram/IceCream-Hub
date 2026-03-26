# 🤖 IceCream-Hub CI/CD Guide

Welcome to the visual guide for the IceCream-Hub automated deployment process. Our architecture uses two powerful pipelines—**Continuous Integration (CI)** and **Continuous Deployment (CD)**—working together to ensure that every change is tested properly and released smoothly.

---

## 🔍 Phase 1: Continuous Integration (CI)
**The Objective:** Validate incoming code before it can touch the `main` branch.

![CI Flow Diagram](C:\Users\LENOVO\.gemini\antigravity\brain\8b0b9fcc-9664-4215-a832-5aea634e16be\ci_flow_diagram_1774428444115.png)

### Clean, Step-by-Step Execution
When a developer opens a Pull Request against the `main` branch, the CI pipeline automatically runs. In the GitHub Actions UI, you will see a clear, linear progress checklist ensuring maximum transparency:

✅ **Setup Node.js / Gradle Environment**
✅ **Install dependencies / Compile Code & Assemble Target** 
✅ **Run linting / Execute Unit Tests**
✅ **Run Trivy vulnerability scanner**

If any step fails, it turns red instantly so you know exactly what is wrong. If everything is green ✅, the PR is allowed to merge.

---

## 🚀 Phase 2: Continuous Deployment (CD)
**The Objective:** Automatically ship the verified code to the active ecosystem.

![CD Flow Diagram](C:\Users\LENOVO\.gemini\antigravity\brain\8b0b9fcc-9664-4215-a832-5aea634e16be\cd_flow_diagram_1774428458235.png)

### GitOps Trigger and Execution
When code is merged to the `main` branch, the CD process triggers automatically. Like CI, the CD steps are separated for a crystal-clear visual breakdown in the GitHub UI:

1. **Docker Containerization** 
   - ✅ **Build Docker Image**
   - ✅ **Push Docker Image** to `akhilmylaram/<service>` tagged with the Git commit hash (`${{ github.sha }}`).
2. **GitOps Helm Update** (Our bot opens the central deployment configuration and updates the blueprints)
   - ✅ **Update Helm Tag in values.yaml**
   - ✅ **Update Helm Image in values.yaml**
3. **Commit & Push**
   - ✅ **Configure Git Bot**
   - ✅ **Stage Manifest Changes**
   - ✅ **Commit Manifest Changes**
   - ✅ **Push Changes to Remote**

Systems listening to your central Kubernetes Helm configuration read this updated commit from the main branch and seamlessly spin up the new version of your backend or frontend!

---

## ⚙️ Essential Configurations Needed
For this GitOps model to function gracefully, you need 2 critical things in GitHub:

1. **Workflow Permissions:** You must allow GitHub Actions (the bot) to edit the code.
   - Go to **Settings > Actions > General > Workflow permissions**, select **"Read and write permissions"**, and click Save.
2. **Secrets:** You must give the pipeline the keys to upload the containers to Docker Hub.
   - Go to **Settings > Secrets and variables > Actions**.
   - Add `DOCKER_USERNAME` (`akhilmylaram`) and `DOCKER_PASSWORD`.
