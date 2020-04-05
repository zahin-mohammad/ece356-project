import React, { useEffect, useState } from "react"
import Modal from "react-bootstrap/Modal"

export default function IssueView(props) {
    const [comments, setComments] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3001/comments?post_id=${props.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw res
            }
        })
        .then(resJson => {
            setComments(resJson)
        })
    })

    const commentsToShow = comments.map(comment => <p>{comment.body}</p>)

    return (
        <Modal 
            show={props.showIssueView} 
            onHide={() => props.setChosenIssue(null)}
            size="lg"
        >

            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {commentsToShow}
            </Modal.Body>
        </Modal>
    )
}