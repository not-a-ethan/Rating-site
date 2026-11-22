"use client";

import { Label, Input, Button } from "@heroui/react";

import { authClient } from "../../lib/auth-client";

export default function Page() {

    async function handleSignUp(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const formInputs = Object.fromEntries(formData);

        const email: string = formInputs["email"].toString();
        const username: string = formInputs["username"].toString();
        const password: string = formInputs["password"].toString();

        const { data, error } = await authClient.signUp.email({
            email: email,
            name: username,
            username: username,
            password: password,
            callbackURL: "/dashboard"
        });
    };

    return (
        <div className="page">
            <h1>Sign Up</h1>

            <form onSubmit={handleSignUp}>
                <Label htmlFor="username">Username:</Label>
                <Input type="text" id="name" name="username" />

                <Label htmlFor="email">Email:</Label>
                <Input type="email" id="email" name="email" />

                <Label htmlFor="password">Password:</Label>
                <Input type="password" id="password" name="password" />

                <Button type="submit">Sign Up</Button>
            </form>
        </div>
    );
};