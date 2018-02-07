import {RedisClient} from "redis";

export const RedisProvider = {
    provide: 'RedisToken',
    useFactory: async () => {
        return new Promise((resolve, reject) => {
            let redisClient = new RedisClient({
                host: 'localhost'
            });

            redisClient.on('ready', function () {
                resolve(redisClient);
            });
        });
    }

};
