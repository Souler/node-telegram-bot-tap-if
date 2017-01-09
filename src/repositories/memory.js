/**
 * This repository is not intended for usage on production, since it doesn't
 * have any persistence strategy. ONLY FOR DEVELOPING PRUPOUSES
 *
 * @class
 * @implements TapIfRepository
 */
export class MemoryTapIfRepository {

    static async build() {
        return new MemoryTapIfRepository()
    }

    constructor() {
        this.reports = {}
    }

    async storeTap(chatId, userId, message) {
        chatId = String(chatId)
        // Lazy init the reports domain
        if (!this.reports[chatId])
            this.reports[chatId] = {}
        if (!this.reports[chatId][message]) {
            this.reports[chatId][message] = {
                chatId,
                message,
                uniqueUserIds: [],
                taps: 0,
            }
        }

        const uniqueUserIds = this.reports[chatId][message].uniqueUserIds
        if (uniqueUserIds.indexOf(userId) < 0)
            uniqueUserIds.push(userId)
        this.reports[chatId][message].taps++
    }

    async getTaps(chatId) {
        chatId = String(chatId)

        if (!this.reports[chatId])
            return []

        const reports = this.reports[chatId]
        return Object.keys(reports).map(message => {
            const report = reports[message]
            return {
                chatId, message,
                taps: report.taps,
                uniqueTaps: report.uniqueUserIds.length,
            }
        })
    }

    async deleteTaps(chatId) {
        chatId = String(chatId)
        if (this.reports[chatId])
            this.reports[chatId] = undefined
    }
}
