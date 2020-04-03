import React from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function UserCard(props) {
    return (
        <Card style={{ width: '12rem', marginTop: '1rem', marginLeft: '1rem' }}>
            <Card.Img variant="top" src={props.pictureUrl} />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Button variant="primary">Unfollow</Button>
            </Card.Body>
        </Card>
    )
}