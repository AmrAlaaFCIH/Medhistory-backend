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
                P_Emergency_Contact: true,
                P_Habits: true,
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
                P_Emergency_Contact: true,
                P_Habits: true,
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


interface RegisterBody {
    id: string;
    firstName: string;
    lastName: string;
    maritalStatus: string;
    email: string;
    password: string;
    address: string;
    DOB: string;
    emergencyContact: string;
    habits: string;
    phones: string[];
}

router.post('/register', [
    body('id').notEmpty()
        .withMessage("id can't be empty")
        .isLength({ min: 14, max: 14 })
        .withMessage("id can't be less than 14 char")
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
        .withMessage("Marital status can't be empty"),
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
    body('emergencyContact').notEmpty()
        .withMessage("emergency contact can't be empty")
        .isAlpha()
        .withMessage("emergency contact should only contain the name of the contact"),
    body('habits').notEmpty()
        .withMessage("habits shouldn't be empty"),
    body('phones[0]').notEmpty()
        .withMessage('patient should at least have one phone number')

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
                P_Emergency_Contact: req.body.emergencyContact,
                P_DOB: new Date(req.body.DOB),
                P_Habits: req.body.habits,
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
        .isLength({ min: 14, max: 14 })
        .withMessage("id can't be less than 14 char")
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