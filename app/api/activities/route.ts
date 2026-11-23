import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";
import { sql } from "@/utils/sql";

import { ActivitiesTable } from "@/utils/types";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenitcated"
            },
            { status: 403 }
        );
    };

    const searchParams: any = req.nextUrl.searchParams;
    const id: number = Number(searchParams.get("id"));

    if (id) {
        if (Number.isNaN(id) || id < 1) {
            return NextResponse.json(
                {
                    "error": "That is not a valid id"
                },
                { status: 400 }
            );
        };

        try {
            const activity: ActivitiesTable[] = await sql`SELECT * FROM activities WHERE id=${id};`;

            if (activity.length === 0) {
                return NextResponse.json(
                    {
                        "error": "Activity not found"
                    },
                    { status: 404 }
                );
            };

            return NextResponse.json(
                {
                    "activity": activity[0]
                },
                { status: 200 }
            );
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting activity info"
                },
                { status: 500 }
            );
        };
    };

    try {
        const activities: ActivitiesTable[] = await sql`SELECT * FROM activities;`;

        return NextResponse.json(
            {
                "activities": activities
            },
            { status: 200 }
        )
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting activities"
            },
            { status: 500 }
        )
    };
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body = await req.json();
    const name: string = body["name"];
    const description: string = body["description"];
    
    if (!name || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Not a valid name"
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

    try {
        await sql`INSERT INTO activities (name, description, userid) VALUES (${name}, ${description}, ${userId});`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong creating activity"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    )
};

export async function PUT(req: NextRequest): Promise<NextResponse> {
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

    const body = await req.json();
    const id: number = body["id"];
    const name: string = body["name"];
    const description: string = body["descrption"];

    if (!id || Number.isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                "error": "Not a valid activity id"
            },
            { status: 400 }
        );
    };

    try {
        const activity: ActivitiesTable[] = await sql`SELECT * FROM activities WHERE id=${id};`;

        if (activity.length === 0) {
            return NextResponse.json(
                {
                    "error": "Activity not found"
                },
                { status: 404 }
            );
        };

        if (activity[0]["userid"] !== userId) {
            return NextResponse.json(
                {
                    "error": "Not your activity"
                },
                { status: 403 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting activity details"
            },
            { status: 500 }
        );
    };

    if (name && name.trim().length !== 0) {
        try {
            await sql`UPDATE activities SET name=${name} WHERE id=${id} userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating activity name"
                },
                { status: 500 }
            );
        };
    };

    if (description && description.trim().length !== 0) {
        try {
            await sql`UPDATE activities SET description=${description} WHERE id=${id} AND userid=${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating description"
                },
                { status: 500 }
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
                "error": "Not autenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body = await req.json();
    const id: number = body["id"];

    if (!id || Number.isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                "error": "That is not a valid id"
            },
            { status: 400 }
        );
    };

    try {
        const activity: ActivitiesTable[] = await sql`SELECT * FROM activities WHERE id=${id};`;

        if (activity.length === 0) {
            return NextResponse.json(
                {
                    "error": "Activity not found"
                },
                { status: 404 }
            );
        };

        if (activity[0]["userid"] !== userId) {
            return NextResponse.json(
                {
                    "error": "That is not your activity"
                },
                { status: 403 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting activity details"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};