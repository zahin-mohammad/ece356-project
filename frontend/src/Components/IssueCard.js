import React, { useState } from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import IssueView from "./IssueView"


export default function IssueCard(props) {
    // TODO: Get user who posted profile photo to display

    const [showIssue, setShowIssue] = useState(false)

    return (
        <div>
            <Badge pill variant="light">{props.notif ? "🔔" : ""}</Badge>
            <Card style={{ width: '40rem', marginBottom: '1rem', marginLeft: '1rem' }}>
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>{props.repository_name}</Card.Text>
                    <Card.Text> {props.date} - {props.user}</Card.Text>
                    <Button 
                        variant="outline-primary" 
                        style={{position: "absolute", right: "0.5rem", bottom: "0.5rem"}}
                        onClick={() => setShowIssue(true)}
                    >Open</Button>
                </Card.Body>
            </Card>

            <IssueView
                showIssueView={showIssue}
                setShowIssue={() => setShowIssue(false)}
                id={props.id}
                title={props.title}
            />
        </div>
    )
}
