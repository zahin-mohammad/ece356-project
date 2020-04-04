import React from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function RepoCard(props) {
    return (
        <Card style={{ width: '30rem', marginTop: '1rem', marginLeft: '1rem' }}>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.description}</Card.Text>
                <Button variant="outline-primary" style={{position: "absolute", right: "0.5rem", bottom: "0.5rem"}}>{props.following ? "Unfollow" : "Follow"}</Button>
            </Card.Body>
        </Card>
    )
}