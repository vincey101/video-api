const express = require('express');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/api/save-video', async (req, res) => {
    const { videoUrl, elements } = req.body;
    console.log(req.body);

    // Return a valid JSON response
    res.json({ videoUrl: 'https://vincent-videoeditor.netlify.app/4d96a48f-c80d-43dd-9319-968d019856b4' });

    if (!videoUrl) {
        return res.status(400).send('Video URL is required');
    }

    try {
        // Upload the video to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(videoUrl, {
            resource_type: 'video',
        });

        const publicId = uploadResponse.public_id;

        // Prepare the overlay transformations for text and images
        let transformations = [];
        elements.forEach((element) => {
            if (element.type === 'text') {
                transformations.push({
                    overlay: {
                        font_family: 'Arial',
                        font_size: 30,
                        font_weight: 'bold',
                        text: element.content,
                    },
                    color: element.color,
                    gravity: 'north_west',
                    x: element.left,
                    y: element.top,
                    start_offset: element.timer.start,
                    end_offset: element.timer.end,
                });
            } else if (element.type === 'image') {
                transformations.push({
                    overlay: {
                        url: element.url, // image URL
                    },
                    gravity: 'north_west',
                    x: element.left,
                    y: element.top,
                    start_offset: element.timer.start,
                    end_offset: element.timer.end,
                });
            }
        });

        // Process the video with Cloudinary transformations
        const videoWithOverlays = cloudinary.url(publicId, {
            resource_type: 'video',
            transformation: transformations,
            format: 'mp4',
        });

        // Return the processed video URL to the frontend
        res.json({ videoUrl: videoWithOverlays });
    } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).send('Video processing failed');
    }
});

module.exports = router;
