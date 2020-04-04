import React, { useContext } from "react"
import { AuthContext } from "../App"

export default function Header() {
    const {state, dispatch} = useContext(AuthContext)

    return (
        <nav>
            <button
                onClick={() =>
                    dispatch({
                        type: "LOGOUT"
                    })
                }
                style = {{position: "absolute", right: "1rem", top: "1rem"}}
            >
                {state.isAuthenticated && (
                <p>Hi {state.username} (LOGOUT)</p>
                )}
            </button>
        </nav>
    )
}