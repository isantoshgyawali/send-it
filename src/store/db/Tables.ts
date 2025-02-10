import { useEffect } from "react";
import * as SQLite from "expo-sqlite"

export default function CreateTables(db : SQLite.SQLiteDatabase) {
    useEffect(() => {
        async function Create() {
            try {
                const CreateUserTable = `
                    CREATE TABLE IF NOT EXISTS User (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT NOT NULL,
                        appPassword TEXT NOT NULL
                    );
                `
                const userStmt = await db.prepareAsync(CreateUserTable);
                await userStmt.executeAsync();
                await userStmt.finalizeAsync();

                const CreateEmailsTable = `
                    CREATE TABLE IF NOT EXISTS Email (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        description TEXT,
                        email TEXT NOT NULL
                    );
                `
                const emailStmt = await db.prepareAsync(CreateEmailsTable)
                await emailStmt.executeAsync();
                await emailStmt.finalizeAsync();

                const CreateTemplatesTable = `
                    CREATE TABLE IF NOT EXISTS Templates (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        content TEXT NOT NULL
                    );
                `
                const templateStmt = await db.prepareAsync(CreateTemplatesTable)
                await templateStmt.executeAsync();
                await templateStmt.finalizeAsync();

                console.log("Tables Created Successfullly")

            } catch (err) {
                console.log("Error while creating tables: ", err)
            }
        }

        Create();
    }, [])

    return null;
}
