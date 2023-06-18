import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../index';
import { salt_rounds } from '../index';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await prisma.patients.findMany(
        {
            select: {
                P_ID: true,
                P_First_Name: true,
                P_Last_Name: true,
                P_Email: true,
                P_Address: true,
                P_DOB: true,
                P_Phone_Number_Relative: true,
                P_Blood_Type:true,
                P_Gender:true,
                P_Marital_Status: true,
                phones: {
                    select: {
                        P_phone: true
                    }
                }
            }
        }
    );
    res.json(result);
})

router.get('/:id', async (req, res) => {
    const result = await prisma.patients.findUnique(
        {
            where: {
                P_ID: req.params.id
            }, select: {
                P_ID: true,
                P_First_Name: true,
                P_Last_Name: true,
                P_Email: true,
                P_Address: true,
                P_DOB: true,
                P_Phone_Number_Relative: true,
                P_Gender:true,
                P_Blood_Type:true,
                P_Marital_Status: true,
                phones: {
                    select: {
                        P_phone: true
                    }
                }
            }
        }
    );
    res.json(result);
})


router.get('/medical/:id', async (req, res) => {
    const result = await prisma.patients.findUnique({
        where: { P_ID: req.params.id }, select: {
            medicalHistory: {
                select: {
                    MedicineName:true,
                    Follow_Up: true,
                    Medical_Analysis:true,
                    x_ray: true,
                    Medicines_Date: true,
                    Medicines_Dose: true
                }
            }
        }
    })
    res.json(result);
})

router.get('/notification/:id', async (req, res) => {
    const result = await prisma.patients.findUnique({
        where: { P_ID: req.params.id },
        select: {
            notifications: {
                select: {
                    Not_ID: true,
                    doctor: {
                        select: {
                            Doc_Email: true,
                            Doc_First_Name: true,
                            Doc_Last_Name: true,
                            Doc_Speciality:true,
                            Doc_Card_Number:true
                        }
                    },
                    Status: true
                }
            }
        }
    })
    res.json(result);
})

interface respond {
    notId: string;
}

router.post('/respond', [
    body('notId')
        .notEmpty()
        .withMessage('notfication id is required')
], async (req: Request<{}, {}, respond>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors });
    }
    const notification = await prisma.notfications.findUnique({
        where: { Not_ID: req.body.notId }
    });

    if (notification) {
        await prisma.notfications.update({
            where: { Not_ID: notification.Not_ID },
            data: {
                Status: true
            }
        })
        await prisma.patients.update({
            where: { P_ID: notification.P_ID },
            data: {
                Doctors: {
                    connect: {
                        Doc_ID: notification.Doc_ID
                    }
                }
            }
        })

        return res.status(200).json({ status: true, msg: "request has been accepted" })
    }

    res.status(404).json({ status: 404, msg: "there is no notification with that id" })
}
)


router.get('/doctors/:id', async (req, res) => {
    const result = await prisma.patients.findUnique({
        where: { P_ID: req.params.id },
        select: {
            Doctors: {
                select: {
                    Doc_First_Name: true,
                    Doc_Last_Name: true,
                    Doc_Email: true,
                    Doc_Address: true,
                    Doc_Speciality:true,
                    Doc_Card_Number:true,
                    phones: {
                        select: {
                            Doc_Phone: true
                        }
                    }
                }
            }
        }
    })
    res.json(result);
})


interface RegisterBody {
    id: string;
    firstName: string;
    lastName: string;
    maritalStatus: string;
    email: string;
    password: string;
    address: string;
    DOB: string;
    relativePhoneNumber: string;
    gender: string;
    bloodType: string;
    phones: string[];
}

router.post('/register', [
    body('id').notEmpty()
        .withMessage("id can't be empty")
        .isLength({ min: 5, max: 5 })
        .withMessage("id should be 5 char")
        .isNumeric()
        .withMessage("id can only contain numbers"),
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
    body('maritalStatus').notEmpty()
        .withMessage("Marital status can't be empty")
        .custom((value) => {
            const allowedValues = ['single','married'];
            const lowercaseValue = value.toLowerCase();
        
            if (!allowedValues.includes(lowercaseValue)) {
              throw new Error('please enter valid maritalStatus');
            }
        
            return true;
          }),
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
    body('DOB').notEmpty()
        .withMessage("Date of Birth can't be empty")
        .isDate()
        .withMessage("please enter a valid date"),
    body('relativePhoneNumber').notEmpty()
        .withMessage("Relative Phone Number can't be empty")
        .isNumeric()
        .withMessage("Relative Phone Number should only contain numbers"),
    body('phones[0]').notEmpty()
        .withMessage('patient should at least have one phone number'),
    body('gender').notEmpty()
        .withMessage('gender can not be empty')
        .custom((value) => {
            const allowedValues = ['male','female'];
            const lowercaseValue = value.toLowerCase();
        
            if (!allowedValues.includes(lowercaseValue)) {
              throw new Error('value should be male or female');
            }
        
            return true;
          }),
    body('bloodType').notEmpty()
        .withMessage('bloodtype can not be empty')
        .custom((value) => {
            const allowedValues = ["a-","a+","b+","b-","ab+","ab-","o+","o-"];
            const lowercaseValue = value.toLowerCase();
        
            if (!allowedValues.includes(lowercaseValue)) {
              throw new Error('please enter valid bloodtype');
            }
        
            return true;
          })

], async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() })
    }

    const password_hash = await bcrypt.hash(req.body.password, salt_rounds);

    try {
        const patient = await prisma.patients.create({
            data: {
                P_ID: req.body.id,
                P_First_Name: req.body.firstName,
                P_Last_Name: req.body.lastName,
                P_Email: req.body.email,
                P_Password: password_hash,
                P_Address: req.body.address,
                P_Phone_Number_Relative: req.body.relativePhoneNumber,
                P_DOB: new Date(req.body.DOB),
                P_Blood_Type:req.body.bloodType.toLowerCase(),
                P_Gender:req.body.gender.toLowerCase(),
                P_Marital_Status: req.body.maritalStatus,
                phones: {
                    create: req.body.phones.map(x => ({ "P_phone": x }))
                }
            },
            include: {
                phones: {
                    select: {
                        P_phone: true
                    }
                }
            }
        })
        res.status(200).json({ status: true, data: patient })
    } catch (error) {
        res.status(400).json({ status: false, errors: error })
    }
})


interface LoginBody {
    id: string;
    password: string;
}

router.post('/login', [
    body('id').notEmpty()
        .withMessage("id can't be empty")
        .isLength({ min: 5, max: 5 })
        .withMessage("id can't be less than 5 char")
        .isNumeric()
        .withMessage("id can only contain numbers"),
    body('password').notEmpty()
        .withMessage("password can't be empty")
        .isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 })
        .withMessage("password shouldn't be less than 6 chars and should contain at least one number and one lowercase letter")

], async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() })
    }
    const result = await prisma.patients.findUnique({ where: { P_ID: req.body.id } });
    if (result == null) {
        return res.status(404).json({ status: false, errors: "no user found for this id" });
    }
    const canLogin = await bcrypt.compare(req.body.password, result.P_Password);
    if (canLogin) {
        return res.status(200).json({ status: true, msg: "user can login" });
    } else {
        return res.status(400).json({ status: false, msg: "password is not right" })
    }
})


export default router;