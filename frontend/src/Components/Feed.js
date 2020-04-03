import React from "react"
import IssueCard from "./IssueCard.js"

export default function Feed() {
    return (
        <div>
            <IssueCard key={1} title={"I got 99 issues, and React aint one"} date={"April 3, 2020"} user={"Brian Norman"}/>
            <IssueCard key={2} title={"You got an issue pal?"} date={"April 1, 2020"} user={"Atul Bipin"}/>
            <IssueCard key={3} title={"Hey whats the issue here..."} date={"March 2, 2020"} user={"Max Dai"}/>
        </div>
    )
}