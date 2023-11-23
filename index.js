import express from "express";
import { PORT, mongoUrl } from "./config.js";
import cors from "cors";
import mongoose from "mongoose";
import { Resort } from "./models/resort.js";

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("This is the first MERN project");
});

// Read

app.get("/getResort", async (req, res) => {
  try {
    let data = await Resort.find({});
    return res.status(200).json({
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Read one

app.get("/getResort/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let data = await Resort.findById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create

app.post("/addResort", async (req, res) => {
  try {
    const resort = req.body;
    const newResort = await Resort.create(resort);
    res.status(201).json(newResort);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Update

app.put("/updateResort/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let resort = req.body;
    let data = await Resort.findByIdAndUpdate(id, resort);
    if (!data) {
      return res.status(404).json({ message: "Resort not found" });
    }
    return res.status(200).json({ message: "Resort has been updated" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Delete

app.delete("/deleteResort/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let data = await Resort.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: "Resort not found" });
    }
    return res.status(200).json({ message: "Resort has been deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Connect to DB

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("App is connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
