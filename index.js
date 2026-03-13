import express from "express";
import { apiRouter } from "./routers/apiRouter.js";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import db from "./config/db.js";

const app = express();

app.use(cors());

const PORT = 3000;

app.use(express.json());
app.get("/api/patients/:id", async (req, res) => {
  try {
    let { id } = req.params;
    // Use parameterized queries (?) to prevent SQL Injection
    const [rows] = await db.query("SELECT * FROM patients WHERE id = ?", [id]);

    // Check if the patient exists
    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const dbPatient = rows[0];

    // 3. Map the DB row to match your React interface exactly
    // Split "Oluwaseun Aregbesola" into First and Last name
    const nameParts = dbPatient.patientName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const formattedPatient = {
      id: dbPatient.id,
      hospitalId: dbPatient.hospitalId,
      firstName: firstName || "",
      lastName: lastName || "",
      phoneNumber: dbPatient.phoneNumber,
      gender: dbPatient.gender,
      email: dbPatient.email,
      status: dbPatient.status,
      paymentStatus: dbPatient.paymentStatus,
      nextDeliveryDate: dbPatient.nextDeliveryDate,
      location: dbPatient.location,
    };

    // Send the formatted data back to the frontend
    res.status(200).json(formattedPatient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, gender, email } = req.body;

    // 1. Combine first and last name for the database
    const patientName = `${firstName} ${lastName}`.trim();

    // 2. The SQL Update Query
    const updateQuery = `
      UPDATE patients 
      SET patientName = ?, phoneNumber = ?, gender = ?, email = ?
      WHERE id = ?
    `;

    // 3. Execute the query
    const [result] = await db.query(updateQuery, [
      patientName,
      phoneNumber,
      gender,
      email,
      id,
    ]);

    // Check if a row was actually updated
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Patient not found or no changes made" });
    }

    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/api", apiRouter);
app.use("/api/auth", authRouter);
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/api`);
});
