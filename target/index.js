"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salt_rounds = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const patient_1 = __importDefault(require("./api/patient"));
const doctor_1 = __importDefault(require("./api/doctor"));
//export prisma client to all routers
exports.prisma = new client_1.PrismaClient();
exports.salt_rounds = 10;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/patient', patient_1.default);
app.use('/api/doctor', doctor_1.default);
app.listen(80, () => {
    console.log("listenning on port 80");
});
