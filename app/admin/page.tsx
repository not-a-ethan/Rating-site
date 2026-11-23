"use client";

import { redirect } from "next/navigation";

import { Button, Form, Label, Modal, Input } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

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

    // Check for admin too not only logged in

    // All the form submit handlers

    return (
        <div>
            <h1>Admin</h1>

            <h2>Activties</h2>

            <Modal>
                <Button>Create Activity</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />

                            <Modal.Header>
                                <Modal.Heading>Create Activity</Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <Label htmlFor="name">Name:</Label>
                                    <Input type="text" id="name" name="name" required />

                                    <br />

                                    <Label htmlFor="description">Description</Label>
                                    <Input type="text" id="description" name="description" required />

                                    <Button type="submit">Create Activity</Button>
                                </Form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            <Modal>
                <Button>Edit Activity</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />

                            <Modal.Header>
                                <Modal.Heading>Edit Activity</Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <Label htmlFor="id">Activity id</Label>
                                    <Input type="number" id="id" name="id" />

                                    <Button type="submit">Fill in current info</Button>
                                </Form>

                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <Label htmlFor="editName">New Name:</Label>
                                    <Input type="text" id="editName" name="editName" required />

                                    <Label htmlFor="editDescription">New Description</Label>
                                    <Input type="text" id="editDescription" name="editDescription" required />

                                    <Button type="submit">Edit Activity</Button>
                                </Form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            <Modal>
                <Button variant="danger">Delete Activity</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />

                            <Modal.Header>
                                <Modal.Heading>DELETE Activity</Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <Label htmlFor="id">Activity Id</Label>
                                    <Input type="number" id="id" name="id" required />

                                    <Button type="submit" variant="danger">Delete Activity</Button>
                                </Form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
};