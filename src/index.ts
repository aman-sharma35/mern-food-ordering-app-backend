import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config'; // jo bhi humne .env ke andr define kiya hoga vo sara load ho jayega process object k andr
import mongoose from 'mongoose';
import myUserRoute from "./routes/MyUserRoute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log("Connected to database!"));

const app = express(); //this will crate a new server for us

app.use(express.json()); //app: This refers to an instance of an Express application. In Express, you create an app using express(), and then you can configure it and add routes to it.
// .use(): This is a method in Express that is used to add middleware to your application. Middleware are functions that have access to the request and response objects, and they can perform tasks like parsing incoming requests, logging, authentication, etc.
// express.json(): This is a built-in middleware function in Express. It is used to parse incoming requests with JSON payloads. When a client sends data to your server, it often sends it in JSON format. This middleware function parses that JSON data and makes it available in the req.body property of your Express route handlers.

app.use(cors()); //This is a middleware function provided by the cors package. "CORS" stands for Cross-Origin Resource Sharing. It's a security feature implemented by web browsers that restricts web pages from making requests to a different domain than the one that served the original page.

// app.get("/test", async (req: Request,res: Response) => {
//     res.json({ messaage: "Hello"})
// });

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoute);  //it's going to tell Express that any requests that start with /api/my/User it's going to forward the request onto the MyUserRoutes file. and then in there depending on what the rest of the endpoint is it will have the request on to the appropriate controller which is going to handle the business logic and any interactions with the database


app.listen(7000, () => {
  console.log("server started on localhost:7000");
});










