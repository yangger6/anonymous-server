import * as Router from 'koa-router'
const router = new Router({
    prefix: '/v1/api'
})
router.get('/', async (ctx) => {
    ctx.body =  '123'
})
export default router
