import db from "../config/db.js";

export const getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    let sortBy = req.query?.sortBy || "dateAdded";
    let reverse = req.query?.reverse || "false";

    
    if (sortBy.toLowerCase() === "hospital_id") {
      sortBy = "hospitalId";
    } else if (sortBy.toLowerCase() === "name") {
      sortBy = "patientName";
    } else if (sortBy.toLowerCase() === "delivery_date") {
      sortBy = "nextDeliveryDate";
    } else if (sortBy.toLowerCase() === "location") {
      sortBy = "location";
    } else {
      sortBy = "dateAdded";
    }

    
    if (sortBy === "dateAdded") {
      reverse = "true";
    }

    const offset = (page - 1) * limit;

    
    let countQuery = "SELECT COUNT(*) AS total FROM patients";
    let queryParams = [];

    if (search) {
      countQuery += " WHERE patientName LIKE ?";
      queryParams.push(`%${search}%`);
    }

    
    const [countResult] = await db.execute(countQuery, queryParams);
    const totalPatients = countResult[0].total;

    
    let dataQuery = "SELECT * FROM patients";

    if (search) {
      dataQuery += " WHERE patientName LIKE ?";
    }

    
    dataQuery += ` ORDER BY ${sortBy} ${reverse === "true" ? "DESC" : ""} LIMIT ${limit} OFFSET ${offset}`;

    
    const [rows] = await db.execute(dataQuery, queryParams);

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
