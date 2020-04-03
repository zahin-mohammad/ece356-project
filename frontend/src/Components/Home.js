import React from "react"
import { Link, Route, useRouteMatch, Switch } from "react-router-dom"
import Feed from "./Feed"
import People from "./People"
import Repos from "./Repos"

export default function Home() {
    let { path, url } = useRouteMatch()

    return (
        <div>
            <ul>
                <li>
                    <Link to={`${url}`}>Feed</Link>
                </li>
                <li>
                    <Link to={`${url}people`}>People</Link>
                </li>
                <li>
                    <Link to={`${url}repos`}>Repos</Link>
                </li>
            </ul>

            <Switch>
                <Route exact path={path}>
                    <Feed />
                </Route>
                <Route path={`${path}people`}>
                    <People />
                </Route>
                <Route path={`${path}repos`}>
                    <Repos />
                </Route>
            </Switch>
        </div>
    )
}

// Reference: https://reacttraining.com/react-router/web/example/nesting
