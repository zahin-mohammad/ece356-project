import React from "react"
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom"
import SignOut from "./Components/SignOut"
import Home from "./Components/Home"


export default function App() {
  // TODO: https://reacttraining.com/react-router/web/example/auth-workflow
  let navStyle = {
    fontWeight: "normal",
    margin: "0.5rem",
    background: "none"
  }
  return (
    <Router>
      <div>
        <nav>
          <NavLink exact to = "/" style = {navStyle}> Home </NavLink>
          <NavLink exact to = "/signOut" style = {navStyle}> Sign Out </NavLink>
        </nav>

        <Switch>
          <Route path = "/signOut">
            <SignOut />
          </Route>
          <Route path = "/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
