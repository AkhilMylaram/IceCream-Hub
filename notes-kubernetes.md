# Kubernetes Deployment Notes

I have created a comprehensive, production-grade Kubernetes project structure for IceCream Hub in the `kubernetes` directory. 

Here is what the structure looks like, based on recommended best practices for deploying microservices. I've broken the Kubernetes files into logical components and utilized `Kustomize` integration so that you can apply all records simultaneously.

```
c:\IceCream-Hub\kubernetes\
├── base\
│   ├── 00-namespace.yaml             # Creates 'icecream-hub' namespace for isolation
│   ├── 01-configmap.yaml             # All DB URLs and Service URLs grouped neatly
│   ├── 02-secret.yaml                # Opaque Secret for MySQL passwords
│   └── 03-init-sql-configmap.yaml    # Stores your init.sql to map into MySQL pod
├── databases\
│   ├── 04-mysql.yaml                 # PersistentVolumeClaim, Service, and Deployment
│   └── 05-redis.yaml                 # PersistentVolumeClaim, Service, and Deployment
├── backend\
│   ├── 06-auth-service.yaml          # Service and Deployment
│   ├── 07-product-service.yaml       # ...
│   ├── 08-cart-service.yaml          # ...
│   ├── 09-order-service.yaml         # ...
│   ├── 10-recommendation-service.yaml# ...
│   └── 11-api-gateway.yaml           # ...
├── frontend\
│   ├── 12-frontend.yaml              # Frontend Node/Next App
│   └── 13-nginx.yaml                 # Nginx LoadBalancer entry point mapping to Port 80
└── kustomization.yaml                # Master file to map the execution sequence
```

## Features of this structure & design:

1. **Logical Separation (`base`, `databases`, `backend`, `frontend`)**: Instead of tossing 25 unorganized YAML files into a single directory or creating giant unreadable monolithic manifests, the resources are explicitly decoupled. Order is enforced gracefully by file prefixes (`00-`, `01-`).
2. **Kustomize Built-In**: I added a root-level `kustomization.yaml` document containing all references. This means you can launch your entire production layout at once simply by running `kubectl apply -k ./kubernetes`. 
3. **`init.sql` Handling**: Rather than creating complicated initialization containers to duplicate your `init-scripts/init.sql`, I mapped it seamlessly into `03-init-sql-configmap.yaml` and bound the ConfigMap directly into the `mysql` deployment just like it was running on your Docker Compose setup.
4. **Resiliency**: MySQL and Redis were correctly equipped with `PersistentVolumeClaim` (PVCs) for durable persistent storage—a must-have for anything production grade. Passwords and keys are protected uniformly through proper native `Secret` ref bindings. 
5. **DNS & Networking**: Replaced default internal endpoints from your Docker Compose configuration with native Kubernetes cluster service logic.

## Deployment Instructions

To deploy the entire structure simultaneously, navigate to the root directory and run:

```bash
kubectl apply -k ./kubernetes
```

To tear down the deployment:

```bash
kubectl delete -k ./kubernetes
```
