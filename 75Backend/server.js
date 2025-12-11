import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';

// --- Temporary test for User model ---
// import { User } from './models/User.js';


dotenv.config();

const app = express();


// Middlewares
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// uploads route and static serving
app.use('/api/upload', uploadRoutes);

// make uploads folder publicly accessible
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// connect to MongoDB
connectDB();


// const runModelTest = async () => {
//   try {
//     // create a new user object (memory only for now)
//     const testUser = new User({
//       name: 'Testing Model',
//       email: 'testmodel@example.com',
//       passwordHash: 'hashedtestpassword',
//       role: 'admin'
//     });

//     // save it to Atlas
//     const savedUser = await testUser.save();
//     console.log('✅ User saved to database:', savedUser._id);
//   } catch (error) {
//     console.error('❌ Model test failed:', error.message);
//   }
// };

// runModelTest();
// // --- End of temporary test ---

// Default route
app.get("/", (req, res) => {
  res.send("75TechStore Backend API is running...");
});


// Server start point
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







