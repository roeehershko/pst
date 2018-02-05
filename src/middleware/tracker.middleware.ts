import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import {MaxmindService} from "../components/maxmind";

/**
 * Tracker Middleware
 * Converting tracker parameters into request body
 */
@Middleware()
export class TrackerMiddleware implements NestMiddleware {

    constructor(private readonly maxmindService: MaxmindService) {}

    resolve(...args: any[]): ExpressMiddleware {
        return (req, res, next) => {
            let ua = req.headers['user-agent'];

            let ipAddress = req.headers['http_cf_connecting_ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (ipAddress == '::1') ipAddress = '82.81.229.162';

            this.maxmindService.get(ipAddress);

            req.body = {
                ua: ua,
                ip: ipAddress,
                geo: this.maxmindService.get(ipAddress)
            };

            next();
        };
    }
}