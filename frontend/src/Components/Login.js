import React, { useContext, useState } from "react"
import { AuthContext } from "../App"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"


export default function Login() {
    const initialState = {
        username: "",
        password: "",
        isSubmitting: false,
        errorMessage: null
    }

    const { dispatch } = useContext(AuthContext)

    const [data, setData] = useState(initialState)

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    // https://www.freecodecamp.org/news/state-management-with-react-hooks/
    const handleFormSubmit = event => {
        event.preventDefault()
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        })
        fetch("http://localhost:3001/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: data.username,
                password: data.password
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw res
                }
            })
            .then(resJson => {
                dispatch({
                    type: "LOGIN",
                    payload: {
                        username: data.username
                    }
                })
            })
            .catch(error => {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: error.message || error.statusText
                })
            })
    }


    return (
        <Form
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "80vh" }}
            onSubmit={handleFormSubmit}
        >
            <Form.Group controlId="formBasicUsername">
                <Form.Control
                    name="username"
                    id="username"
                    type="username"
                    placeholder="Enter username"
                    value={data.username}
                    onChange={handleInputChange}
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Control
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={handleInputChange}
                />
            </Form.Group>

            {data.errorMessage}

            <Button
                variant="primary"
                type="submit"
                disabled={data.isSubmitting}
            >
                {data.isSubmitting ? "Loading..." : "Login"}
            </Button>
        </Form>

    )
}
