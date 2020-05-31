import React, { useContext, useState } from "react"
import { AuthContext } from "../App"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form"

export default function CreateNewIssue(props) {
    const initialState = {
        title: "",
        post_body: "",
        isSubmitting: false,
        errorMessage: null
    }

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const { state } = useContext(AuthContext)
    const [data, setData] = useState(initialState)

    const handleFormSubmit = event => {
        event.preventDefault()
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        })

        fetch("http://localhost:3001/create/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                repository_name: props.repository_name,
                user_name: state.username,
                title: data.title,
                post_body: data.post_body,
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.text()
                } else {
                    throw res
                }
            })
            .then(res => {
                props.createdNewIssueCallback()
                alert("Response: " + res)
            })
            .catch(error => {
                alert("Error: " + error.message || error.statusText)
            })
    }

    return (
        <Modal show={props.showNewIssue} onHide={() => props.setShowNewIssue(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Issue</Modal.Title>
            </Modal.Header>

            <Form style={{ margin: "1rem" }} onSubmit={handleFormSubmit}>
                <Form.Group controlId="formBasicDesc">
                    <Form.Control
                        name="title"
                        type="title"
                        placeholder="Enter title"
                        value={data.title}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDesc">
                    <Form.Control
                        name="post_body"
                        type="post_body"
                        placeholder="Enter issue body"
                        value={data.post_body}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    onClick={() => props.setShowNewIssue(false)}
                >Save New Issue</Button>
            </Form>

        </Modal>
    )
}
