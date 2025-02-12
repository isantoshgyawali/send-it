import { GetDatabase } from "."
import { EmailProps } from "../zustandStore"

export const Emails = {
    async getAllEmails() : Promise<{data : EmailProps[] | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('SELECT * FROM Emails;')
            const result = await stmt.executeAsync()
            await stmt.finalizeAsync()

            const emails = await result.getAllAsync() as EmailProps[]
            return {
                data: emails,
                error: null
            }
        } catch (err) {
            console.log("Error Creating User:\n", err)
            return {
                data: null,
                error: err,
            }
        }
    },

    async addEmail(email: string, name: string, description:string): Promise<{success: boolean; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('INSERT INTO Emails (email, name, description) VALUES (?, ?, ?);')
            await stmt.executeAsync([email, name, description])
            await stmt.finalizeAsync()

            console.log("Email added Successfully")
            return {
                success: true,
                error: null,
            }
        } catch (err) {
            console.log("Error adding Email: \n", err)
            return {
                success: false,
                error: err,
            }
        }
    },

    async editEmail(email : string, name: string, description: string): Promise<{data: EmailProps | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync(
                'UPDATE Emails SET email = ?, name = ? WHERE email = ? RETURNING *'
            );
            const result = await stmt.executeAsync([email, name, description])
            const data = await result.getFirstAsync() as EmailProps
            await stmt.finalizeAsync()

            console.log("User Updated Successfully")
            return {
                data: data,
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

    async deleteEmail(email : string): Promise<{success: boolean; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync(
                'DELETE FROM Emails WHERE email = ? RETURNING *'
            );
            await stmt.executeAsync([email])
            await stmt.finalizeAsync()

            console.log("Email Deleted Successfully")
            return {
                success: true,
                error: null,
            }
        } catch (err) {
            console.log("Error Creating User: \n", err)
            return {
                success: false,
                error: err,
            }
        }
    }
}
