import { MongoClient } from 'mongodb'

/**
 * Repository implementation with persistance over a mongodb database
 *
 * @class
 * @implements TapIfRepository
 */
export class MongoTapIfRepository {

    static async build({ url }) {
        const db = await MongoClient.connect(url)
        return new MongoTapIfRepository({ db })
    }

    constructor({ db }) {
        this.db = db
        this.reports = this.db.collection('reports')
        this.history = this.db.collection('history')
    }

    async storeTap(chatId, userId, message) {
        const op1 = this.reports.findOneAndUpdate(
            { chatId, message },
            {
                $addToSet: { uniqueUserIds: userId },
                $inc: { taps: 1 }
            },
            { upsert: true }
        )
        // Just store this for research prupouses
        const op2 = this.history.insertOne({ chatId, userId, message })
        await Promise.all([ op1, op2 ])
    }

    async getTaps(chatId) {
        const reports = await this.reports.find({ chatId }).toArray()
        return reports.map(report => (
            {
                chatId: report.chatId,
                message: report.message,
                taps: report.taps,
                uniqueTaps: report.uniqueUserIds.length
            }
        ))
    }
}
