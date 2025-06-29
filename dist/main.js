"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const corsOptions = {
        origin: [
            process.env.VOTACION_OCS_URL,
            process.env.VOTO_MOVIL_OCS_URL,
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Origin,Accept,Content-Type,Authorization',
        credentials: true,
    };
    app.enableCors(corsOptions);
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map