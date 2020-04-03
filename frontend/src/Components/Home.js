import React from "react"
import { Link, Route, useRouteMatch, Switch } from "react-router-dom"

export default function Home() {
    // TODO: https://reacttraining.com/react-router/web/example/nesting
    let { path, url } = useRouteMatch()

    return (
        <div>
            <h1>Home</h1>
            <ul>
                <li>
                    <Link to = {`${url}/`}>Feed</Link>
                </li>
                <li>
                    <Link to = {`${url}/people`}>People</Link>
                </li>
                <li>
                    <Link to = {`${url}/repos`}>Repos</Link>
                </li>
            </ul>

            <Switch>
                <Route exact path={path}>
                    <h3>Testing</h3>
                </Route>
                <Route path={`${path}/people`}>
                    <h3>People</h3>
                </Route>
            </Switch>
        </div>
    )
}