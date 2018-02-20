import {Component, Inject} from "@nestjs/common";
import {Client, ClientProxy, Transport} from "@nestjs/microservices";
import {RedisClient} from "redis";

@Component()
export class CampaignsService {

    @Client({ transport: Transport.REDIS, url: 'redis://gateway:6379' })
    client: ClientProxy;

    private redisClient: RedisClient;

    constructor(@Inject('RedisToken') redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    store(campaigns) {
        this.redisClient.set('campaigns', JSON.stringify(campaigns));
    }
}