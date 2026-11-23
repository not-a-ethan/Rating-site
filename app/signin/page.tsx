"use client";

import { Label, Input, Button } from "@heroui/react";

import { authClient } from "../../lib/auth-client";

export default function Page() {

    async function handleSignIn(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const formInputs = Object.fromEntries(formData);

        const username: string = formInputs["username"].toString();
        const password: string = formInputs["password"].toString();

        const { data, error } = await authClient.signIn.username({
            username: username,
            password: password,
            callbackURL: "/activities"
        });
    };

    return (
        <div className="page">
            <h1>Sign in</h1>

            <form onSubmit={handleSignIn}>
                <Label htmlFor="username">Username:</Label>
                <Input type="text" id="username" name="username" />

                <Label htmlFor="password">Password:</Label>
                <Input type="password" id="password" name="password" />

                <Button type="submit">Sign In</Button>
            </form>
        </div>
    );
};