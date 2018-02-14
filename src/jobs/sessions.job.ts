import {Component, Inject} from "@nestjs/common";
import {RedisClient} from "redis";
import {Client, ClientProxy, Transport} from "@nestjs/microservices";

@Component()
export class SessionJob {

    private redisClient: RedisClient;
    @Client({ transport: Transport.REDIS, url: 'redis://gateway:6379' })
    client: ClientProxy;

    constructor(@Inject('RedisToken') redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    public async startJob() {
        const self = this;
        setTimeout(async function () {
            self.process.apply(self, [function () {
                self.startJob.apply(self);
            }]);
        }, 2000);
    }

    private process(cb) {
        const self = this;
        this.redisClient.lrange('sessions', 0, 1000, function (err, data) {
            // Sending data to the sessions service
            self.client.send<Object[]>("sessions", data).subscribe();
            // remove sent data
            self.redisClient.ltrim('sessions', data.length, -1, function () {
                cb();
            });

        });
    }
}
