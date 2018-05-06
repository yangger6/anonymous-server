import { createServer, Server } from 'http'
import * as Koa from 'koa'
import * as socketIo from 'socket.io'
import RedisServer from './redis/redisServer'
export default class ChatServer {
    public static readonly PORT:number = 8080
    private app: Koa
    private server: Server
    private io: SocketIO.Server
    private port: string | number
    private redisClent: any
    public numUsers: number = 0
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
            console.log('Connected client on port %s.', this.port);
            let addedUser = false;
            // when the client emits 'new message', this listens and executes
            socket.on('new message', (data) => {
                // we tell the client to execute 'new message'
                socket.broadcast.emit('new message', {
                    username: socket.username,
                    message: data
                });
            });
            // when the client emits 'add user', this listens and executes
            socket.on('add user', (username) => {
                if (addedUser) return;

                // we store the username in the socket session for this client
                socket.username = username;
                ++this.numUsers;
                addedUser = true;
                socket.emit('login', {
                    numUsers: this.numUsers
                });
                // echo globally (all clients) that a person has connected
                socket.broadcast.emit('user joined', {
                    username: socket.username,
                    numUsers: this.numUsers
                });
            });

            // when the client emits 'typing', we broadcast it to others
            socket.on('typing', () => {
                socket.broadcast.emit('typing', {
                    username: socket.username
                });
            });

            // when the client emits 'stop typing', we broadcast it to others
            socket.on('stop typing', () => {
                socket.broadcast.emit('stop typing', {
                    username: socket.username
                });
            });

            // when the user disconnects.. perform this
            socket.on('disconnect', () => {
                if (addedUser) {
                    --this.numUsers;
                    // echo globally that this client has left
                    socket.broadcast.emit('user left', {
                        username: socket.username,
                        numUsers: this.numUsers
                    });
                }
            });
        });

    }
    public getApp(): Koa {
        return this.app;
    }
}
