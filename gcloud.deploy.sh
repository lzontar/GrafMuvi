#!/bin/bash
gcloud builds submit --tag gcr.io/grafmuvi/web .
gcloud beta run deploy grafmuvi --region=europe-west1 --platform=managed --allow-unauthenticated --image gcr.io/grafmuvi/web
