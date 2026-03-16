import db from "../config/db.js";

export const updatePatientData = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, gender, email } = req.body;

    const patientName = `${firstName} ${lastName}`.trim();

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
};
