const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './public/styles/images/products'; // Base upload path
        const productName = req.body.title;
        const category = req.body.category;
        // Create a dynamic folder name based on current date
        const folderName = category + '-' + productName.split(" ").join("") + '-' + new Date().toISOString().split('T')[0];
        const fullPath = path.join(uploadPath, folderName);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});


const upload = multer({ storage: storage }).array('images', 5); // Up to 5 images

exports.uploadImage = (req, res, next) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                // Files uploaded successfully
                console.log('Files uploaded successfully');
                resolve();
            }
        });
    });
};


