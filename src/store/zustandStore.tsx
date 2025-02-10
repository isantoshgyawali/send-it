import { create } from "zustand"

export type UserProps = {
    email: string,
}

export type TemplateProps = {
    id: number
    subject: string
    body: string
}

interface BearState {
    userData: UserProps | undefined
    setUserData: (item: UserProps) => void
    templates: TemplateProps[] | undefined
}

export const useBearStore = create<BearState>((set) => ({
    userData: undefined,
    setUserData: (item : UserProps) => set({userData: item}),

    templates: undefined,
    setTemplate: (item: TemplateProps[]) => set({templates: item})
}))
