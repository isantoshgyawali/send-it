import { create } from "zustand"

export type UserProps = {
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
    userData: UserProps | undefined
    setUserData: (item: UserProps) => void
    templates: TemplateProps[] | undefined
    setTemplates: (item: TemplateProps[]) => void
    emails: EmailProps[] | undefined
    setEmails: (item: EmailProps[]) => void
}

export const useBearStore = create<BearState>((set) => ({
    userData: undefined,
    setUserData: (item : UserProps) => set({userData: item}),

    templates: undefined,
    setTemplates: (item: TemplateProps[]) => set({templates: item}),

    emails: undefined,
    setEmails: (item: EmailProps[]) => set({emails: item})
}))
