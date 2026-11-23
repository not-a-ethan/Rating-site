export interface UserTable {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image: string,
    createdAt: any, // Not sure what `timestampe` (sql) is in typescript
    updatedAt: any, // ^^
    username: any,
    displayUsername: string,
    accounts: any, // IDK what this is
    sessions: any // IDK what this is
};

export interface ActivitiesTable {
    id: number,
    name: string,
    description: string,
    userid: string
};

export interface RatingsTable {
    id: number,
    activity: number,
    title: string,
    description: string,
    rating: number,
    userid: string
};