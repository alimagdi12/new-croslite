const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Stripe = require("stripe");
const user = require("../models/user");
const stripe = Stripe(
  "sk_test_51OmeLSKnxvTYYIlSbsJaeNY5XyiliPJfGg6vA9JQev5T442TXqnEBg2OdZcFZx4Gs5EKVbA7lQ0GO4RyAiM0qbvj005mnOklV9"
);
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alimagdi12367@gmail.com",
    pass: "aimorddjdtspxute",
  },
});

exports.getHome = (req, res, next) => {
  const token = req.cookies.token;
  let isAuthenticated = false; // Initialize isAuthenticated outside of the if block

  if (!token) {
    Product.find()
      .then((products) => {
        res.render("shop/home", {
          prods: products,
          pageTitle: "Home",
          path: "/products",
          isAuthenticated: isAuthenticated, // Use the initialized value
        });
      })
      .catch((err) => {
        console.log(err);
      });
    return; // Add this to exit the function early if there's no token
  }

  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.redirect("/login"); // Redirect to login if token is invalid
    }

    console.log(decodedToken);
    isAuthenticated = true; // Update isAuthenticated if token is valid

    Product.find()
      .then((products) => {
        res.render("shop/home", {
          prods: products,
          pageTitle: "Home",
          path: "/products",
          isAuthenticated: isAuthenticated,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login"); // Redirect to login if there's an error
      });
  });
};

exports.getSearch = (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  console.log(token);
  if (!token) {
    isLoggedIn = false;
    const search = req.session.search || [];
    res.render("shop/search", {
      pageTitle: "search",
      search: search,
      isAuthenticated: isLoggedIn,
    });
  }
  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return (isLoggedIn = false);
    }
    console.log(decodedToken);
    isLoggedIn = true;
    const search = req.session.search || [];
    res.render("shop/search", {
      pageTitle: "search",
      search: search,
      isAuthenticated: isLoggedIn,
    });
  });
};

exports.postSearch = async (req, res, next) => {
  const search = req.body.search;
  if (!search) {
    return res.redirect("/search");
  }
  const newSearch = await Product.find({
    title: { $regex: search, $options: "i" },
  })
    .then((data) => {
      console.log("Data from DB", data);
      req.session.search = data;
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/search");
};



// exports.getFilter = async (req, res, next) => {
//   const category = req.query.category || 'all';
//   let products;

//   if (category === 'all') {
//     products = await Product.find();
//   } else {
//     products = await Product.find({ category: category });
//   }

//   res.json(products);
// };




exports.getProducts = async (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  console.log(token);
  if (!token) {
    isLoggedIn = false;
    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const categoryCounts = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);

      const countsMap = {};
      categoryCounts.forEach(cat => {
        countsMap[cat._id] = cat.count;
      });
    try {
      const totalProducts = await Product.countDocuments();
      const products = await Product.find()
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.render("shop/shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasNextPage: perPage * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / perPage),
        isAuthenticated: isLoggedIn,
        categoryCounts: countsMap
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  jwt.verify(token, "your_secret_key", async (err, decodedToken) => {
    if (err) {
      return (isLoggedIn = false);
    }
    console.log(decodedToken);
    isLoggedIn = true;
    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const categoryCounts = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);

      const countsMap = {};
      categoryCounts.forEach(cat => {
        countsMap[cat._id] = cat.count;
      });
    try {
      const totalProducts = await Product.countDocuments();
      const products = await Product.find()
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.render("shop/shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasNextPage: perPage * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / perPage),
        isAuthenticated: isLoggedIn,
        categoryCounts: countsMap
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

exports.getProduct = (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  console.log(token);
  if (!token) {
    isLoggedIn = false;
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        res.render("shop/shop-detail", {
          product: product,
          pageTitle: product.title,
          path: "/products",
          isAuthenticated: req.cookies.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  }
  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return (isLoggedIn = false);
    }
    console.log(decodedToken);
    isLoggedIn = true;
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        res.render("shop/shop-detail", {
          product: product,
          pageTitle: product.title,
          path: "/products",
          isAuthenticated: req.cookies.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  });
};

// exports.getIndex = (req, res, next) => {
//   Product.find()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.getContact = (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  console.log(token);
  if (!token) {
    isLoggedIn = false;
    res.render("shop/contact", {
      pageTitle: "contact",
      isAuthenticated: isLoggedIn,
    });
  }
  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return (isLoggedIn = false);
    }
    console.log(decodedToken);
    isLoggedIn = true;
    res.render("shop/contact", {
      pageTitle: "contact",
      isAuthenticated: isLoggedIn,
    });
  });
};

exports.postContact = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  transporter.sendMail({
    to: "alimagdi12367@gmail.com",
    from: "alimagdi12367@gmail.com",
    subject: "Order details",
    html: `
      <p>Contact Details:</p>
      <ul>
      <li>${name}</li>
      <li>${email}</li>
      <li>${message}</li>

      </ul>
    `,
  });
  res.redirect("/contact");
};

exports.getAbout = (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  console.log(token);
  if (!token) {
    isLoggedIn = false;
    res.render("shop/about", {
      pageTitle: "About",
      path: "/about",
      isAuthenticated: isLoggedIn,
    });
  }
  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return (isLoggedIn = false);
    }
    console.log(decodedToken);
    isLoggedIn = true;
    res.render("shop/about", {
      pageTitle: "About",
      path: "/about",
      isAuthenticated: isLoggedIn,
    });
  });
};

exports.getCart = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;
    const isLoggedIn = true;
    const user = await User.findById(userId)
      .populate("cart.items.productId")
      .exec();

    const products = user.cart.items;
    const totalPrice = products.reduce(
      (total, p) => total + p.productId.price * p.quantity,
      0
    ); // Calculate total price
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Cart",
      products: products,
      totalPrice: totalPrice, // Pass total price to the template,
      isAuthenticated: isLoggedIn,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, "your_secret_key");
  const userId = decodedToken.userId;

  await Product.findById(prodId)
    .then((product) => {
      return User.findById(userId).then((user) => {
        user.addToCart(product);
      });
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;
    await User.findById(userId)
      .then((user) => {
        user.removeFromCart(prodId);
      })
      .then((result) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("You must be logged in to make a purchase!");
    }
    jwt.verify(token, "your_secret_key", (err, decodedToken) => {
      if (err) {
        console.log(err);
      }
      userId = decodedToken.userId;

      User.findById(userId)
        .populate("cart.items.productId")
        .exec()
        .then((user) => {
          const products = user.cart.items.map((i) => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
          });
          const totalPrice = products.reduce((acc, product) => {
            return acc + product.quantity * product.product.price;
          }, 0);

<<<<<<< HEAD
          // Send email with product details
          transporter.sendMail({
            to: decodedToken.email,
            from: "alimagdi12367@gmail.com",
            subject: "Order Details",
            html: `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Details</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .header h1 {
      color: #333333;
    }
    .content {
      font-size: 16px;
      color: #333333;
      padding: 20px 0;
    }
    .content ul {
      list-style-type: none;
      padding: 0;
    }
    .content li {
      background-color: #fafafa;
      margin: 10px 0;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #dddddd;
    }
    .content .total {
      font-weight: bold;
      padding-top: 10px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      font-size: 12px;
      color: #aaaaaa;
      border-top: 1px solid #eeeeee;
    }
    .footer p {
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Details</h1>
    </div>
    <div class="content">
      <p>Thank you for your purchase! Here are your order details:</p>
      <ul id="order-list">
        ${products
                        .map(
                          (product) =>
                            `<li>${product.product.title} - ${product.quantity} x $${product.product.price.toFixed(2)}</li>`
                        )
                        .join("")}
      </ul>
      <p class="total" id="total-price">Total Price: $${totalPrice.toFixed(2)}</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>

</body>
</html>

=======
          // Send email with products details
          transporter.sendMail({
            to: decodedToken.email,
            from: "alimagdi12367@gmail.com",
            subject: "Order details",
            html: `
              <p>Your order details:</p>
              <ul>
                ${products
                  .map(
                    (product) =>
                      `<li>${product.product.title} - ${product.quantity} x $${product.product.price}</li>`
                  )
                  .join("")}
              </ul>
              <p>Total Price: $${totalPrice}</p>
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
            `,
          });
        })
        .then(() => {
          const user = User.findById(userId).then((user) => {
            user.clearCart();
            res.redirect("/products");
          });
        })
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
};

// exports.getOrders = (req, res, next) => {
//   Order.find({ 'user.userId': req.user._id })
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//     })
//     .catch(err => console.log(err));
// };

exports.getOrders = async (req, res, next) => {
  try {
    const token = req.headers.jwt;
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;
    const orders = await Order.find({ "user.userId": userId });

    const ordersWithTotalPrice = orders.map((order) => {
      const total = order.products.reduce((acc, product) => {
        return acc + product.quantity * product.product.price;
      }, 0);
      return { ...order.toObject(), totalPrice: total };
    });

    res.render("shop/orders2", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: ordersWithTotalPrice,
      isAuthenticated: req.cookies.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

// exports.postPayement=async (req, res) => {
//   const { totalPrice } = req.body;

//   const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//           {
//               price_data: {
//                   currency: 'usd',
//                   product_data: {
//                       name: 'Your Product Name',
//                   },
//                   unit_amount: totalPrice,
//               },
//               quantity: 1,
//           },
//       ],
//       mode:'payment',
//       success_url: `${req.protocol}://${req.get('host')}/ckeckout-success?success=true`,
//       cancel_url: `${req.protocol}://${req.get('host')}/cart?canceled=true`,

//   });

//   res.send({ url: session.url });};

exports.getProfile = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    let isAuthenticated = false;
    if (token) {
      isAuthenticated = true;
    }
    const decodedToken = jwt.verify(token, "your_secret_key");
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    res.render("shop/userProfile", {
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
      isAuthenticated:isAuthenticated,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

exports.postUpdateUser = async (req, res) => {
  try {
    const { username, fname, lname, birthDay, gender, email, mobile } =
      req.body;
    const updatedUser = await User.findOneAndUpdate({
      username,
      firstName: fname,
      lastName: lname,
      birthDay: new Date(birthDay),
      gender,
      email,
      phoneNumber: mobile,
    });
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating user data" });
  }
};

exports.postFooterSearch = (req, res, next) => {
  const email = req.body.email;
  transporter.sendMail({
    to: "alimagdi12367@gmail.com",
    from: "alimagdi12367@gmail.com",
<<<<<<< HEAD
    subject: "Contact Subscribe",
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #333333;
          }
          .content {
            font-size: 16px;
            color: #333333;
          }
          .content ul {
            list-style-type: none;
            padding: 0;
          }
          .content li {
            background-color: #f9f9f9;
            margin: 10px 0;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #dddddd;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #aaaaaa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Contact Subscribe</h1>
          </div>
          <div class="content">
            <p>You have a new subscriber:</p>
            <ul>
              <li>${email}</li>
            </ul>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
=======
    subject: "contact subscribe ",
    html: `
      <p>Contact subscribe:</p>
      <ul>
      <li>${email}</li>
  
      </ul>
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
    `,
  });
  res.redirect("/");
};



<<<<<<< HEAD

=======
>>>>>>> b95c79e771431ed57d2c936437f083d4f12baefa
exports.getFilter = async (req, res, next) => {
  const token = req.cookies.token;
  let isLoggedIn;
  const category = req.query.category || 'all'; // Extract the category from the query parameters

  console.log(token);
  if (!token) {
    isLoggedIn = false;
    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const categoryCounts = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);

      const countsMap = {};
      categoryCounts.forEach(cat => {
        countsMap[cat._id] = cat.count;
      });
    try {
      let products;
      if (category === 'all') {
        products = await Product.find()
          .skip((page - 1) * perPage)
          .limit(perPage);
      } else {
        products = await Product.find({ category: category })
          .skip((page - 1) * perPage)
          .limit(perPage);
      }
      const totalProducts = await Product.countDocuments();

      res.render("shop/shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasNextPage: perPage * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / perPage),
        isAuthenticated: isLoggedIn,
        categoryCounts: countsMap
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  jwt.verify(token, "your_secret_key", async (err, decodedToken) => {
    if (err) {
      return (isLoggedIn = false);
    }
    console.log(decodedToken);
    isLoggedIn = true;
    const page = parseInt(req.query.page) || 1;
    const perPage = 15;
    const categoryCounts = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const countsMap = {};
      categoryCounts.forEach(cat => {
      countsMap[cat._id] = cat.count;
    });
    try {
      let products;
      const totalProducts = await Product.countDocuments();
      if (category === 'all') {
        products = await Product.find()
          .skip((page - 1) * perPage)
          .limit(perPage);
      } else {
        products = await Product.find({ category: category })
          .skip((page - 1) * perPage)
          .limit(perPage);
      }

      res.render("shop/shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasNextPage: perPage * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / perPage),
        isAuthenticated: isLoggedIn,
        categoryCounts: countsMap

      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

exports.postIncreaseCart = async (req, res, next) => {
    const productId = req.body.prodId; 
  let token = req.cookies.token;
  console.log('Request Body:', req.body);
    console.log('Product ID:', productId);
        jwt.verify(token, "your_secret_key", async (err, decodedToken) => {
        if (err) {
          return res.redirect('/cart');
          console.error(err)
        }

        try {
            const user = await User.findById(decodedToken.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.increaseQuantityInCart(productId);
            return res.redirect('/cart');
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Server error' });
        }
    });
};

exports.postDecreaseCart = async (req, res, next) => {
    const productId = req.body.prodId; 
    let token = req.cookies.token;
    jwt.verify(token, 'your_secret_key', async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        try {
            const user = await User.findById(decodedToken.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.decreaseQuantityInCart(productId);
            return res.status(200).json({ message: 'Quantity decreased successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Server error' });
        }
    });
};
