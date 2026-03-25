# 🤖 IceCream-Hub CI/CD Guide

Welcome to the visual guide for the IceCream-Hub automated deployment process. Our architecture uses two powerful pipelines—**Continuous Integration (CI)** and **Continuous Deployment (CD)**—working together to ensure that every change is tested properly and released smoothly.

---

## 🔍 Phase 1: Continuous Integration (CI)
**The Objective:** Validate incoming code before it can touch the `main` branch.

![CI Flow Diagram](C:\Users\LENOVO\.gemini\antigravity\brain\8b0b9fcc-9664-4215-a832-5aea634e16be\ci_flow_diagram_1774428444115.png)

### How the CI Flow Works:
1. **Developer Branch:** You write code in a feature branch (`feature/new-button`) and push it to GitHub.
2. **Pull Request (PR):** You propose to merge this code into the `main` branch.
3. **Automated Verification:** 
   - The CI Pipeline automatically intercepts the pull request.
   - It checks out your code and sets up the correct language runtime (Node.js/TypeScript or Java17).
   - It runs compiling & linting to ensure there are no syntax errors (`npm build` or `gradlew build`).
   - Finally, a **Trivy security scanner** analyzes the Docker image and dependencies for vulnerabilities.
4. **Merge Decision:** If the automated checks succeed, the pull request gets a "Green Checkmark" ✅ and the team can safely merge it into `main`.

---

## 🚀 Phase 2: Continuous Deployment (CD)
**The Objective:** Automatically ship the verified code to the active ecosystem.

![CD Flow Diagram](C:\Users\LENOVO\.gemini\antigravity\brain\8b0b9fcc-9664-4215-a832-5aea634e16be\cd_flow_diagram_1774428458235.png)

### How the CD Flow Works:
1. **Merge to Main:** The code is merged from the PR directly into the `main` branch.
2. **Containerization:** 
   - The CD pipeline detects the merge and begins the *Build and Push* process.
   - It builds the code into a pristine, isolated Docker container.
   - The container is tagged with your unique Git Commit ID (`${{ github.sha }}`).
3. **Docker Hub Upload:** The image is uploaded to your container registry (`akhilmylaram/<service>`).
4. **GitOps Manifest Update:** 
   - Rather than forcing the cloud to run the image, our bot automatically modifies the central blueprints—the **Helm configuration file** (`helm/icecream/values.yaml`).
   - The bot injects the new image tag into the file and commits this change back to the repository.
5. **Deployment:** Systems listening to your central Kubernetes Helm configuration read this update and seamlessly spin up the new version of your IceCream-Hub backend or frontend!

---

## ⚙️ Essential Configurations Needed
For this GitOps model to function gracefully, you need 2 critical things in GitHub:

1. **Workflow Permissions:** You must allow GitHub Actions (the bot) to edit the code.
   - Go to **Settings > Actions > General > Workflow permissions**, select **"Read and write permissions"**, and click Save.
2. **Secrets:** You must give the pipeline the keys to upload the containers to Docker Hub.
   - Go to **Settings > Secrets and variables > Actions**.
   - Add `DOCKER_USERNAME` (`akhilmylaram`) and `DOCKER_PASSWORD`.
