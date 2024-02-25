"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./database/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
let corsOrigin;
if (process.env.NODE_ENV === 'dev') {
    corsOrigin = `http://${process.env.HOST}:${process.env.CLIENT_PORT}`;
}
else if (process.env.NODE_ENV === 'prod') {
    corsOrigin = process.env.REACT_APP_CLIENT_URL || '*';
}
else {
    throw new Error('O ambiente não está definido corretamente');
}
app.use((0, cors_1.default)({
    origin: '*',
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: '*',
    credentials: true,
    optionsSuccessStatus: 200
}));
// Ajuste a política de referência como uma configuração separada, pois não é parte do CORS
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer'); // Definir política de referência
    next();
});
// Increase upload limit to 50mb
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
const handleError_1 = __importDefault(require("./helpers/handleError"));
// Public Images
app.use(express_1.default.static('public'));
// routes
const ProductRoutes_1 = __importDefault(require("./routes/ProductRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const CategoryRoutes_1 = __importDefault(require("./routes/CategoryRoutes"));
const CartRoutes_1 = __importDefault(require("./routes/CartRoutes"));
app.use('/product', ProductRoutes_1.default);
app.use('/user', UserRoutes_1.default);
app.use('/category', CategoryRoutes_1.default);
app.use('/cart', CartRoutes_1.default);
app.use((err, req, res, next) => {
    (0, handleError_1.default)(err, req, res, next);
});
// Definição da rota raiz
app.get('/', (req, res) => {
    res.json('Bem-vindo à minha API!');
});
(0, db_1.connectToDatabase)().then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server listening on port ${process.env.SERVER_PORT}`);
    });
});
