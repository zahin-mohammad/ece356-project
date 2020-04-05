import React, { useContext, useState } from "react"
import { AuthContext } from "../App"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form"


export default function CreateNewRepo(props) {
    const initialState = {
        name: "",
        description: "",
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
        fetch("http://localhost:3001/create/repository", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                repository_name: data.name,
                user_name: state.username,
                description: data.description
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
            props.createdNewRepoCallback()
            alert("Response: " + res)
        })
        .catch(error => {
            alert("Error: " + error.message || error.statusText)
        })
    }

    return (
        <Modal show={props.showNewRepo} onHide={() => props.setShowNewRepo(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Repository</Modal.Title>
                </Modal.Header>

                <Form style={{ margin: "1rem" }} onSubmit={handleFormSubmit}>
                    
                    <Form.Group controlId="formBasicName">
                        <Form.Control 
                            name="name"
                            type="name" 
                            placeholder="Enter Repository Name" 
                            value={data.name}
                            onChange={handleInputChange}
                        />
                        <Form.Text className="text-muted">Name must be unique from all other existing repos.</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicDesc">
                        <Form.Control 
                            name="description"
                            type="description"
                            placeholder="Enter description"
                            value={data.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        onClick={() => props.setShowNewRepo(false)}
                    >Save New Repo</Button>
                </Form>

            </Modal>
    )
}
