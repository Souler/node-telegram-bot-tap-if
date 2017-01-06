import debug from 'debug'
import TelegramBot from 'node-telegram-bot-api'
import { TapIfRepository } from './repositories'

const logTap = debug('tap-if-bot:bot')

/**
 * @class TapIfBot
 */
export class TapIfBot {

    static async build({ token, telegramBotOptions, database }) {
        const conf = Object.assign({
            polling: { autoStart: false }
        }, telegramBotOptions)
        const bot = new TelegramBot(token, conf)
        const db = await new TapIfRepository.build(database)
        return new TapIfBot({ bot, db })
    }

    constructor({ bot, db }) {
        this.bot = bot
        this.db = db
        // Setup listeners
        this.bot.onText(/^\/tapif([a-z0-9\s]+)$/i, (...args) => this.recordTap(...args))
        this.bot.onText(/^\/taps$/i, (...args) => this.sendReport(...args))
        this.bot.onText(/^\/help/, (...args) => this.sendHelp(...args))
    }

    start() {
        if (!this.bot.isPolling())
            this.bot.initPolling()
    }

    async stop() {
        if (this.bot.isPolling())
            await this.bot.stopPolling()
    }

    async recordTap(msg, match) {
        const { from: { id: userId }, chat: { id: chatId } } = msg
        let [ , tapMessage ] = match
        tapMessage = tapMessage.trim().replace(/\s+/g, ' ')
        logTap(`got tap ${ tapMessage } from ${ userId } at ${ chatId }`)
        await this.db.storeTap(chatId, userId, tapMessage)
    }

    async sendReport(msg) {
        const { chat: { id: chatId } } = msg
        const taps = await this.db.getTaps(chatId)
        const report = taps.reduce((rep, tapRep) => {
            const { message, taps, uniqueTaps } = tapRep
            rep += `${ message }: *${ uniqueTaps }*/_${ taps }_  \n`
            return rep
        }, `Taps report:  \n`)
        logTap(`sending report for ${ chatId }, length: ${ report.length }`)
        await this.bot.sendMessage(chatId, report, { parse_mode: 'Markdown' })
    }

    async sendHelp(msg) {
        const { chat: { id: chatId } } = msg
        logTap(`sending report for ${ chatId }, length: ${ report.length }`)
        this.bot.sendMessage(chatId, `I'll keep count of any time a /TapIfSomething is sent on the chat!`)
    }
}

