import React, { useState, useEffect } from "react"
import UserCard from "./UserCard"
import CardColumns from 'react-bootstrap/CardColumns'


export default function People() {
    const [search, setSearch] = useState("")
    const [users, setUsers] = useState([])

    useEffect(() => {
        // TODO: Fetch from server here

        setUsers([
            {"username": "zahin-mohammad", "name": "Zahin Mohammad", "avatar_url": "https://avatars1.githubusercontent.com/u/24881706?v=4", "email": "zahin.dev@gmail.com", "last_login_time": 1585950315}, 
            {"username": "JakeWharton", "name": "Jake Wharton", "avatar_url": "https://avatars0.githubusercontent.com/u/66577?v=4", "email": "j@ke.fyi", "last_login_time": 1585950006},
            {"username": "brian-norman", "name": "Brian Norman", "avatar_url": "https://avatars0.githubusercontent.com/u/9154202?v=4", "email": "briankn8@gmail.com", "last_login_time": 1585952466},
            {"username": "atulbipin", "name": "Atul Bipin", "avatar_url": "https://avatars2.githubusercontent.com/u/19649216?v=4", "email": "atulbipin@gmail.com", "last_login_time": 1585952112}
        ])
    }, [])

    // TODO: Should probably actually do filtering with SQL...
    const usersToDisplay = users
                            .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
                            .map(user => <UserCard name={user.name} avatar_url={user.avatar_url} email={user.email}/>)

    return (
        <div>
            <input 
                type="text"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search.."
            />
            <CardColumns>
                {usersToDisplay}
            </CardColumns>
        </div>
    )
}