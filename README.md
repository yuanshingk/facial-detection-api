# facial-detection-api

![App Engine Deployment](https://github.com/yuanshingk/facial-detection-api/actions/workflows/main.yml/badge.svg)

A nodejs api that integrates with google cloud vision API.

For simplicity, this API only exposes two endpoints:

1. Check if deployment is up and running:
    ```
    GET facial-detection-333313.as.r.appspot.com/liveness
    ```
1. Takes in a base64 image in the body payload and returns the total number of human faces detected
    ```
    POST facial-detection-333313.as.r.appspot.com/images
    ```

    Example Request:
    ```
    POST /images HTTP/1.1
    Host: facial-detection-333313.as.r.appspot.com
    Content-Type: application/json
    Content-Length: <content length>

    {
        "image": <Base64 Image with pattern /9j/4AAQSkZJRgAB...>
    }
    ```

    Example Response:
    ```json
    {
        "count": 5
    }
    ```

For local setup, refer to [DEVELOPMENT.md](DEVELOPMENT.md)
