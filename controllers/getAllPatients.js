import { database } from "../database/db.js"

const { patients } = database

export const getAllPatients = (_req, res) => {
    res.json({
        totalPages: Math.ceil(patients.length / 10),
        deliveries: patients.length,
        data: patients
    })
}