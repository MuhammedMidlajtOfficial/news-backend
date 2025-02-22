const express = require("express");

const newsRouter = require('./News/newsRouter')
const categoryRouter = require('./Category/categoryRoute')

const router = express.Router();

// Apply validateJwtToken to all routes
// router.use((req, res, next) => {
//     console.log("originalUrl from validateJwtToken - ",req.originalUrl);
//     if (
//         req.originalUrl.startsWith("/api/v1/adminAuth") ||
//         req.originalUrl.startsWith("/api/v1/fcm") ||
//         req.originalUrl.startsWith("/api/v1/wati")
//     ) {
//         return next(); // Skip validation for /adminAuth,/wati and /fcm
//     }
//     validateJwtToken()(req, res, next); // Apply validation for other routes
// });

const defaultRoutes = [
    {
      path: "/news",
      route: newsRouter,
    },
    {
      path: "/categories",
      route: categoryRouter,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;