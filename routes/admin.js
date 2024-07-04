<<<<<<< HEAD
const path = require("path");

const express = require("express");
const { body } = require("express-validator/check");
const upload = require("../middleware/multer");
const adminController = require("../controllers/admin");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

router.get("/dashboard", adminController.getDashboard);

router.post("/add-product", isAdmin, async (req, res, next) => {
=======
const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');
const upload = require('../middleware/multer')
const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();



router.post('/add-product', isAdmin, async (req, res, next) => {
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
  try {
    await upload.uploadImage(req, res);
    await adminController.postAddProduct(req, res, next);
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    res.status(500).json({ msg: "Failed to create user", error: err.message });
  }
});
router.post("/edit-product", isAdmin, async (req, res, next) => {
  try {
    await upload.uploadImage(req, res);
    await adminController.postEditProduct(req, res, next);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create user", error: err.message });
  }
});

// /admin/add-product => GET
router.get("/dashboard/add-product", isAdmin, adminController.getAddProduct);

router.get("/admin", adminController.getAdmin);

// /admin/products => GET
// router.get('/product', isAdmin, adminController.getProducts);
=======
    res.status(500).json({ msg: 'Failed to create user', error: err.message });
  }
});


// /admin/add-product => GET
router.get('/add-product', isAdmin, adminController.getAddProduct);

// /admin/products => GET
router.get('/product', isAdmin, adminController.getProducts);
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa

// /admin/add-product => POST
// router.post(
//   '/add-product',
//   [
//     body('title')
//       .isString()
//       .isLength({ min: 3 })
//       .trim(),
//     body('price').isFloat(),
//     body('description')
//       .isLength({ min: 5, max: 400 })
//       .trim()
//   ],
//   isAdmin,
//   adminController.postAddProduct
// );

<<<<<<< HEAD
router.get("/edit-product/:productId", isAdmin, adminController.getEditProduct);

// router.post(
//   '/edit-product',
//   // [
//   //   body('title')
//   //     .isString()
//   //     .isLength({ min: 3 })
//   //     .trim(),
//   //   body('price').isFloat(),
//   //   body('description')
//   //     .isLength({ min: 5, max: 400 })
//   //     .trim()
//   // ],
//   // isAdmin,
//   adminController.postEditProduct
// );

router.post("/delete-product", isAdmin, adminController.postDeleteProduct);

router.post("/upload", upload.uploadImage);

router.get("/dashboard/profile", isAdmin, adminController.getAdminProfile);
=======
router.get('/edit-product/:productId', isAdmin, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAdmin,
  adminController.postEditProduct
);

router.post('/delete-product', isAdmin, adminController.postDeleteProduct);



router.post('/upload',upload.uploadImage)
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
module.exports = router;
