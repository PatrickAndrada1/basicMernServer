import express from "express";
import { PORT, mongoUrl } from "./config.js";
import cors from "cors";
import mongoose from "mongoose";
import Excel from "exceljs"
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

// Import to Excel

app.get("/toExcel", async (req, res) => {
  try {
    let data = await Resort.find({});

    // Create a new Excel workbook
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Define columns based on JSON keys
    const columns = Object.keys(data[0]);
    worksheet.columns = columns.map((col) => ({ header: col, key: col }));

    // Add data from JSON to the worksheet
    worksheet.addRows(data);

    // Set border styles for cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        // Apply border to all cells
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Write to a file
    workbook.xlsx
      .writeFile("example_with_border.xlsx")
      .then(() => {
        console.log("Excel file created with borders");
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();

    return res.status(200).json({
      data
    });

  } catch (error) {
    res.status(500).send("Error generating Excel file");
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
