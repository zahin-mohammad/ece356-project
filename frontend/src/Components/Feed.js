import React, { useState, useEffect } from "react"
import IssueCard from "./IssueCard.js"

export default function Feed() {
    const [issues, setIssues] = useState([])

    useEffect(() => {
        // TODO: Fetch from server here

        setIssues([
            {"id": 573408419, "title": "Add flutter", "username": "zahin-mohammad"},
            {"id": 549249843, "title": "Incorrect zsh paths in ~/.zshrc", "username": "zahin-mohammad"},
            {"id": 490936608, "title": "Verbose android Injection fails with missing binding", "username": "matejdro"},
            {"id": 568960683, "title": "Writes files as root", "username": "JakeWharton"}
        ])
    }, [])

    const issuesToDisplay = issues.map(issue => <IssueCard key={issue.id} title={issue.title} user={issue.username} date={"Unknown Date"} notif={true} />)

    return (
        <div>
            {issuesToDisplay}
        </div>
    )
}