import React from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function UserCard(props) {
    return (
        <Card style={{ width: '14rem', height: '24rem', marginTop: '1rem', marginLeft: '1rem' }}>
            <Card.Img variant="top" src={props.avatar_url} />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.email}</Card.Text>
                <Button variant="outline-primary" style={{position: "absolute", right: "0.5rem", bottom: "0.5rem"}}>Unfollow</Button>
            </Card.Body>
        </Card>
    )
}