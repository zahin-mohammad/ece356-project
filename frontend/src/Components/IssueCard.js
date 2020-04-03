import React from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function IssueCard(props) {
    // TODO: Get user who posted profile photo to display
    return (
        <Card style={{ width: '25rem', marginTop: '1rem', marginLeft: '1rem' }}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text> {props.date} - {props.user}</Card.Text>
                <Button variant="primary">Open</Button>
            </Card.Body>
        </Card>
    )
}