import React, { useContext } from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { AuthContext } from "../App"

function handleFollowUnfollowClick(following, currentFollower, currentFollowee, followUnfollowCallback) {
    if (following) {
        fetch(`http://localhost:3001/unfollow/user`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                follower: currentFollower,
                followee: currentFollowee
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
        fetch(`http://localhost:3001/follow/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                follower: currentFollower,
                followee: currentFollowee
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

export default function UserCard(props) {
    const { state } = useContext(AuthContext)
    return (
        <Card style={{ width: '14rem', height: '24rem', marginTop: '1rem', marginLeft: '1rem' }}>
            <Card.Img variant="top" src={props.avatar_url} />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.email}</Card.Text>
                <Button 
                    variant="outline-primary" 
                    style={{position: "absolute", right: "0.5rem", bottom: "0.5rem"}}
                    onClick={() => handleFollowUnfollowClick(props.following, state.username, props.username, props.followUnfollowCallback)}
                >{props.following ? "Unfollow" : "Follow"}</Button>
            </Card.Body>
        </Card>
    )
}
