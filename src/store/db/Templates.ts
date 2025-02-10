import { TemplateProps } from "../zustandStore"
import * as SQLite from "expo-sqlite"

const db = await SQLite.openDatabaseAsync("send_it.db")
export const Templates = {
    getAllTemplates() : (TemplateProps[]) {
        const stmt = db.prepareSync('')
        stmt.executeSync()
        stmt.finalizeSync()
        return []
    },

    addTemplate() : string {
        const stmt = db.prepareSync('')
        stmt.executeSync()
        stmt.finalizeSync()
        return ""
    },

    editTemplate(templateId : string) : TemplateProps {
        const stmt = db.prepareSync('')
        stmt.executeSync()
        stmt.finalizeSync()
        let template : TemplateProps = {
            id: 1,
            subject: "",
            body: ""
        }
        return template
    }
}
