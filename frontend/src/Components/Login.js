import React, { useContext, useState } from "react"
import { AuthContext } from "../App"

export default function Login() {
    const initialState = {
        email: "",
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
        fetch("https://jsonplaceholder.typicode.com/todos/1", {
            // method: "post"
            method: "get",
            headers: {
                "Content-Type": "application/json"
            },
            // body: JSON.stringify({
            //     username: data.username,
            //     password: data.password
            // })
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
                // payload: resJson,
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
        <form onSubmit={handleFormSubmit}>
            <h1>Login</h1>

            <label htmlFor="username">
                username
                <input 
                    type="text"
                    value={data.username}
                    onChange={handleInputChange}
                    name="username"
                    id="username"
                />
            </label>

            <label htmlFor="password">
                password
                <input 
                    type="password"
                    value={data.password}
                    onChange={handleInputChange}
                    name="password"
                    id="password"
                />
            </label>

            {data.errorMessage}

            <button disabled={data.isSubmitting}>
                {data.isSubmitting ? "Loading..." : "Login"}
            </button>
        </form>
    )
}
