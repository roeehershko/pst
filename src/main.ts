import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import {Transport} from "@nestjs/microservices";

async function bootstrap() {

    const app = await NestFactory.create(ApplicationModule);
    app.connectMicroservice({
        transport: Transport.REDIS,
        url: 'redis://gateway:6379',
    });

    await app.startAllMicroservicesAsync();
    await app.listen(3000);
}

bootstrap();
