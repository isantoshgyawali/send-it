import { GetDatabase } from "."
import { TemplateProps } from "../zustandStore"

export const Templates = {
    async getAllTemplates() : Promise<{data : TemplateProps[] | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('SELECT * FROM Templates;')
            const result = await stmt.executeAsync()
            await stmt.finalizeAsync()

            const templates = await result.getAllAsync() as TemplateProps[]
            return {
                data: templates,
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

    async addTemplate(subject:string, body:string): Promise<{success: boolean; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync('INSERT INTO Templates (subject, body) VALUES (?, ?);')
            await stmt.executeAsync([subject, body])
            await stmt.finalizeAsync()
            console.log("Template Created Successfully")
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
    },

    async editTemplate(templateId : string, subject: string, body: string): Promise<{data: TemplateProps | null; error: unknown}> {
        try {
            const db = await GetDatabase()
            const stmt = await db.prepareAsync(
                'UPDATE Templates SET subject = ?, body = ? WHERE id = ? RETURNING *'
            );
            const result = await stmt.executeAsync([subject, body, templateId])
            const template = await result.getFirstAsync() as TemplateProps
            await stmt.finalizeAsync()

            console.log("User Updated Successfully")
            return {
                data: template,
                error: null,
            }
        } catch (err) {
            console.log("Error Creating User: \n", err)
            return {
                data: null,
                error: err,
            }
        }
    }
}
