import {Component, Inject} from "@nestjs/common";
import {Client, ClientProxy, Transport} from "@nestjs/microservices";
import {RedisClient} from "redis";

@Component()
export class CampaignsSyncService {

    private redisClient: RedisClient;

    @Client({ transport: Transport.REDIS, url: 'redis://gateway:6379' })
    client: ClientProxy;

    constructor(@Inject('RedisToken') redisClient: RedisClient) {
        this.redisClient = redisClient;
    }


    sync() {
        const self = this;
        let obs = this.client.send('campaigns', {a: 'b'});
        let sub = obs.subscribe(function (data) {
            self.redisClient.set('campaigns', JSON.stringify(data));
            sub.unsubscribe();
        });
    }
}