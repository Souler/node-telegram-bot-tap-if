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
        this.bot.onText(/^\/tapif([a-z0-9\s]+)/i, (...args) => this.recordTap(...args))
        this.bot.onText(/^\/taps/i, (...args) => this.sendReport(...args))
        this.bot.onText(/^\/reset/, (...args) => this.resetTaps(...args))
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
        logTap(`sending report for ${ chatId }, taps in record: ${ taps.length }`)
        if (taps.length > 0) {
            const report = taps.reduce((rep, tapRep) => {
                const { message, taps, uniqueTaps } = tapRep
                rep += `${ message }: *${ uniqueTaps }*/${ taps }  \n`
                return rep
            }, `Taps report:  \n`)
            await this.bot.sendMessage(chatId, report, { parse_mode: 'Markdown' })
        } else
            await this.bot.sendMessage(chatId, `No taps recorded for this chat`, { parse_mode: 'Markdown' })

    }

    async sendHelp(msg) {
        const { chat: { id: chatId } } = msg
        logTap(`sending help for ${ chatId }`)
        await this.bot.sendMessage(chatId, `I'll keep count of any time a /TapIfSomething is sent on the chat!`)
    }

    async resetTaps(msg) {
        const { chat: { id: chatId } } = msg
        await this.sendReport(msg)
        await this.db.deleteTaps(chatId)
        await this.bot.sendMessage(chatId, `Deleted all recorded taps!`)
    }
}
