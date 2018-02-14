import {Inject, MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {SessionService} from "./components/session.service";
import {TrackerMiddleware} from "./middleware/tracker.middleware";
import {MaxmindService} from "./components/maxmind.service";
import {RedisProvider} from "./providers/redis.provider";
import {SessionJob} from "./jobs/sessions.job";
import {Client, ClientProxy, Transport} from "@nestjs/microservices";
import {RedisClient} from "redis";
import {CampaignsSyncService} from "./components/campaigns-sync.service";
import {SplitterService} from "./components/splitter.service";

@Module({
    imports: [],
    controllers: [AppController],
    components: [
        SessionJob,
        RedisProvider,
        SessionService,
        MaxmindService,
        CampaignsSyncService,
        SplitterService
    ],
})

export class ApplicationModule implements NestModule {

    @Client({ transport: Transport.REDIS, url: 'redis://gateway:6379' })
    client: ClientProxy;

    constructor(seessionJob: SessionJob, @Inject('RedisToken') redisClient: RedisClient, syncService: CampaignsSyncService) {
        setTimeout(function () {
            seessionJob.startJob();
        }, 2000);

        setInterval(function () {
            syncService.sync();
        }, 4000);
    }
    configure(consumer: MiddlewaresConsumer): void {
        // Apply tracker middleware
        consumer.apply(TrackerMiddleware).forRoutes(
            {path: '/', method: RequestMethod.GET},
            {path: '/convert', method: RequestMethod.GET},
            {path: '/convert', method: RequestMethod.POST}
        );
    }
}
