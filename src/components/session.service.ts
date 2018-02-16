import {Component, Inject} from "@nestjs/common";
import {TrackingBodyDto, TrackingQueryDto, TrackingSession} from "../interfaces/Tracking.dto";
import {RedisClient} from "redis";
import * as aguid from 'aguid';

@Component()
export class SessionService {

    private redisClient: RedisClient;

    constructor(@Inject('RedisToken') redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    public create(body: TrackingBodyDto, query: TrackingQueryDto, ref) {
        let tracking = {};
        let usedParams = [ 'campaign', 'goal', 'source', 'e', 'g', 'c', 's', 'guid' ];
        for(let idx in query) {
            if (usedParams.indexOf(idx) === -1) {
                tracking[idx] = query[idx];
            }
        }

        let data: TrackingSession = {
            ip: body.ip,
            guid: aguid(body.ip + '@' + query.campaign),
            country: body.geo.country.iso_code,
            city: body.geo.city.names.en,
            time: new Date(),
            campaign: query.campaign,
            goal: query.goal,
            source: query.source,
            ref: ref,
            tracking: tracking
        };

        this.redisClient.lpush('sessions', JSON.stringify(data));
    }
}
