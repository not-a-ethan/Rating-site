"use client";

import { use, useState, useEffect } from "react";

import { redirect } from "next/navigation";

import { Button, Card, Form, Input, Label, Modal, toast } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

import { RatingsTable, ActivitiesTable } from "@/utils/types";

import styles from "./page.module.css";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();

    if (!session && !isPending) {
        redirect("../signin");
    };

    interface usersInterace {
        [key: string]: string
    };

    const [activity, setActivity] = useState<ActivitiesTable>();
    const [ratings, setRatings] = useState<RatingsTable[]>([]);
    const [users, setUsers] = useState<usersInterace>({});

    function getActivity(): void {
        fetch(`../api/activities?id=${slug}`, {
            method: "GET"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            setActivity(json["activity"]);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting activity info", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function getRatings(): void {
        if (!activity) {
            return;
        };

        fetch(`../api/ratings?activityId=${activity["id"]}`, {
            method: "GET"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            setUsers(json["users"]);
            setRatings(json["ratings"]);
        })
        .catch(e => {
            console.error(e);

            return toast("Something went wrong getting ratings", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function creatRating(e: React.SyntheticEvent<HTMLFormElement>): void {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const title: string|undefined = formData.get("title")?.toString();
        const description: string|undefined = formData.get("description")?.toString();
        const rating: number|undefined = Number(formData.get("rating")?.toString());

        if (!title || title.trim().length === 0) {
            toast("That is not a valid title", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!description || description.trim().length === 0) {
            toast("That is not a valid description", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!rating || Number.isNaN(rating) || rating < 0 || rating > 10) {
            toast("That is not a valid rating", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/ratings", {
            method: "POST",
            body: JSON.stringify({
                activity: Number(slug),
                title: title,
                description: description,
                rating: rating
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong adding rating", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    useEffect(() => {
        getActivity();
    }, []);

    useEffect(() => {
        if (activity && JSON.stringify(activity) !== JSON.stringify({})) {
            getRatings();
        };
    }, [activity]);

    return (
        <div className={`${styles.page}`}>
            <h1>{activity ? activity["name"] : ""}</h1>
            <p>{activity ? activity["description"] : ""}</p>

            <h2>Ratings</h2>
            <Modal>
                <Button>Add Rating</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>Add a rating</Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={creatRating}>
                                    <Label htmlFor="title">Title:</Label>
                                    <Input type="text" id="title" name="title" />

                                    <Label htmlFor="description">Description:</Label>
                                    <Input type="text" id="description" name="description" />

                                    <Label htmlFor="rating">Rating:</Label>
                                    <Input type="number" max="5" min="0" id="rating" name="rating" />

                                    <Button type="submit">Add Rating</Button>
                                </Form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            {ratings.map((rating) => (
                <Card key={rating["id"]}>
                    <Card.Title>{rating["title"]}</Card.Title>
                    <Card.Description>
                        {rating["rating"]}/5 - {users[rating["userid"]]}

                        <br />
                        
                        {rating["description"]}
                    </Card.Description>
                </Card>
            ))}
        </div>
    );
};