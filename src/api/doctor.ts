import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../index';
import { salt_rounds } from '../index';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await prisma.doctors.findMany({
        select: {
            Doc_ID: true,
            Doc_First_Name: true,
            Doc_Last_Name: true,
            Doc_Email: true,
            Doc_Address: true,
            Doc_Card_Number:true,
            Doc_Speciality:true,
            phones: {
                select: {
                    Doc_Phone: true
                }
            }
        }
    });

    res.json(result);
})

router.get('/:email', async (req, res) => {
    const result = await prisma.doctors.findUnique({
        where: { Doc_Email: req.params.email },
        select: {
            Doc_ID: true,
            Doc_First_Name: true,
            Doc_Last_Name: true,
            Doc_Email: true,
            Doc_Address: true,
            Doc_Card_Number:true,
            Doc_Speciality:true,
            phones: {
                select: {
                    Doc_Phone: true
                }
            }
        }
    })
    res.json(result);
})

router.get('/patients/:email', async (req, res) => {
    const result = await prisma.doctors.findUnique({
        where: { Doc_Email: req.params.email },
        select: {
            Patients: {
                select: {
                    P_ID: true,
                    P_First_Name: true,
                    P_Last_Name: true,
                    P_Email: true,
                    P_Address: true,
                    P_Marital_Status: true,
                    P_DOB: true,
                    P_Phone_Number_Relative: true,
                    P_Blood_Type:true,
                    P_Gender:true,
                    phones: {
                        select: {
                            P_phone: true
                        }
                    }
                }
            }
        }
    })
    res.json(result);
})

router.get('/notification/:email', async (req, res) => {
    const result = await prisma.doctors.findUnique({
        where: { Doc_Email: req.params.email },
        select: {
            notifications: {
                select: {
                    Not_ID: true,
                    patient: {
                        select: {
                            P_ID: true,
                            P_First_Name: true,
                            P_Last_Name: true
                        }
                    },
                    Status: true
                }
            }
        }
    });
    res.json(result);
})

interface notify {
    docEmail: string;
    patientId: string;
}

router.post('/notfiy', [
    body('docEmail')
        .notEmpty()
        .withMessage('doctor email cannot be empty')
        .isEmail()
        .withMessage('doctor email is not valid'),
    body('patientId')
        .notEmpty()
        .withMessage('patient ID cannot be empty')
        .isLength({ min: 5, max: 5 })
        .withMessage("patient id should be 5 chars")
], async (req: Request<{}, {}, notify>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors });
    }
    const doctor = await prisma.doctors.findUnique({ where: { Doc_Email: req.body.docEmail } });
    const patient = await prisma.patients.findUnique({ where: { P_ID: req.body.patientId } });
    if (doctor && patient) {
        await prisma.notfications.create({
            data: {
                Doc_ID: doctor.Doc_ID,
                P_ID: patient.P_ID
            }
        })
        return res.status(200).json({ status: true, msg: "patient has been notified" });
    }
    res.status(404).json({ status: false, msg: "doctor or patient isn't found" });
})


interface MedicineBody {
    docEmail: string;
    patientId: string;
    MedicineName: string;
    followUp: string;
    xRay: Buffer;
    medicalAnalysis: Buffer;
    medicinesDate: string;
    medicinesDose: string;
}

router.post('/add-medicine', [
    body('docEmail').notEmpty()
        .withMessage("doctor email can't be empty")
        .isEmail()
        .withMessage("doctor email is not valid"),
    body('patientId')
        .notEmpty()
        .withMessage('patient ID cannot be empty')
        .isLength({ min: 5, max: 5 })
        .withMessage("patient id should be 5 chars"),
    body('MedicineName')
        .notEmpty()
        .withMessage('MedicineName can not be empty'),
    body('followUp')
        .notEmpty()
        .withMessage('follow up info can not be empty'),
    body('medicinesDate').notEmpty()
        .withMessage("medicines Date can't be empty")
        .isDate()
        .withMessage("please enter a valid medicines Date"),
    body('medicinesDose')
        .notEmpty()
        .withMessage('medicines Dose can not be empty')
        .isNumeric()
        .withMessage('medicines Dose can only have numbers')
], async (req: Request<{}, {}, MedicineBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors });
    }
    // get the doctor using his email
    const doctor = await prisma.doctors.findUnique(
        {
            where: { Doc_Email: req.body.docEmail }
            , include: { Patients: true }
        });

    if (!doctor) {
        return res.status(404).json({ status: false, msg: "there is no doctor with that email" });
    }

    //check if the doctor have the premisson to add medicine to that patient
    let patient = doctor.Patients.filter(x => x.P_ID == req.body.patientId);
    if (patient.length == 0) {
        return res.status(403)
                  .json({ status: false, msg: "you don't have the permission to add medicine to that patient" });
    }

    await prisma.medical.create({
        data:{
            P_ID:req.body.patientId,
            MedicineName:req.body.MedicineName,
            Medical_Analysis:req.body.medicalAnalysis,
            Follow_Up:req.body.followUp,
            Medicines_Date:new Date(req.body.medicinesDate),
            Medicines_Dose: Number(req.body.medicinesDose),
            x_ray:req.body.xRay
        }
    })

    res.status(200).json({status:true,msg:"medicine created for the patient"});
})





interface RegisterBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phones: string[];
    cardNumber: string;
    speciality: string;
}

router.post('/register', [
    body('firstName').notEmpty()
        .withMessage("first name can't be empty")
        .isAlpha()
        .withMessage("first name can only contain chars")
        .isLength({ min: 3 })
        .withMessage("first name can't be less than 3 chars"),
    body('lastName').notEmpty()
        .withMessage("last name can't be empty")
        .isAlpha()
        .withMessage("last name can only contain chars")
        .isLength({ min: 3 })
        .withMessage("last name can't be less than 3 chars"),
    body('email').notEmpty()
        .withMessage("email can't be empty")
        .isEmail()
        .withMessage("email is not valid"),
    body('password').notEmpty()
        .withMessage("password can't be empty")
        .isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 })
        .withMessage("password shouldn't be less than 6 chars and should contain at least one number and one lowercase letter"),
    body('address').notEmpty()
        .withMessage("address can't be empty"),
    body('phones[0]').notEmpty()
        .withMessage('doctor should at least have one phone number'),
    body('cardNumber').notEmpty()
        .withMessage('cardNumber can not be empty')
        .isNumeric()
        .withMessage('cardNumber should only contain numbers'),
    body('speciality').notEmpty()
        .withMessage('speciality can not be empty')

], async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() })
    }

    const password_hash = await bcrypt.hash(req.body.password, salt_rounds);

    try {
        const doctor = await prisma.doctors.create({
            data: {
                Doc_First_Name: req.body.firstName,
                Doc_Last_Name: req.body.lastName,
                Doc_Email: req.body.email,
                Doc_Password: password_hash,
                Doc_Address: req.body.address,
                Doc_Card_Number:req.body.cardNumber,
                Doc_Speciality:req.body.speciality,
                phones: {
                    create: req.body.phones.map(x => ({ "Doc_Phone": x }))
                }
            },
            include: {
                phones: {
                    select: {
                        Doc_Phone: true
                    }
                }
            }
        })
        res.status(200).json({ status: true, data: doctor })
    } catch (error) {
        res.status(400).json({ status: false, errors: error })
    }
})



interface LoginBody {
    email: string;
    password: string;
}

router.post('/login', [
    body('email').notEmpty()
        .withMessage("email can't be empty")
        .isEmail()
        .withMessage("email is not valid"),
    body('password').notEmpty()
        .withMessage("password can't be empty")
        .isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 })
        .withMessage("password shouldn't be less than 6 chars and should contain at least one number and one lowercase letter")

], async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() })
    }
    const result = await prisma.doctors.findUnique({ where: { Doc_Email: req.body.email } });
    if (result == null) {
        return res.status(404).json({ status: false, errors: "no user found for this email" });
    }
    const canLogin = await bcrypt.compare(req.body.password, result.Doc_Password);
    if (canLogin) {
        return res.status(200).json({ status: true, data: result });
    } else {
        return res.status(400).json({ status: false, msg: "password is not right" })
    }
})




export default router;