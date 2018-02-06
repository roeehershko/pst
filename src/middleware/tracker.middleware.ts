import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import {MaxmindService} from "../components/maxmind.service";

/**
 * Tracker Middleware
 * Converting tracker parameters into request body
 */
@Middleware()
export class TrackerMiddleware implements NestMiddleware {

    constructor(private readonly maxmindService: MaxmindService) {}

    resolve(...args: any[]): ExpressMiddleware {
        return (req, res, next) => {

            // Extract the user Agent
            let ua = req.headers['user-agent'];

            // Extract user IP Address from the request, adding fallback to locals
            let ipAddress = req.headers['http_cf_connecting_ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (ipAddress == '::1') ipAddress = '82.81.229.162';

            this.maxmindService.get(ipAddress);

            // Extract server params into the request body
            req.body = {
                ua: ua,
                ip: ipAddress,
                geo: this.maxmindService.get(ipAddress)
            };

            // Replace short parameters with full names
            if (req.query.c) {
                req.query.campaign = parseInt(req.query.c);
                delete req.query.c;
            }

            if (req.query.g) {
                req.query.goal = req.query.g;
                delete req.query.g;
            }

            if (req.query.s) {
                req.query.source = req.query.s;
                delete req.query.s;
            }

            next();
        };
    }
}
