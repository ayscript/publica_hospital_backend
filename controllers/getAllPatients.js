import db from "../config/db.js";

export const getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sortBy = req.query?.sortBy || "dateAdded";
    let reverse = req.query?.reverse || "false"

    // console.log(sortBy)

    if (sortBy.toLowerCase() === "hospital_id") {
      sortBy = "hospitalId";
    } else if (sortBy.toLowerCase() === "name") {
      sortBy = "patientName";
    } else if (sortBy.toLowerCase() === "delivery_date") {
      sortBy = "nextDeliveryDate";
    } else if (sortBy.toLowerCase() === "location") {
      sortBy = "location";
    } else {
        sortBy = "dateAdded"
    }

    if(sortBy = "dateAdded"){
        reverse = "true"
    }

    const offset = (page - 1) * limit;
    const [countResult] = await db.execute(
      "SELECT COUNT(*) AS total FROM patients",
    );
    const totalPatients = countResult[0].total;
    
    const [rows] = await db.execute(
      // `SELECT * FROM patients LIMIT ${limit} OFFSET ${offset}`
      `SELECT * FROM patients ORDER BY ${sortBy} ${reverse === "true" ? "DESC" : ""} LIMIT ${limit} OFFSET ${offset}`,
    );

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalPatients / limit),
      deliveries: totalPatients,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
