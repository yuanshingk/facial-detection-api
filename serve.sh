#!/bin/bash

export GOOGLE_APPLICATION_CREDENTIALS='facial-detection-key.json'
export GCLOUD_STORAGE_BUCKET='facial-detection-333313.appspot.com'

node ./server.js
$SHELL