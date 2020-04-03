import React, { useState } from "react"
import UserCard from "./UserCard"

export default function People() {
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

            <UserCard name={"Zahin Mohammad"} pictureUrl={"https://avatars3.githubusercontent.com/u/24881706?s=400&u=c61b00a78b3b40e4626a3048d9ae35204cfa4b74&v=4"}/>
            <UserCard name={"Brian Norman"} pictureUrl={"https://avatars0.githubusercontent.com/u/9154202?s=460&u=0032cce6716353370df350b4f2468ae98beaea53&v=4"}/>
        </div>
    )
}