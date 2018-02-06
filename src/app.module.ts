import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {SessionService} from "./components/session.service";
import {TrackerMiddleware} from "./middleware/tracker.middleware";
import {MaxmindService} from "./components/maxmind.service";
import {RedisProvider} from "./providers/redis.provider";

@Module({
    imports: [],
    controllers: [AppController],
    components: [
        RedisProvider,
        SessionService,
        MaxmindService,
    ],
})
export class ApplicationModule implements NestModule {

    configure(consumer: MiddlewaresConsumer): void {

        // Apply tracker middleware
        consumer.apply(TrackerMiddleware).forRoutes(
            {path: '/', method: RequestMethod.GET},
            {path: '/convert', method: RequestMethod.GET},
            {path: '/convert', method: RequestMethod.POST}
        );
    }
}
