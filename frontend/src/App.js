import React, { useEffect, useReducer } from "react"
import Home from "./Components/Home"
import Login from "./Components/Login"
import Header from "./Components/Header"

export const AuthContext = React.createContext()

const initialState = {
  isAuthenticated: false,
  username: null,
  lastLogin: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("username", JSON.stringify(action.payload.username))
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        lastLogin: action.payload.lastLogin
      }
    case "LOGOUT":
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        username: null,
        lastLogin: null
      }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const username = JSON.parse(localStorage.getItem("username") || null)
    const lastLogin = JSON.parse(localStorage.getItem("lastLogin") || null)

    if (username) {
      dispatch({
        type: "LOGIN",
        payload: {
          username,
          lastLogin
        }
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Header />
      {!state.isAuthenticated ? <Login /> : <Home />}
    </AuthContext.Provider>
  )
}
