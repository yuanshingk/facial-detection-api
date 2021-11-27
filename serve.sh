#!/bin/bash

export GOOGLE_APPLICATION_CREDENTIALS=".\facial-detection-key.json"
export FILE_STORAGE=".\images"

node ./server.js
$SHELL