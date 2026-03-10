import { database } from "../database/db.js"

const { patients } = database

export const getAPatient = (req, res) => {
    const { id } = req.params
    
    const filteredData = patients

    if(Number(id) > filteredData.length || Number(id) <= 0){
        return res.status(404).json({message: "User not found"})
    }
    
    const patient = filteredData[Number(id) - 1]

    res.json({data: patient})
}