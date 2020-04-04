import React, { useState, useEffect } from "react"
import UserCard from "./UserCard"
import CardColumns from 'react-bootstrap/CardColumns'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from "react-bootstrap/Button"


export default function People() {
    const [search, setSearch] = useState("")
    const [users, setUsers] = useState([])
    const [addNew, setAddNew] = useState(false)

    useEffect(() => {
        if (!addNew) {
            fetch("http://localhost:3001/following/user?user_name=atulbipin", { // People they're following
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
                setUsers(resJson)
            })
        } else {
            fetch("http://localhost:3001/users?user_name=atulbipin", { // People they're not following
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
                setUsers(resJson)
            })
        }
        
    }, [addNew]) // TODO: can add search to the trigger variables and do a fetch with MYSQL Query for search

    // TODO: Should probably actually do filtering with SQL...

    const usersToDisplay = users
                            .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
                            .map(user => <UserCard key={user.username} name={user.name} avatar_url={user.avatar_url} email={user.email} following={!addNew}/>)

    return (
        <div>
            <InputGroup className="mb-3" style={{width: "40rem", margin: "1rem"}}>
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">🔍</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search"
                    aria-label="search"
                    aria-describedby="basic-addon1"
                />
                <Button 
                    variant="outline-dark" 
                    style={{ marginLeft: "1rem" }}
                    onClick={(event) => setAddNew(!addNew)}
                >{addNew ? "← Back" : "Follow New"}</Button>
            </InputGroup>
            

            <CardColumns>
                {usersToDisplay}
            </CardColumns>
        </div>
    )
}