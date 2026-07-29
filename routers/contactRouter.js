import express from 'express'
import { createContact, getContact } from '../Controllers/contactController.js'

const contactRouter = express.Router()
contactRouter.post("/",createContact)
contactRouter.get("/",getContact)

export default contactRouter