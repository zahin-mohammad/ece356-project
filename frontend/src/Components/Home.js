import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Feed from "./Feed"
import People from "./People"
import Repos from "./Repos"

export default function Home() {

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
