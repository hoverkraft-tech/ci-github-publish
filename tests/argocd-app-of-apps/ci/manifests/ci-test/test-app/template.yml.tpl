apiVersion: v1
kind: Namespace
metadata:
  name: # Will be updated by deploy worklfow
  annotations:
    app.kubernetes.io/instance: # Will be updated by deploy worklfow
    argocd.argoproj.io/sync-options: Prune=true
    argocd.argoproj.io/sync-wave: "0"
