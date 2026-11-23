import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "../../../utils/auth";

import { sql } from "../../../utils/sql";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenticated"
            },
            { status: 200 }
        );
    };

    const searchParams: any = req.nextUrl.searchParams;
    const activityId: number = Number(searchParams.get("activityId"));    

    if (!activityId || Number.isNaN(activityId) || activityId < 1) {
        return NextResponse.json(
            {
                "error": "Not a valid activity id"
            },
            { status: 400 }
        );
    };

    let ratings;

    try {
        ratings = await sql`SELECT * FROM ratings WHERE activity=${activityId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting ratings"
            }
        )
    };

    let userIds = [];

    for (let i = 0; i < ratings.length; i++) {
        userIds.push(ratings[i]["userid"]);
    };

    const users: any = {};

    try {
        let queryStatment = ``;

        for (let i = 0; i < userIds.length; i++) {
            const thisUser = await sql`SELECT * FROM "user" WHERE id=${userIds[i]};`;

            users[userIds[i]] = thisUser[0]["name"];
        };

        /*
        queryStatment = queryStatment.substring(0, queryStatment.length - 4);

        queryStatment = `SELECT * FROM "user" WHERE ${queryStatment};`

        console.log(queryStatment);

        const userResponse = await sql`${queryStatment}`;
        
        for (let i = 0; i < userResponse.length; i++) {
            users[userResponse[i]["id"]] = userResponse[i]["name"];
        };
        */
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting users"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {
            ratings: ratings,
            users: users
        },
        { status: 200 }
    );
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body: any = await req.json();
    const activityId: number = body["activity"];
    const title: string = body["title"];
    const description: string = body["description"];
    const rating: number = body["rating"];

    if (!activityId || Number.isNaN(activityId) || activityId < 1) {
        return NextResponse.json(
            {
                "error": "Not a valid activity id"
            },
            { status: 400 }
        );
    };

    if (!title || title.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid title"
            },
            { status: 400 }
        );
    };

    if (!description || description.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Not a valid description"
            },
            { status: 400 }
        );
    };

    if ((!rating && rating !== 0) || Number.isNaN(rating) || rating < 0 || rating > 5) {
        return NextResponse.json(
            {
                "error": "Not a valid rating"
            },
            { status: 400 }
        );
    };

    try {
        const activity = await sql`SELECT * FROM activities WHERE id=${activityId};`;

        if (activity.length === 0) {
            return NextResponse.json(
                {
                    "error": "Activity not found"
                },
                { status: 404 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting activity info"
            },
            { status: 500 }
        );
    };

    try {
        await sql`INSERT INTO ratings (activity, title, description, rating, userid) VALUES (${activityId}, ${title}, ${description}, ${rating}, ${userId});`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong adding rating"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        )
    };

    const userId: string = session["session"]["userId"];

    const body: any = await req.json();
    const id: number = body["ratingId"];
    const title: string = body["title"];
    const description: string = body["description"];
    const rating: number = body["ratings"];

    if (!id || Number.isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                "error": "Not a valid rating id"
            },
            { status: 400 }
        );
    };

    try {
        const rating = await sql`SELECT* FROM ratings WHERE id=${id};`;

        if (rating.length === 0) {
            return NextResponse.json(
                {
                    "error": "Rating not found"
                },
                { status: 404 }
            );
        };

        if (rating[0]["userid"] !== userId) {
            return NextResponse.json(
                {
                    "error": "That is not your rating"
                },
                { status: 403 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting rating info"
            },
            { status: 500 }
        );
    };
    
    if (title && title.trim().length > 0) {
        try {
            await sql`UPDATE ratings SET title=${title} WHERE userid=${userId} AND id=${id};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing title"
                },
                { status: 500 }
            );
        };
    };

    if (description && description.trim().length > 0) {
        try {
            await sql`UPDATE ratings SET description=${description} WHERE userid=${userId} AND id=${id};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing the description"
                },
                { status: 500 }
            );
        };
    };

    if (rating && !Number.isNaN(rating) && rating >= 0 && rating <= 5) {
        try {
            await sql`UPDATE ratings SET rating=${rating} WHERE userid=${userId} AND id=${id};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing rating"
                }
            );
        };
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const userid = session["session"]["userId"];

    const body: any = await req.json();
    const ratingId: number = body["ratingId"];

    if (!ratingId || Number.isNaN(ratingId) || ratingId < 1) {
        return NextResponse.json(
            {
                "error": "Not a valid rating id"
            },
            { status: 403 }
        );
    };

    try {
        const rating = await sql`SELECT * FROM ratings WHERE id=${ratingId};`;

        if (rating.length === 0) {
            return NextResponse.json(
                {
                    "error": "Rating not fouund"
                },
                { status: 404 }
            )
        };

        if (rating[0]["userid"] !== userid) {
            return NextResponse.json(
                {
                    "error": "Not your rating"
                },
                { status: 403 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting rating info"
            },
            { status: 500 }
        );
    };

    try {
        await sql`DELETE FROM ratings WHERE id=${ratingId} AND userid=${userid};`;
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong deleting rating"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};