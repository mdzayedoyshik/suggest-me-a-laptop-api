import express from 'express';
import { matchLaptop } from '../controllers/laptopController.js';

const laptopRouter = express.Router();
laptopRouter.post('/match-laptop', matchLaptop);

export default laptopRouter;
