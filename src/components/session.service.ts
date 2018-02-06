import {Component, Inject} from "@nestjs/common";
import {TrackingBodyDto, TrackingQueryDto, TrackingSession} from "../interfaces/Tracking.dto";
import {RedisClient} from "redis";

@Component()
export class SessionService {

    private redisClient: RedisClient;

    constructor(@Inject('TestToken') redisClient: RedisClient) {
        let self = this;
        this.redisClient = redisClient;
        setInterval(function () {
            self.debugInterval();
        }, 3000);
    }

    public logSession(body: TrackingBodyDto, query) {

        let data: TrackingSession = Object.assign(query, {
            ip: body.ip,
            country: body.geo.country.iso_code,
            city: body.geo.city.names.en
        });

        this.redisClient.lpush('sessions', JSON.stringify(query));
    }

    public debugInterval() {
        let self = this;
        this.redisClient.lrange('sessions', 0, -1, function (err, data) {
            console.log(data);
            self.redisClient.del('sessions');
        });
    }
}
