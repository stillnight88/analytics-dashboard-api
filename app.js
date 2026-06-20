import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import path from 'path';

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

app.use('/auth', authRoutes);  
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes); 


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✅");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

const startServer = async () => {
    await dbConnection();
    
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
};

startServer();


app.get("/signup", (req, res) => {
  res.render("signUp");
});

app.get("/login", (req, res) => {
  res.render("login"); 
});

