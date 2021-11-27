const express = require('express');
const stream = require('stream');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const app = express();
const port = process.env.PORT || 3000;

const imageAnnotatorClient = new vision.ImageAnnotatorClient();
const storage = new Storage();

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

app.set('trust proxy', true);
app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.get('/liveness', (req, res) => {
    res.status(200).send('OK');
});

app.post('/images', async (req, res) => {
    if (!req.body.image) {
        res.status(400).send('image is not provided in body');
        return;
    }

    const imageId = uuidv4();
    const imageFilePath = `${imageId}.png`;
    console.log(`imageFilePath: ${imageFilePath}`);

    // write base64 image into cloud storage
    var bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(req.body.image, 'base64'));
    var file = bucket.file(`${imageId}.png`);
    await new Promise((resolve, reject) => {
        bufferStream
            .pipe(
                file.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            custom: 'metadata',
                        },
                    },
                    public: true,
                    validation: 'md5',
                })
            )
            .on('error', function (err) {
                console.log(`Cloud Storage Error: ${err}`);
                reject(err);
            })
            .on('finish', function () {
                resolve();
            });
    });

    try {
        const [result] = await imageAnnotatorClient.annotateImage({
            image: {
                source: {
                    imageUri: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
                },
            },
            features: [
                {
                    maxResults: 100,
                    type: vision.protos.google.cloud.vision.v1.Feature.Type
                        .FACE_DETECTION,
                },
            ],
        });

        res.status(200).send({
            count: result.faceAnnotations.length,
        });
    } catch (err) {
        console.log(`Google Vision Error: ${err}`);
        res.status(500).send('image processing failed');
    } finally {
        await storage.bucket(bucket.name).file(file.name).delete();
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
