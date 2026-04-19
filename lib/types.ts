export type User = {
    _id: string,
    name: string,
    email: string,
    tel: string,
    sub: string
}

export type Group = {
    _id: string,
    name: string,
    remaining?: number,
    due?: string,
    contributed?: number,
    last?: string,
    users: User[]
}

export enum ExpenseType {
    GAS = "GAS", GROCERIES = "GROCERIES", BEAUTY = "BEAUTY", LEISURE = "LEISURE", RENT = "RENT"
}

export type Intent = OnetimeIntent | GoalIntent;

export type IntentBase = {
    _id: string,
    group: string,
    expense?: ExpenseType,
    name: string,
    vendor: string,
    paid?: boolean,
    date: string,
    photo: string | null,
    value: number
    currency: string
}

export type OnetimeIntent = IntentBase & {
    type: "ONETIME",
    products: Product[]
    shares: string[][],
}

export type Product = {
    name: string,
    price: number
}

export type GoalIntent = IntentBase & {
    type: "GOAL",
    shares: Share[]
}

export type Share = {
    user: string,
    value: number
}

export const defaultUser = {
    _id: "undef",
    name: "John Doe",
    email: "john.doe@foo.com",
    tel: "+421123123123",
    sub: "auth0|undef"
}

export const defaultGroup = {
    _id: "undef",
    name: "Bill",
    users: []
}