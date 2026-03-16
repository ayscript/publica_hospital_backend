import express from 'express'
import { getAllPatients } from "../controllers/getAllPatients.js";
import { enrollPatients } from '../controllers/enrollPatients.js';
import { getAPatient } from '../controllers/getAPatient.js';
import { updatePatientData } from '../controllers/updatePatientData.js';

export const apiRouter = express.Router()

apiRouter.get('/patients', getAllPatients)
apiRouter.post('/patients', enrollPatients)
apiRouter.get('/patients/:id', getAPatient)
apiRouter.put('/patients/:id', updatePatientData)