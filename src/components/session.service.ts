import {Component, Inject} from "@nestjs/common";
import {TrackingBodyDto, TrackingQueryDto, TrackingSession} from "../interfaces/Tracking.dto";
import {RedisClient} from "redis";

@Component()
export class SessionService {

    private redisClient: RedisClient;

    constructor(@Inject('RedisToken') redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    public create(body: TrackingBodyDto, query: TrackingQueryDto) {
        let data: TrackingSession = Object.assign(query, {
            ip: body.ip,
            country: body.geo.country.iso_code,
            city: body.geo.city.names.en
        });

        this.redisClient.lpush('sessions', JSON.stringify(data));
    }
}
