import express from "express";
import { PrismaClient } from "@prisma/client";
import PatientRouter from './api/patient';
import DoctorRouter from './api/doctor';
import cors from "cors";

//export prisma client to all routers
export const prisma= new PrismaClient();

export const salt_rounds=10;

const app=express()
app.use(cors())
app.use(express.json())

app.use('/api/patient',PatientRouter);
app.use('/api/doctor',DoctorRouter);

app.listen(80,()=>{
    console.log("listenning on port 80");
})

