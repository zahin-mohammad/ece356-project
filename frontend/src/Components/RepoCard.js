import React, { useContext } from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { AuthContext } from "../App"

function handleFollowUnfollowClick(following, currentFollower, currentRepo, followUnfollowCallback) {
    if (following) {
        fetch(`http://localhost:3001/unfollow/repo`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                follower: currentFollower,
                repository_name: currentRepo
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res
                } else {
                    followUnfollowCallback()
                    return res.text()
                }
            })
            .catch(error => {
                alert(error)
            })
    } else {
        fetch(`http://localhost:3001/follow/repo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                follower: currentFollower,
                repository_name: currentRepo
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res
                } else {
                    followUnfollowCallback()
                    return res.text()
                }
            })
            .catch(error => {
                alert(error)
            })
    }
}


export default function RepoCard(props) {
    const { state } = useContext(AuthContext)
    return (
        <Card style={{ width: '30rem', marginTop: '1rem', marginLeft: '1rem' }}>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text
                    style={{ paddingBottom: "1rem" }}
                >{props.description}</Card.Text>
                <Button
                    variant="outline-primary"
                    style={{ position: "absolute", left: "0.5rem", bottom: "0.5rem" }}
                    onClick={() => props.viewRepoCallback()}
                >{"View Repo"}</Button>
                <Button
                    variant="outline-primary"
                    style={{ position: "absolute", right: "0.5rem", bottom: "0.5rem" }}
                    onClick={() => handleFollowUnfollowClick(props.following, state.username, props.name, props.followUnfollowCallback)}
                >{props.following ? "Unfollow" : "Follow"}</Button>
            </Card.Body>
        </Card>
    )
}