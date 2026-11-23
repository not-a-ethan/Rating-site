"use client";

import { useState, useEffect } from "react";

import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Card, Link, toast } from "@heroui/react";

export default function Page() {
    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();

    if (!session && !isPending) {
        redirect("/signin");
    };

    const [activities, setActivities] = useState([]);

    function getActivities() {
        fetch("../api/activities")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            setActivities(json["activities"]);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting activities", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    useEffect(getActivities, []);

    return (
        <div>
            <h1>Activities</h1>

            <div className="grid">
                {activities.map((activity) => (
                    <Link key={activity["id"]} href={`/activities/${activity["id"]}`}>
                        <Card>
                            <Card.Header>
                                <Card.Title>{activity["name"]}</Card.Title>
                                <Card.Description>{activity["description"]}</Card.Description>
                            </Card.Header>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};