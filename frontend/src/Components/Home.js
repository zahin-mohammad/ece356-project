import React from "react"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import Feed from "./Feed"
import People from "./People"
import Repos from "./Repos"


export default function Home() {

    return (
        <Tabs defaultActiveKey="feed" id="uncontrolled-tab-example">
            <Tab eventKey="feed" title="Feed">
                <Feed />
            </Tab>
            <Tab eventKey="people" title="People">
                <People />
            </Tab>
            <Tab eventKey="repos" title="Repos">
                <Repos />
            </Tab>
        </Tabs>
    )
}
