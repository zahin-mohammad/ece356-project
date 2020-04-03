import React, { useState } from "react"
import RepoCard from "./RepoCard"

export default function Repos() {
    const [search, setSearch] = useState("")

    return (
        <div>
            <input 
                type="text"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search.."
            />

        <RepoCard name={"power-meter"} />
        <RepoCard name={"ezplanner-react-client"} />
        </div>
    )
}