<<<<<<< HEAD
const { validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../firebase.config");

const Product = require("../models/product");

exports.getDashboard = async (req, res, next) => {
  try {
    const token = await req.cookies.token;
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;
    let isAuthenticated = false; // Initialize isAuthenticated outside of the if block
    if (token) {
      isAuthenticated = true;
      const products = await Product.find({ userId: userId });
      console.log(products);
      res.render("dashboard/index.ejs", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: isAuthenticated, // Use the initialized value
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};
=======
const { validationResult } = require('express-validator/check');
const jwt = require("jsonwebtoken");

const Product = require('../models/product');
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa

exports.getAddProduct = (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  console.log(token);
  if (token) {
    isLoggedIn = true;
<<<<<<< HEAD
    res.render("dashboard/edit-product.ejs", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
=======
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
<<<<<<< HEAD
      isAuthenticated: isLoggedIn,
=======
      isAuthenticated:isLoggedIn,
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
    });
  }
};

<<<<<<< HEAD
exports.postAddProduct = async (req, res, next) => {
  try {
    // const category = req.body.category;
=======


exports.postAddProduct = async (req, res, next) => {
  try {
    const category = req.body.category;
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const details = req.body.details;
<<<<<<< HEAD
    const sizeFrom = req.body.sizeFrom;
    const sizeTo = req.body.sizeTo;
    const sizeInLetters = req.body.sizeInLetters;
    const sizeInCm = req.body.sizeInCm;
    const size = req.body.size;
    const firstColor = req.body.firstColor;
    const secondColor = req.body.secondColor;
    const errors = validationResult(req);

    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.redirect("/login");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
=======
    const errors = validationResult(req);

    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/login");
    }
    const decodedToken = jwt.verify(token, "your_secret_key");
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
    const userId = decodedToken.userId;

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: false,
        hasError: true,
        product: {
<<<<<<< HEAD
          // category,
          title,
          price,
          description,
          details,
          sizeFrom,
          sizeTo,
          sizeInLetters,
          sizeInCm,
          size,
          firstColor,
          secondColor,
=======
          category,
          title,
          imageUrl: { images: [] },
          price,
          description,
          details,
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

<<<<<<< HEAD
    const productName = title.split(" ").join(""); // Remove spaces from the product name
    const folderName = `${productName}-${
      new Date().toISOString().split("T")[0]
    }`;

    const product = new Product({
      // category,
=======
    const images = req.files.map(file => file.filename); // Get an array of all filenames
    const productName = title.split(" ").join(""); // Remove spaces from the product name
    const folderName = category + '-' + productName + '-' + new Date().toISOString().split('T')[0];

    const product = new Product({
      category,
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
      title,
      price,
      description,
      details,
<<<<<<< HEAD
      imageUrl: { images: [] },
      sizeFrom,
      sizeTo,
      sizeInLetters,
      sizeInCm,
      size,
      firstColor,
      secondColor,
      userId,
    });

    const uploadPromises = req.files.map(async (file) => {
      const storageRef = ref(
        storage,
        `images/${folderName}/${Date.now()}-${file.originalname}`
      );
      const metadata = { contentType: file.mimetype };

      // Upload the file buffer directly to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

      // Get the download URL and push it to the images array
      const imageUrl = await getDownloadURL(snapshot.ref);
      product.imageUrl.images.push(imageUrl);
    });

    await Promise.all(uploadPromises);
=======
      imageUrl: { images }, // Save all filenames in the images array
      folderName, // Save the folder name
      userId,
    });
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
    await product.save();

    console.log("Created Product");
    res.redirect("/admin/product");
  } catch (err) {
    console.log(err);
<<<<<<< HEAD
    res.status(500).json({ message: "An error occurred" });
  }
};

=======
    // Handle the error in a different way, e.g., render an error page or send a JSON response
    // res.status(500).json({ message: "An error occurred" });
  }
};



>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    if (!product) {
      return res.redirect("/");
    }
    const token = req.cookies.token;
    let isLoggedIn;
<<<<<<< HEAD
    if (token) {
      isLoggedIn = true;
      res.render("dashboard/edit-product.ejs", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        isAuthenticated: isLoggedIn,
      });
    }
=======
    if(token){
      isLoggedIn=true;
      res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      isAuthenticated: isLoggedIn,
    });
    }
    
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

<<<<<<< HEAD
=======

>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
exports.postEditProduct = async (req, res, next) => {
  try {
    const token = await req.cookies.token;
    const decodedToken = await jwt.verify(token, "your_secret_key");
    const email = decodedToken.email;
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
<<<<<<< HEAD
    // const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    // const updatedCategory = req.body.category;
    const updatedDetails = req.body.details;
    const updatedSizeFrom = req.body.sizeFrom;
    const updatedSizeTo = req.body.sizeTo;
    const updatedSizeInLetters = req.body.sizeInLetters;
    const updatedSizeInCm = req.body.sizeInCm;
    const updatedSize = req.body.size;
    const firstColor = req.body.firstColor;
    const secondColor = req.body.secondColor;
    const errors = validationResult(req);
    console.log("this is body", req.body);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("dashboard/edit-product.ejs", {
=======
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedCategory = req.body.category;
    const updatedDetails = req.body.details;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        hasError: true,
        product: {
          title: updatedTitle,
<<<<<<< HEAD
          // imageUrl: updatedImageUrl,
=======
          imageUrl: updatedImageUrl,
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
          price: updatedPrice,
          description: updatedDesc,
          _id: prodId,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const product = await Product.findById(prodId);

    // if (product.userId.toString() !== email) {
    //   return res.redirect("/");
    // }
<<<<<<< HEAD
    console.log("this is edited product", product);
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    // product.imageUrl = updatedImageUrl;
    // product.category = updatedCategory;
    product.details = updatedDetails;
    product.sizeFrom = updatedSizeFrom;
    product.sizeTo = updatedSizeTo;
    product.sizeInLetters = updatedSizeInLetters;
    product.sizeInCm = updatedSizeInCm;
    product.size = updatedSize;
    product.firstColor = firstColor;
    product.secondColor = secondColor;
=======

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    product.category = updatedCategory;
    product.details = updatedDetails;
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
    await product.save();

    console.log("UPDATED PRODUCT!");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

<<<<<<< HEAD
exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const decodedToken = await jwt.verify(req.cookies.token, "your_secret_key");
    const userId = decodedToken.userId;
    await Product.deleteOne({ _id: prodId, userId: userId });
    console.log("DESTROYED PRODUCT");
    res.redirect("/admin/product");
=======

exports.getProducts = async (req, res, next) => {
  try {
    const token = await req.cookies.token;
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;
    let isAuthenticated = false; // Initialize isAuthenticated outside of the if block
    if (token) {
      isAuthenticated = true;
      const products = await Product.find({ userId: userId });
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: isAuthenticated, // Use the initialized value

      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};


exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const decodedToken = jwt.verify(req.body.passwordToken, "your_secret_key");
    const userId = decodedToken.userId;
    await Product.deleteOne({ _id: prodId, userId: userId });
    console.log("DESTROYED PRODUCT");
    res.redirect("/admin/products");
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

<<<<<<< HEAD
exports.getAdmin = async (req, res, next) => {
  res.render("admin/admin");
};

exports.getAdminProfile = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    let isAuthenticated = false;
    if (token) {
      isAuthenticated = true;
    }
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    res.render("dashboard/profile.ejs", {
      pageTitle: "profile ",
      userName: user.userName,
      fName: user.firstName,
      lName: user.lastName,
      companyName: user.companyName,
      birthDay: user.birthDay.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      gender: user.gender,
      email: user.email,
      phone: user.phoneNumber,
      isAuthenticated: isAuthenticated,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};
=======
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
