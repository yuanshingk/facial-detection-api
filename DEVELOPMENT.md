# Deployment to GCP
## GCP Setup
1. Create a project in Google Cloud Platform
1. In your project, create an App Engine application
1. Enable the following APIs
    - App Engine Admin API
    - Cloud Resource Manager API
    - Cloud Build API
1. Create a Service Account with the following roles
1. Generate a new key under that service account with JSON type
1. Store the JSON file at a location of your choice in you PC for local use

## Local Setup
1. Clone the git repo
    ```
    git clone git@github.com:yuanshingk/facial-detection-api.git
    ```

1. Copy the JSON file containing the Service Account's key to the root folder
1. Rename it to `facial-detection-key.json`
1. Run the following in the root folder to serve the application:
    ```
    $ npm install
    ```

    ```
    $ npm run serve
    ```

1. Access the following link in your browser and you should see `OK`

    http://localhost:3000/liveness

