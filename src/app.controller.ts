import {Get, Controller, Request, Body, Query, Post} from '@nestjs/common';
import {SessionService} from "./components/session.service";
import {TrackingBodyDto, TrackingQueryDto} from "./interfaces/Tracking.dto";

@Controller()
export class AppController {

    constructor(private readonly sessionService: SessionService) {}

    /**
     * Receive postback
     * @returns {string}
     */
    @Get('/convert')
    root(@Body() data: TrackingBodyDto, @Query() query: TrackingQueryDto) {
        this.sessionService.logSession(data, query);
        return {
            status: 1,
            message: 'queued'
        }
    }
}
