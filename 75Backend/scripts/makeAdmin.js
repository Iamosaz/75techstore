// 75Backend/scripts/makeAdmin.js
import mongoose from "mongoose";
import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // ✅ CHANGE THIS EMAIL TO WHOEVER YOU WANT TO BE ADMIN
        const targetEmail = "osazuwaikhinmwin5@gmail.com";

        const user = await User.findOneAndUpdate(
            { email: targetEmail },
            { $set: { role: "admin" } },
            { new: true }
        );

        if (!user) {
            console.log("❌ User not found! Make sure this email is registered first.");
            process.exit(1);
        }

        console.log("✅ Role updated successfully!");
        console.log("📧 Email:", user.email);
        console.log("👤 Role:", user.role);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};




// For multiple admin
// import mongoose from "mongoose";
// import { User } from "../models/User.js";
// import dotenv from "dotenv";
// dotenv.config();

// const makeAdmin = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("✅ MongoDB Connected");

//         // ✅ CHANGE THIS EMAIL TO WHOEVER YOU WANT TO BE ADMIN
//         const targetEmail = "osazuwaikhinmwin5@gmail.com";

//         const user = await User.findOneAndUpdate(
//             { email: targetEmail },
//             { $set: { role: "admin" } },
//             { new: true }
//         );

//         if (!user) {
//             console.log("❌ User not found! Make sure this email is registered first.");
//             process.exit(1);
//         }

//         console.log("✅ Role updated successfully!");
//         console.log("📧 Email:", user.email);
//         console.log("👤 Role:", user.role);
//         process.exit(0);

//     } catch (error) {
//         console.error("❌ Error:", error.message);
//         process.exit(1);
//     }
// };

// makeAdmin();




// Role to run admin from terminal
// # In your backend folder terminal
// cd 75Backend
// node scripts/makeAdmin.js

makeAdmin();
