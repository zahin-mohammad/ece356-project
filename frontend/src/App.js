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
          <NavLink to = "/" style = {navStyle}> Home </NavLink>
          <NavLink to = "/signOut" style = {navStyle}> Sign Out </NavLink>
        </nav>

        <Switch>
          <Route exact path = "/">
            <Home />
          </Route>
          <Route path = "/signOut">
            <SignOut />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
