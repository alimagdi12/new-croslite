<<<<<<< HEAD
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../firebase.config");
const multer = require("multer");
const stream = require("stream");

const upload = multer().array("images", 5); // Up to 5 images

exports.uploadImage = (req, res, next) => {
  return new Promise((resolve, reject) => {
    upload(req, res, async (err) => {
      if (err) {
        reject(err);
      } else {
        try {
          // Upload each file to Firebase Storage using streaming
          const fileUrls = [];
          for (const file of req.files) {
            const storageRef = ref(
              storage,
              `images/${Date.now()}-${file.originalname}`
            );
            const metadata = { contentType: file.mimetype };

            // Create a readable stream from the buffer
            const fileStream = new stream.PassThrough();
            fileStream.end(file.buffer);

            // Upload the file stream to Firebase Storage
            await uploadBytes(storageRef, fileStream, metadata);

            // Get the download URL and push it to the URLs array
            const imageUrl = await getDownloadURL(storageRef);
            fileUrls.push(imageUrl);
          }

          // Files uploaded successfully, return the URLs
          console.log("Files uploaded successfully");
          resolve(fileUrls);
        } catch (uploadError) {
          reject(uploadError);
        }
      }
    });
  });
};
=======
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


>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
