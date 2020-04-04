import React, { useState, useEffect, useContext } from "react"
import IssueCard from "./IssueCard.js"
import { AuthContext } from "../App.js"


export default function Feed() {
    const [issues, setIssues] = useState([])
    const { state } = useContext(AuthContext)

    useEffect(() => {
        fetch(`http://localhost:3001/feed?user_name=${state.username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw res
            }
        })
        .then(resJson => {
            setIssues(resJson)
        })
    }, [])

    // Notification logic will need to be more ... logical :) Should do it in SQL!
    const issuesToDisplay = issues
                                .map(issue => <IssueCard 
                                                    key={issue.id} 
                                                    title={issue.title} 
                                                    repository_name={issue.repository_name}
                                                    user={issue.username} 
                                                    date={"Unknown Date"} 
                                                    notif={true} 
                                                />
                                    )

    return (
        <div>
            {issuesToDisplay}
        </div>
    )
}
