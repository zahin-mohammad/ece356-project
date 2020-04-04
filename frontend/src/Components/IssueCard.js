import React from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

export default function IssueCard(props) {
    // TODO: Get user who posted profile photo to display
    // TODO: Notification should be based on date last updated and date last logged in
    return (
        <div>
            <Badge pill variant="light">{props.notif ? "🔔" : ""}</Badge>
            <Card style={{ width: '25rem', marginBottom: '1rem', marginLeft: '1rem' }}>
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text> {props.date} - {props.user}</Card.Text>
                    <Button variant="outline-primary" style={{position: "absolute", right: "0.5rem", bottom: "0.5rem"}}>Open</Button>
                </Card.Body>
            </Card>
        </div>
    )
}
