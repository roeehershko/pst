import {Get, Controller, Request, Body, Query, Post, Res, Response, Headers} from '@nestjs/common';
import {SessionService} from "./components/session.service";
import {TrackingBodyDto, TrackingQueryDto} from "./interfaces/Tracking.dto";
import {MessagePattern} from "@nestjs/microservices";
import {SplitterService} from "./components/splitter.service";

@Controller()
export class AppController {

    constructor(private readonly sessionService: SessionService, private readonly splitter: SplitterService) {}

    /**
     * Receive postback
     * @returns {string}
     */
    @Get('/convert')
    convert(@Body() data: TrackingBodyDto, @Query() query: TrackingQueryDto, @Headers('referer') ref) {
        this.sessionService.create(data, query, ref);

        return {
            status: 1,
            message: 'queued'
        }
    }

    @Get('/')
    async root(@Body() data: TrackingBodyDto, @Query() query: TrackingQueryDto, @Response() res, @Headers('referer') ref) {

        this.sessionService.create(data, query, ref);
        let split = await this.splitter.split(data, query);

        if (split) {
            return res.redirect(split);
        }
        else {
            res.send({
                status: 0,
                message: 'Invalid campaign or landers'
            });

            return res.end();
        }
    }

}
