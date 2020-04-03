import React, { useState } from "react"

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
        </div>
    )
}