import {Component, Inject} from "@nestjs/common";
import {TrackingBodyDto, TrackingQueryDto, TrackingSession} from "../interfaces/Tracking.dto";
import {RedisClient} from "redis";
import * as aguid from 'aguid';

@Component()
export class SplitterService {

    private redisClient: RedisClient;

    constructor(@Inject('RedisToken') redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    public split(body: TrackingBodyDto, query: TrackingQueryDto) {
        const self = this;
        return new Promise(function (resolve) {
            self.redisClient.get('campaigns', function (err, campaigns) {
                let campaignsArr = JSON.parse(campaigns);
                let campaign = campaignsArr.find(o => o._id === query.campaign);

                if (campaign && campaign.landers) {
                    let lander = campaign.landers[Math.floor(Math.random()*campaign.landers.length)];
                    resolve(lander.url.replace('{guid}', aguid(body.ip + '@' + query.campaign)));
                }
                else {
                    resolve(false);
                }
            });
        });
    }
}
