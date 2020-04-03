import React from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function IssueCard() {
    return (
        <Card style={{ width: '18rem', marginTop: '1rem', marginLeft: '1rem' }}>
            <Card.Body>
                <Card.Title>Issue Title</Card.Title>
                <Card.Text> The body of the first comment on the issue</Card.Text>
                <Button variant="primary">Open</Button>
            </Card.Body>
        </Card>
    )
}