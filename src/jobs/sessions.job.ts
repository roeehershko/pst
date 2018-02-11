import {Component, Inject} from "@nestjs/common";
import {RedisClient} from "redis";
import {Client, ClientProxy, Transport} from "@nestjs/microservices";

@Component()
export class SessionJob {

    private redisClient: RedisClient;

    @Client({ transport: Transport.TCP, port: 5667, host: 'sessions.app' })
    client: ClientProxy;

    constructor(@Inject('RedisToken') redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    public async startJob() {
        const self = this;
        setTimeout(async function () {
            await self.process.apply(self);
            self.startJob();
        }, 2000);
    }

    private async process() {
        const self = this;
        const pattern = { cmd: 'sessions' };
        this.redisClient.lrange('sessions', 0, 1000, function (err, data) {
            // Process
            self.redisClient.ltrim('sessions', 1000, -1);
        });

        return this.client.send<Object[]>(pattern, []);
    }
}
