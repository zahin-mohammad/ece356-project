import React from "react"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form"


export default function CreateNewRepo(props) {
    return (
        <Modal show={props.showNewRepo} onHide={() => props.setShowNewRepo(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Repository</Modal.Title>
                </Modal.Header>

                <Form style={{ margin: "1rem" }}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Repository Name</Form.Label>
                        <Form.Control type="name" placeholder="Enter name" />
                        <Form.Text className="text-muted">Name must be unique from all other existing repos.</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicDesc">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder="Enter description" />
                    </Form.Group>
                </Form>

                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={() => props.setShowNewRepo(false)}>Save New Repo</Button>
                </Modal.Footer>
            </Modal>
    )
}