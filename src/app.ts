import { Request, Response } from 'express';
import apiRoutes from './routes/apiRoutes';
import adminRoutes from './routes/adminRoutes';

var express     = require("express");
var morgan      = require("morgan");
// var cors        = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
// Routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.all(/.*/, (req:Request, res:Response) => {
  res.status(404).json({error: "Invalid Endpoint."});
});

export default app;
