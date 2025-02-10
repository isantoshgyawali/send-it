import * as SQLite from "expo-sqlite"

const db = await SQLite.openDatabaseAsync("send_it.db")
export const UserDbOperations = {
    createUser(email: string, appPassword: string) {
        const stmt = db.prepareSync('')
        stmt.executeSync()
        stmt.finalizeSync()
    },

    updateUser(email: string, appPassword: string) {
        const stmt = db.prepareSync('')
        stmt.executeSync()
        stmt.finalizeSync()
    },
}

