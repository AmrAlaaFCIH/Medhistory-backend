import express from "express";
import { PrismaClient } from "@prisma/client";
import PatientRouter from './api/patient';

//export prisma client to all routers
export const prisma= new PrismaClient();

export const salt_rounds=10;

const app=express()
app.use(express.json())

app.use('/api/patient',PatientRouter);

app.listen(5000,()=>{
    console.log("listenning on port 5000");
})

