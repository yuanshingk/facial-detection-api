const express = require('express');
const axios = require('axios').default;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const vision = require('@google-cloud/vision');
const app = express();
const port = 3000;
const imageDirectory = './images';

const imageAnnotatorClient = new vision.ImageAnnotatorClient();
if (!fs.existsSync(imageDirectory)) {
    fs.mkdirSync(imageDirectory);
}

const keyFile = process.env['GOOGLE_APPLICATION_CREDENTIALS'];

app.use(express.json({ limit: '50mb' }));

app.post('/images', async (req, res) => {
    if (!req.body.image) {
        res.status(400).send('image is not provided in body');
        return;
    }

    const imageId = uuidv4();
    const imageFilePath = `${imageDirectory}/${imageId}.png`;
    let imageError = null;
    fs.writeFile(imageFilePath, req.body.image, 'base64', (err) => {
        if (err) {
            imageError = err;
        }
    });

    if (imageError) {
        console.log(`Image Creation Error: ${imageError}`);
        res.status(400).send('image is not valid');
        return;
    }

    try {
        const [result] = await imageAnnotatorClient.faceDetection(
            imageFilePath
        );

        res.status(200).send({
            count: result.faceAnnotations.length,
        });
    } catch (err) {
        console.log(`Google Vision Error: ${err}`);
        res.status(500).send('image processing failed');
    } finally {
        fs.unlink(imageFilePath, (err) => {
            if (err) {
                console.log(`Delete Image Error: ${err}`);
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
