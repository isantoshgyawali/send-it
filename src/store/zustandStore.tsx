import { create } from "zustand"

export type UserProps = {
    id: number,
    email: string,
}

export type TemplateProps = {
    id: number
    subject: string
    body: string
}

export type EmailProps = {
    id: number
    email: string
    name: string
    description: string
}

interface BearState {
    userData: UserProps | null
    setUserData: (item: UserProps) => void
    templates: TemplateProps[] | null
    setTemplates: (item: TemplateProps[]) => void
    emails: EmailProps[] | null
    setEmails: (item: EmailProps[]) => void
}

export const useBearStore = create<BearState>((set) => ({
    userData: null,
    setUserData: (item : UserProps) => set({userData: item}),

    templates: null,
    setTemplates: (item: TemplateProps[]) => set({templates: item}),

    emails: null,
    setEmails: (item: EmailProps[]) => set({emails: item})
}))
