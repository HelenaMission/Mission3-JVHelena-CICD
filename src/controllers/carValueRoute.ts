import express, { Request, Response } from "express";
import { createPool } from "mysql2/promise";
import { carValue, CarInput, CarOutput } from "../services/carValue";
require("dotenv").config();

const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const carValueRouter = express.Router();

carValueRouter.post("/api/car_value", async (req: Request, res: Response) => {
  try {
    const { model, year } = req.body as CarInput;
    if (!model || typeof model !== "string" || !year || typeof year !== "number" || year <= 0) {
      return res.status(400).json("Invalid input. Please provide a valid value for model and year.");
    }

    const carValueResult = carValue({ model, year }) as CarOutput;

    const queryResult = await pool.query("INSERT INTO car_insurance_table (model, year, value) VALUES (?, ?, ?)", [
      model,
      year,
      carValueResult.value,
    ]);

    const response: CarOutput | string = carValueResult;

    res.json(response);
  } catch (error) {
    res.status(400).json({ error });
  }
});

export { carValueRouter };