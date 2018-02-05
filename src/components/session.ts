import {Component} from "@nestjs/common";
import {TrackingBodyDto, TrackingQueryDto} from "../interfaces/TrackingBodyDto";
import {RedisClient} from "redis";

@Component()
export class SessionService {

    private redisClient: RedisClient;

    constructor() {
        this.redisClient = new RedisClient({
            host: 'localhost'
        });
    }

    public logSession(body: TrackingBodyDto, query: TrackingQueryDto) {
        let data = query;

        data.
        this.redisClient.lpush('sessions', JSON.stringify(data));
    }
}
