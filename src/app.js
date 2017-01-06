import { TapIfBot } from './bot'

async function start() {
    const token = process.env[process.env['TELEGRAM_BOT_TOKEN']] || process.env['TELEGRAM_BOT_TOKEN']
    const databseAdapter = process.env[process.env['DATABASE_ADAPTER']] || process.env['DATABASE_ADAPTER'] || 'memory'
    const databseUrl = process.env[process.env['DATABASE_URL']] || process.env['DATABASE_URL'] || null

    if (!token)
        throw new Error('Missing required environment variable: TELEGRAM_BOT_TOKEN')

    return await TapIfBot.build({
        token,
        database: {
            adapter: databseAdapter,
            url: databseUrl
        }
    })
}

start()
.catch(err => console.error(err.stack))

    process.on('unhandledRejection', err => console.log('unhandled', err.stack))