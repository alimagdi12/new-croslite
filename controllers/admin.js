const { validationResult } = require('express-validator/check');
const jwt = require("jsonwebtoken");

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  console.log(token);
  if (token) {
    isLoggedIn = true;
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      isAuthenticated:isLoggedIn,
    });
  }
};



exports.postAddProduct = async (req, res, next) => {
  try {
    const category = req.body.category;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const details = req.body.details;
    const errors = validationResult(req);

    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/login");
    }
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: false,
        hasError: true,
        product: {
          category,
          title,
          imageUrl: { images: [] },
          price,
          description,
          details,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const images = req.files.map(file => file.filename); // Get an array of all filenames
    const productName = title.split(" ").join(""); // Remove spaces from the product name
    const folderName = category + '-' + productName + '-' + new Date().toISOString().split('T')[0];

    const product = new Product({
      category,
      title,
      price,
      description,
      details,
      imageUrl: { images }, // Save all filenames in the images array
      folderName, // Save the folder name
      userId,
    });
    await product.save();

    console.log("Created Product");
    res.redirect("/admin/product");
  } catch (err) {
    console.log(err);
    // Handle the error in a different way, e.g., render an error page or send a JSON response
    // res.status(500).json({ message: "An error occurred" });
  }
};



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
    
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};


exports.postEditProduct = async (req, res, next) => {
  try {
    const token = await req.cookies.token;
    const decodedToken = await jwt.verify(token, "your_secret_key");
    const email = decodedToken.email;
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedCategory = req.body.category;
    const updatedDetails = req.body.details;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        hasError: true,
        product: {
          title: updatedTitle,
          imageUrl: updatedImageUrl,
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

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    product.category = updatedCategory;
    product.details = updatedDetails;
    await product.save();

    console.log("UPDATED PRODUCT!");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};


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
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

