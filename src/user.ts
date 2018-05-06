import ChatServer  from './chatServer'
import Timer = NodeJS.Timer;
export default class User {
    private socket: SocketIO.Socket
    private heartTimmer: Timer
    private heartTime = 60000
    public appId: string = ''
    constructor (socket: SocketIO.Socket, appId: string) {
        this.socket = socket
        this.appId = appId
        this.startHeart()
    }

    /**
     * 发送信息
     */
    public send () {

    }
    /**
     * 确认是否掉线
     */
    public ping() {
    }
    /**
     * 开始心跳
     */
    public startHeart() {
        this.heartTimmer = setInterval(() => this.ping(), this.heartTime)
    }
    /**
     * 结束心跳
     */
    public stopHeart() {
        clearInterval(this.heartTimmer)
    }
    /**
     * remove 客户端
     */
    public remove() {
        this.stopHeart()
        this.socket.disconnect(true)
        // this.server.removeClient(this.appId)
    }
}
