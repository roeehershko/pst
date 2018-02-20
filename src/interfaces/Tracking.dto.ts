import {Response as MaxmindResponse} from "maxmind";

export interface TrackingBodyDto {
    ua: string,
    ip: string,
    geo: MaxmindResponse
}

export interface TrackingQueryDto {
    campaign: [number, string],
    goal: string,
    source: string,
    [k: string]: any
}

export interface TrackingSession {
    ip: string,
    country: string,
    city: string,
    campaign: [number, string],
    goal: string,
    source: string,
    [k: string]: any
}
