import express from "express"
import Student from "../models/student.js";
import { createStudents, getStudents } from "../controllers/studentcontroller.js";


const studentRouter = express.Router()

studentRouter.get("/", getStudents)


    studentRouter.post("/", createStudents)

export default studentRouter;
