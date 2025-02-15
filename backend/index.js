// pacakages
import path from 'path'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import express from 'express'

//Utils
import connectDB from './config/db.js'
import userRoutes from "./routes/userRoutes.js"
import  categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config()
const port = process.env.PORT || 5000;

connectDB();

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes)
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);


app.get("/api/config/razorpay", (req, res) => {
  res.json({ key_id: process.env.RAZORPAY_KEY_ID });
});

app.get("/api/config/paypal", (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
  });

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});


app.listen(port, () => console.log(`Server running on port: ${port}`));