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
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const details = req.body.details;
    const errors = validationResult(req);
    const token = await req.cookies.token;
    const decodedToken = await jwt.verify(token, "your_secret_key");
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
          imageUrl,
          price,
          description,
          details,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const product = new Product({
      category,
      title,
      price,
      description,
      details,
      imageUrl,
      userId,
    });
    await product.save();

    console.log("Created Product");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.redirect("/");
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
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

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

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
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
    const decodedToken = jwt.verify(req.body.passwordToken, "your_secret_key");
    const userId = decodedToken.userId;
    const products = await Product.find({ userId: userId });
    console.log(products);
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
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

