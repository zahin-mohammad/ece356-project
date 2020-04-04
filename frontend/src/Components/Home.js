import React, { useContext, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Feed from "./Feed"
import People from "./People"
import Repos from "./Repos"
import { AuthContext } from "../App"

export default function Home() {

    const {state: authState} = useContext(AuthContext)

    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to={"/"}>Feed</Link>
                    </li>
                    <li>
                        <Link to={"/people"}>People</Link>
                    </li>
                    <li>
                        <Link to={"/repos"}>Repos</Link>
                    </li>
                </ul>

                <Switch>
                    <Route exact path="/">
                        <Feed />
                    </Route>
                    <Route path={"/people"}>
                        <People />
                    </Route>
                    <Route path={"/repos"}>
                        <Repos />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

// Reference: https://reacttraining.com/react-router/web/example/nesting
