import * as redis from 'redis'
export default class RedisServer {
    private client: any
    private subscriber
    private publisher
    constructor () {
        this.client = this.createClient()
        this.sub('test')
        this.test()
    }
    private createClient () {
        return redis.createClient({
            port: 6379,
            host: '127.0.0.1',
            password: '',
            db: 0
        })
    }
    private test () {
        this.publisher = this.createClient()
        this.publisher.publish("test", "haaaaai");
        this.publisher.publish("test", "kthxbai");
    }
    public sub (channel: string) {
        this.client.subscribe(channel);
        this.client.on("message", function(channel, message) {
            console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
        })
    }
    public pub (channel: string, message: string) {
        this.client.public(channel, message)
    }
    public getClient (): redis {
        return this.client
    }
}
