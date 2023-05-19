import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { MongoClient } from 'mongodb'

const server = fastify({ logger: true })
    .register(fastifyCors)

const dbclient = new MongoClient('mongodb://127.0.0.1:27017', {
    maxConnecting: 3 * 1000
})

await dbclient.connect()

console.log('[mongo] connected')

const db = dbclient.db('midorijam')

type Req = {
    pass: string
}

type ReportReq = Req & {
    problems: { cid: number, pid: string }[]
}

type AnalyzationReq = Req & {
    pass: string
}

type Rep = {
    state: 'error' | 'ok'
    msg: string
}

type AnalyzationRep = Rep & {
    reports?: any[]
}

server.post<{ Body: ReportReq, Reply: Rep }>('/report', {
    schema: {
        body: {
            type: 'object',
            properties: {
                pass: { type: 'string' },
                problems: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            cid: { type: 'number' },
                            pid: { type: 'string' }
                        }
                    }
                },
            }
        }
    }
}, async req => {
    if (req.body.pass !== process.env['PASS'])
        return { state: 'error', msg: '密码错误，请联系网站负责人' }
    
    try {
        await db.collection('report').insertOne({
            time: new Date,
            problems: req.body.problems
        })

        return { state: 'ok', msg: '错题已记录' }
    }
    catch (err) {
        console.error(err)
        return { state: 'error', msg: '服务器内部错误' }
    }
})

server.post<{ Body: AnalyzationReq, Reply: AnalyzationRep }>('/analyze', {
    schema: {
        body: {
            type: 'object',
            properties: {
                pass: { type: 'string' }
            }
        }
    }
}, async req => {
    if (req.body.pass !== process.env['PASS'])
        return { state: 'error', msg: '密码错误，请联系网站负责人' }

    const reports = await db.collection('report').find().toArray()

    return {
        state: 'ok',
        msg: '获取成功',
        reports
    }
})

server.get('/', {
	schema: {},
}, async (_, rep) => {
	rep.type('text/html')
	return `
		<p>Midori Jam Backend</p>
	`.replace(/^\s+/gm, '')
})

server.listen({
    port: 1633
})
