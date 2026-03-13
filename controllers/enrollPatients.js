import db from '../config/db.js';

export const enrollPatients = async (req, res) => {
  try {
    // 1. Extract the data from the incoming request
    const { 
      hospitalId, 
      patientName, 
      phoneNumber, 
      gender, 
      nextDeliveryDate, 
      location, 
      email 
    } = req.body;

    // 2. Set your default values
    const defaultPaymentStatus = 'Unpaid';
    const defaultStatus = 'Assigned';

    // 3. The SQL Insert Query
    const insertQuery = `
      INSERT INTO patients 
      (hospitalId, patientName, phoneNumber, gender, nextDeliveryDate, location, paymentStatus, status, email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 4. Execute the query
    const [result] = await db.query(insertQuery, [
      hospitalId,
      patientName,
      phoneNumber,
      gender,
      nextDeliveryDate,
      location,
      defaultPaymentStatus,
      defaultStatus,
      email
    ]);

    // 5. Send a success response back to the frontend
    res.status(201).json({
      message: `${patientName} enrolled successfully!`,
      newPatientId: result.insertId // Returns the new auto-incremented ID!
    });

  } catch (error) {
    console.error("Error enrolling patient:", error);
    res.status(500).json({ message: "Internal server error while enrolling patient" });
  }
};