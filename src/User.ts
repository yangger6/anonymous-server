import RedisServer from "./redis/redisServer";
import Timer = NodeJS.Timer;
export default class User {
    private socket: SocketIO.Server
    private client: any
    private heartTimmer: Timer
    private heartTime = 60000
    constructor (appId: string, socket: SocketIO.Server, client: RedisServer) {
        this.socket = socket
        this.client = client
        this.createUser(appId)
        // this.startHeart()
    }
    private createUser (appId: string) {
        this.client.set(appId, {
            status: 0,
            time: Date.now()
        })
    }
    /**
     * 开始心跳
     */
    public startHeart() {
        this.heartTimmer = setInterval(() => this.zaima(), this.heartTime)
    }
    /**
     * 结束心跳
     */
    public stopHeart() {
        clearInterval(this.heartTimmer)
    }
    /**
     * 向对方发送询问是否在掉线
     */
    public zaima() {
    }
}
