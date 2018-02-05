import {Response as MaxmindResponse} from "maxmind";

export interface TrackingBodyDto {
    ua: string,
    ip: string,
    geo: MaxmindResponse
}

export interface TrackingQueryDto {
    c: number,
    e: string,
    s: string,
    [x: string]: any
}