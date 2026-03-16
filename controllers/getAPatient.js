import db from "../config/db.js";

export const getAPatient = async (req, res) => {
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

    const {
      hospitalId,
      phoneNumber,
      gender,
      email,
      status,
      paymentStatus,
      nextDeliveryDate,
      location,
    } = dbPatient;

    const formattedPatient = {
      hospitalId,
      phoneNumber,
      firstName,
      lastName,
      gender,
      email,
      status,
      paymentStatus,
      nextDeliveryDate,
      location,
    };

    // Send the formatted data back to the frontend
    res.status(200).json(formattedPatient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
