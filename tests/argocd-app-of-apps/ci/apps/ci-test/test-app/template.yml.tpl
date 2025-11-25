apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: # Will be updated by deploy worklfow
  namespace: argocd
  annotations:
    argocd.argoproj.io/deployment-id: # Will be updated by deploy worklfow
    argocd.argoproj.io/application-repository: # Will be updated by deploy worklfow
    argocd.argoproj.io/sync-wave: "4"
  labels:
    team: application
    application: test-app
    environment: review
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  destination:
    namespace: # Will be updated by deploy worklfow
    server: https://test.com
  syncPolicy:
    syncOptions:
      # NOTE: namespace will be created by creating another file in the same repository
      - CreateNamespace=false
    automated:
      prune: false
      selfHeal: false
  sources:
    - chart: test-app
      repoURL: ghcr.io/my-org/test-app/charts
      targetRevision: # Will be updated by deploy worklfow
      plugin:
        name: hoverkraft-deployment
        env:
          - name: HOVERKRAFT_DEPLOYMENT_ID
            value: ""
      helm:
        values: |
          deploymentId: # Will be updated by deploy worklfow
          application:
            appUri: # Will be updated by deploy worklfow
            dbMigrate: true
            dbSeed: true
          ingress:
            enabled: true
            annotations:
              alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS":443}]'
              alb.ingress.kubernetes.io/ssl-redirect: "443"
              alb.ingress.kubernetes.io/success-codes: 200,301,302
              alb.ingress.kubernetes.io/healthcheck-path: /health
              alb.ingress.kubernetes.io/target-group-attributes: |
                deregistration_delay.timeout_seconds=30
            hosts:
              - host: # Will be updated by deploy worklfow
                paths:
                  - path: ''
                    pathType: Prefix
          commonLabels:
            admission.datadoghq.com/enabled: "true"
            tags.datadoghq.com/env: "review-app"
            tags.datadoghq.com/service: "test-app"
            tags.datadoghq.com/version: # Will be updated by deploy worklfow
          redis:
            enabled: true
            master:
              persistence:
                enabled: false
          mysql:
            enabled: true
            primary:
              persistence:
                enabled: false
