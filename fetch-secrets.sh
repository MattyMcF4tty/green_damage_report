#!/bin/bash

# Ensure the script fails on any command that returns a non-zero exit code
set -e

# Secret name in Secret Manager
SECRET_NAME="DamageReportSecrets"

# Fetch the secret and write it to .env file
gcloud secrets versions access latest --secret=$SECRET_NAME --format='get(payload.data)' | tr '_t' '\n' > .env
