import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {SessionService} from "./components/session";
import {TrackerMiddleware} from "./middleware/tracker.middleware";
import {MaxmindService} from "./components/maxmind";

@Module({
    imports: [],
    controllers: [AppController],
    components: [
        SessionService,
        MaxmindService
    ],
})
export class ApplicationModule implements NestModule {

    configure(consumer: MiddlewaresConsumer): void {

        // Apply tracker middleware
        consumer.apply(TrackerMiddleware).forRoutes(
            {path: '/', method: RequestMethod.GET},
            {path: '/postback', method: RequestMethod.POST},
        );
    }
}
