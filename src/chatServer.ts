import { createServer, Server } from 'http'
import * as Koa from 'koa'
import * as socketIo from 'socket.io'
import RedisServer from './redis/redisServer'
import User from "./user";
export default class ChatServer {
    public static readonly PORT:number = 8080
    private app: Koa
    private server: Server
    private io: SocketIO.Server
    private port: string | number
    private redisClent: any
    private userList: object[] = []
    constructor() {
        this.createApp()
        this.config()
        this.createServer()
        this.createRedis()
        this.sockets()
        this.listen()
    }
    private createApp(): void {
        this.app = new Koa
    }
    private createServer(): void {
        this.server = createServer(this.app.callback())
    }
    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }
    private createRedis () {
        this.redisClent = new RedisServer().getClient()
    }
    private sockets(): void {
        this.io = socketIo(this.server);
    }
    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket: any) => {
            let addedUser = false;
            console.log('Connected client on port %s.', this.port);
            socket.on('new message', (data) => {
            });
            socket.on('add user', (appId) => {
                if (addedUser) return;
                let user = new User(socket, appId)
                this.userList.push(user)
                // we store the username in the socket session for this client
                socket.appId = appId;
                addedUser = true;
            });
            socket.on('typing', () => {
            });
            socket.on('stop typing', () => {
            });
            socket.on('disconnect', () => {
            });
        });

    }
    public getApp(): Koa {
        return this.app;
    }
}
