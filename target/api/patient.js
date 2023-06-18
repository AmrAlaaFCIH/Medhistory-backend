"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../index");
const index_2 = require("../index");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const result = await index_1.prisma.patients.findMany({
        select: {
            P_ID: true,
            P_First_Name: true,
            P_Last_Name: true,
            P_Email: true,
            P_Address: true,
            P_DOB: true,
            P_Phone_Number_Relative: true,
            P_Blood_Type: true,
            P_Gender: true,
            P_Marital_Status: true,
            phones: {
                select: {
                    P_phone: true
                }
            }
        }
    });
    res.json(result);
});
router.get('/:id', async (req, res) => {
    const result = await index_1.prisma.patients.findUnique({
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
            P_Gender: true,
            P_Blood_Type: true,
            P_Marital_Status: true,
            phones: {
                select: {
                    P_phone: true
                }
            }
        }
    });
    res.json(result);
});
router.get('/medical/:id', async (req, res) => {
    const result = await index_1.prisma.patients.findUnique({
        where: { P_ID: req.params.id }, select: {
            medicalHistory: {
                select: {
                    MedicineName: true,
                    Follow_Up: true,
                    Medical_Analysis: true,
                    x_ray: true,
                    Medicines_Date: true,
                    Medicines_Dose: true
                }
            }
        }
    });
    res.json(result);
});
router.get('/notification/:id', async (req, res) => {
    const result = await index_1.prisma.patients.findUnique({
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
                            Doc_Speciality: true,
                            Doc_Card_Number: true
                        }
                    },
                    Status: true
                }
            }
        }
    });
    res.json(result);
});
router.post('/respond', [
    (0, express_validator_1.body)('notId')
        .notEmpty()
        .withMessage('notfication id is required')
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors });
    }
    const notification = await index_1.prisma.notfications.findUnique({
        where: { Not_ID: req.body.notId }
    });
    if (notification) {
        await index_1.prisma.notfications.update({
            where: { Not_ID: notification.Not_ID },
            data: {
                Status: true
            }
        });
        await index_1.prisma.patients.update({
            where: { P_ID: notification.P_ID },
            data: {
                Doctors: {
                    connect: {
                        Doc_ID: notification.Doc_ID
                    }
                }
            }
        });
        return res.status(200).json({ status: true, msg: "request has been accepted" });
    }
    res.status(404).json({ status: 404, msg: "there is no notification with that id" });
});
router.get('/doctors/:id', async (req, res) => {
    const result = await index_1.prisma.patients.findUnique({
        where: { P_ID: req.params.id },
        select: {
            Doctors: {
                select: {
                    Doc_First_Name: true,
                    Doc_Last_Name: true,
                    Doc_Email: true,
                    Doc_Address: true,
                    Doc_Speciality: true,
                    Doc_Card_Number: true,
                    phones: {
                        select: {
                            Doc_Phone: true
                        }
                    }
                }
            }
        }
    });
    res.json(result);
});
router.post('/register', [
    (0, express_validator_1.body)('id').notEmpty()
        .withMessage("id can't be empty")
        .isLength({ min: 5, max: 5 })
        .withMessage("id should be 5 char")
        .isNumeric()
        .withMessage("id can only contain numbers"),
    (0, express_validator_1.body)('firstName').notEmpty()
        .withMessage("first name can't be empty")
        .isAlpha()
        .withMessage("first name can only contain chars")
        .isLength({ min: 3 })
        .withMessage("first name can't be less than 3 chars"),
    (0, express_validator_1.body)('lastName').notEmpty()
        .withMessage("last name can't be empty")
        .isAlpha()
        .withMessage("last name can only contain chars")
        .isLength({ min: 3 })
        .withMessage("last name can't be less than 3 chars"),
    (0, express_validator_1.body)('maritalStatus').notEmpty()
        .withMessage("Marital status can't be empty")
        .custom((value) => {
        const allowedValues = ['single', 'married'];
        const lowercaseValue = value.toLowerCase();
        if (!allowedValues.includes(lowercaseValue)) {
            throw new Error('please enter valid maritalStatus');
        }
        return true;
    }),
    (0, express_validator_1.body)('email').notEmpty()
        .withMessage("email can't be empty")
        .isEmail()
        .withMessage("email is not valid"),
    (0, express_validator_1.body)('password').notEmpty()
        .withMessage("password can't be empty")
        .isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 })
        .withMessage("password shouldn't be less than 6 chars and should contain at least one number and one lowercase letter"),
    (0, express_validator_1.body)('address').notEmpty()
        .withMessage("address can't be empty"),
    (0, express_validator_1.body)('DOB').notEmpty()
        .withMessage("Date of Birth can't be empty")
        .isDate()
        .withMessage("please enter a valid date"),
    (0, express_validator_1.body)('relativePhoneNumber').notEmpty()
        .withMessage("Relative Phone Number can't be empty")
        .isNumeric()
        .withMessage("Relative Phone Number should only contain numbers"),
    (0, express_validator_1.body)('phones[0]').notEmpty()
        .withMessage('patient should at least have one phone number'),
    (0, express_validator_1.body)('gender').notEmpty()
        .withMessage('gender can not be empty')
        .custom((value) => {
        const allowedValues = ['male', 'female'];
        const lowercaseValue = value.toLowerCase();
        if (!allowedValues.includes(lowercaseValue)) {
            throw new Error('value should be male or female');
        }
        return true;
    }),
    (0, express_validator_1.body)('bloodType').notEmpty()
        .withMessage('bloodtype can not be empty')
        .custom((value) => {
        const allowedValues = ["a-", "a+", "b+", "b-", "ab+", "ab-", "o+", "o-"];
        const lowercaseValue = value.toLowerCase();
        if (!allowedValues.includes(lowercaseValue)) {
            throw new Error('please enter valid bloodtype');
        }
        return true;
    })
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    const password_hash = await bcrypt_1.default.hash(req.body.password, index_2.salt_rounds);
    try {
        const patient = await index_1.prisma.patients.create({
            data: {
                P_ID: req.body.id,
                P_First_Name: req.body.firstName,
                P_Last_Name: req.body.lastName,
                P_Email: req.body.email,
                P_Password: password_hash,
                P_Address: req.body.address,
                P_Phone_Number_Relative: req.body.relativePhoneNumber,
                P_DOB: new Date(req.body.DOB),
                P_Blood_Type: req.body.bloodType.toLowerCase(),
                P_Gender: req.body.gender.toLowerCase(),
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
        });
        res.status(200).json({ status: true, data: patient });
    }
    catch (error) {
        res.status(400).json({ status: false, errors: error });
    }
});
router.post('/login', [
    (0, express_validator_1.body)('id').notEmpty()
        .withMessage("id can't be empty")
        .isLength({ min: 5, max: 5 })
        .withMessage("id can't be less than 5 char")
        .isNumeric()
        .withMessage("id can only contain numbers"),
    (0, express_validator_1.body)('password').notEmpty()
        .withMessage("password can't be empty")
        .isStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minSymbols: 0, minUppercase: 0 })
        .withMessage("password shouldn't be less than 6 chars and should contain at least one number and one lowercase letter")
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    const result = await index_1.prisma.patients.findUnique({ where: { P_ID: req.body.id } });
    if (result == null) {
        return res.status(404).json({ status: false, errors: "no user found for this id" });
    }
    const canLogin = await bcrypt_1.default.compare(req.body.password, result.P_Password);
    if (canLogin) {
        return res.status(200).json({ status: true, msg: "user can login" });
    }
    else {
        return res.status(400).json({ status: false, msg: "password is not right" });
    }
});
exports.default = router;
