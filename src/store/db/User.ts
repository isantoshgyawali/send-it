import { UserProps } from "../zustandStore"
import { GetDatabase } from "./index"

export const UserDbOperations = {
    async createUser(email: string, appPassword: string): Promise<{data: UserProps | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('INSERT INTO User (email, appPassword) VALUES (?, ?); RETURNING *')
            const result = await stmt.executeAsync([email, appPassword])
            const user = await result.getFirstAsync() as UserProps
            await stmt.finalizeAsync()

            console.log("User Created Successfully")
            return {
                data: user,
                error: null,
            }
        } catch (err) {
            console.log("Error Creating User: \n", err)
            return {
                data: null,
                error: err,
            }
        }
    },

    async updateUser(userId: number, email: string, appPassword: string) : Promise<{data: UserProps | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('UPDATE User SET email = ?, appPassword = ? WHERE id = ? RETURNING *')
            const result = await stmt.executeAsync([email, appPassword, userId])
            const user = await result.getFirstAsync() as UserProps
            await stmt.finalizeAsync()

            console.log("User Updated Successfully")
            return {
                data: user,
                error: null,
            }
        } catch (err) {
            console.log("Error Creating User: \n", err)
            return {
                data: null,
                error: err,
            }
        }
    },
}
