import router from './router/index'
import * as serve from 'koa-static'
import { join } from 'path'
import ChatServer from './chatServer'

const app = new ChatServer().getApp()

app.use(serve(join(__dirname + '/../static')))
   .use(router.routes())
   .use(router.allowedMethods())
   .listen(3000, _ => console.log(`server on port 3000`))
