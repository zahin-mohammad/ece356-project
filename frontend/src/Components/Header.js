import React, { useContext } from "react"
import { AuthContext } from "../App"
import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/NavBar"


export default function Header() {
    const {state, dispatch} = useContext(AuthContext)

    return (
        <Navbar bg="dark" variant="dark" fixed="top">
            <Navbar.Brand href="/">Home</Navbar.Brand>
                { state.isAuthenticated ? 
                <Button
                    style = {{ position: "absolute", right: "1rem" }}
                    variant="light" 
                    onClick={() =>
                        dispatch({
                            type: "LOGOUT"
                        })
                    }
                > {"Hi " + state.username + " (LOGOUT)"}
                </Button> : null }
        </Navbar>
    )
}