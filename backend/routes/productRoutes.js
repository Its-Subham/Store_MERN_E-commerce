import express from "express";
import formmidable from 'express-formidable'
const router = express.Router()

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from '../middlewares/checkId.js'
import { addProduct, updateProductDetais, removeProduct, fetchProducts, fetchProductById, fetchAllProducts, fetchSimilarProducts, addProductReview, fetchTopProducts, fetchNewProducts, filterProducts } from "../controllers/productController.js";

router.route("/").get(fetchProducts).post(authenticate, authorizeAdmin, formmidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts)

router.route("/similar/:categoryID").get(fetchSimilarProducts)

router.route("/:id/reviews").post(authenticate, checkId, addProductReview)

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.route('/:id').get(fetchProductById).put(authenticate, authorizeAdmin, formmidable(), updateProductDetais).delete(authenticate, authorizeAdmin, removeProduct)

router.route('/filtered-products').post(filterProducts)

export default router;