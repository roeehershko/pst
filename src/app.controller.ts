import {Get, Controller, Request, Body, Query} from '@nestjs/common';
import {PostbackResponse} from "./interfaces/PostbackResponse";
import {SessionService} from "./components/session";
import {Response} from "maxmind";
import {TrackingBodyDto, TrackingQueryDto} from "./interfaces/TrackingBodyDto";

@Controller()
export class AppController {

    constructor(private readonly sessionService: SessionService) {

    }
    /**
     *
     * @returns {string}
     */
    @Get()
    root(@Body() data: TrackingBodyDto, @Query() query: TrackingQueryDto) {
        this.sessionService.logSession(data, query);
        return {
            city: data.geo,
            status: 1
        }
    }
}
