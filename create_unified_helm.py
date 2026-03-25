import os
import re

k8s_deploy_dir = r"C:\IceCream-Hub\k8s\deployments"
k8s_svc_dir = r"C:\IceCream-Hub\k8s\services"
helm_dir = r"C:\IceCream-Hub\helm\icecream"
templates_dir = os.path.join(helm_dir, "templates")

# Ensure helm directory exists
os.makedirs(templates_dir, exist_ok=True)

# Define the service mapping
service_map = {
    "auth-service.yaml": "authService",
    "order-service.yaml": "orderService",
    "cart-service.yaml": "cartService",
    "product-service.yaml": "productService",
    "recommendation-service.yaml": "recommendationService",
    "api-gateway.yaml": "apiGateway",
    "frontend.yaml": "frontend"
}

values_yaml_content = "## IceCream Hub Unified Values\n\n"

for k8s_dir in [k8s_deploy_dir, k8s_svc_dir]:
    for filename in os.listdir(k8s_dir):
        if not filename.endswith(".yaml"):
            continue
            
        filepath = os.path.join(k8s_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        # If it's a deployment and in our target service map, replace image
        if k8s_dir == k8s_deploy_dir and filename in service_map:
            svc_val_name = service_map[filename]
            
            # Simple regex to find image: akhilmylaram/icecream-something:tag
            # Example: image: akhilmylaram/icecream-auth:latest
            # We'll replace it with: image: {{ .Values.authService.image }}:{{ .Values.authService.tag }}
            
            # Extract current image to populate values.yaml
            match = re.search(r'image:\s+([^\s:]+)(?::([^\s]+))?', content)
            if match:
                repo = match.group(1)
                tag = match.group(2) if match.group(2) else "latest"
                
                values_yaml_content += f"{svc_val_name}:\n"
                values_yaml_content += f"  image: \"{repo}\"\n"
                values_yaml_content += f"  tag: \"{tag}\"\n\n"
                
                # Replace in content
                content = re.sub(
                    r'image:\s+[^\s]+', 
                    f'image: {{{{ .Values.{svc_val_name}.image }}}}:{{{{ .Values.{svc_val_name}.tag }}}}', 
                    content
                )
        
        # Write to helm templates
        # Prefix with type (deploy or svc) to maintain flatness easily
        prefix = "deploy-" if k8s_dir == k8s_deploy_dir else "svc-"
        out_filename = prefix + filename
        with open(os.path.join(templates_dir, out_filename), "w", encoding="utf-8") as f:
            f.write(content)

# We also should copy pvcs and configmaps from k8s/base/ if necessary
# Let's copy everything from k8s/base/ except namespace.yaml since helm usually installs into a namespace natively
k8s_base_dir = r"C:\IceCream-Hub\k8s\base"
for filename in os.listdir(k8s_base_dir):
    if filename.endswith(".yaml") and filename != "00-namespace.yaml":
        filepath = os.path.join(k8s_base_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        with open(os.path.join(templates_dir, "base-" + filename), "w", encoding="utf-8") as f:
            f.write(content)

# Write values.yaml
with open(os.path.join(helm_dir, "values.yaml"), "w", encoding="utf-8") as f:
    f.write(values_yaml_content)

# Write Chart.yaml
chart_yaml = """apiVersion: v2
name: icecream
description: Unified Helm chart for IceCream Hub
type: application
version: 0.1.0
appVersion: "1.0.0"
"""
with open(os.path.join(helm_dir, "Chart.yaml"), "w", encoding="utf-8") as f:
    f.write(chart_yaml)

print("Unified Helm chart generated at C:\IceCream-Hub\helm\icecream")
