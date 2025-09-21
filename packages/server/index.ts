import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors'; // ✅ Import cors
import router from './route.js'; // ensure extension if needed

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Use cors properly
// app.use(
//    cors({
//       origin: 'http://localhost:5173',
//       methods: ['GET', 'POST', 'PUT', 'DELETE'],
//       allowedHeaders: ['Content-Type'],
//    })
// );

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
