import { database } from "../database/db.js"

const { patients } = database

export const enrollPatients = (req, res) => {
    console.log(req.body)
    res.json({
        message: `${req.body.patientName} enrolled successfully!`
    })
}