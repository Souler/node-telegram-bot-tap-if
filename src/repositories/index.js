import { MongoTapIfRepository } from './mongo'
import { MemoryTapIfRepository } from './memory'

/**
* @typedef {Object} TapReport
* @property {number|String} chatId - The id of the chat where the taps orignated
* @property {String} message - The message behind the /TapIf____
* @property {number} taps - The number of times the message was tapped
* @property {number} uniqueTaps - The unique number of times the message was tapped
*/

/**
 * Interface for any repository aiming to store tap reports
 * @interface
 */
export class TapIfRepository {

    /**
     * Retrieves an instance of a class implementation TapIfRepository
     * based on the value of adapter. Currently accepte adapters are:
     * `mongodb`, `memory`.
     *
     * @async
     * @param {string} adapter - The adapter of the repository to be returned
     * @param {string} [url] - The url to pass to the adapter (if any)
     * @return {TapIfRepository}
     * @throws {Error} If unkown adapter value.
     */
    static async build({ adapter, url }) {
        switch(adapter) {
            case 'mongodb':
                return await MongoTapIfRepository.build({ url })
            case 'memory':
                return await MemoryTapIfRepository.build()
            default:
                throw new Error(`Unkown adapter: ${ adapter }`)
        }
    }

    constructor() {
        throw new Error('This is an interface. Use TapIfRepository.build for building an instance!')
    }

    /**
     * Stores a tap record for the given chat, user and message, where
     * message is the /TapIf______ text.
     *
     * @async
     * @param {number} chatId - The id of the chat where the tap originated
     * @param {number} userId - The id of the user that generated the tap
     * @param {String} message - The actual message behind the /TapId
     * @return {Promise} - Resolved/Rejected once done with the process of
     *                     the params
     */
    async storeTap(chatId, userId, message) {
        throw new Error('This is an interface. Use TapIfRepository.build for building an instance!')
    }

    /**
     * Returns a list of reports for the given chatId.
     *
     * @async
     * @param {number} chatId - The id of the chat to get reports for
     * @return {Promise<TapReport[]>}
     */
    async getTaps(chatId) {
        throw new Error('This is an interface. Use TapIfRepository.build for building an instance!')
    }

    /**
     * Deletes all the taps on record for the given chatId.
     *
     * @param {number} chatId - The id of the chat to delete reports for
     * @return {Promise} Resolved once its done
     */
    async deleteTaps(chatId) {
        throw new Error('This is an interface. Use TapIfRepository.build for building an instance!')
    }
}