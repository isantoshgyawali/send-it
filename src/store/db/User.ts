import { UserProps } from "../zustandStore"
import { GetDatabase } from "./index"

export const UserDbOperations = {
    async getAllUser() : Promise<{data: UserProps[] | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('SELECT * FROM User;')
            const result = await stmt.executeAsync()
            const user = await result.getAllAsync() as UserProps[]
            await stmt.finalizeAsync()

            return {
                data: user,
                error: null
            }
        } catch (err) {
            console.log("Error Getting User:\n", err)
            return {
                data: null,
                error: err,
            }
        }
    }, 

    async getUser(email: string) : Promise<{data: UserProps | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('SELECT * FROM User WHERE email = ?;')
            const result = await stmt.executeAsync([email])
            const user = await result.getFirstAsync() as UserProps
            await stmt.finalizeAsync()

            return {
                data: user,
                error: null
            }
        } catch (err) {
            console.log("Error Getting User:\n", err)
            return {
                data: null,
                error: err,
            }
        }
    }, 

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

    async updateUser(email: string, appPassword: string) : Promise<{data: UserProps | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('UPDATE User SET email = ?, appPassword = ? WHERE email = ?')
            await stmt.executeAsync([email, appPassword])
            await stmt.finalizeAsync()

            const user = await db.getFirstAsync<UserProps>('SELECT * FROM User WHERE email = ?;', [email]);
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
