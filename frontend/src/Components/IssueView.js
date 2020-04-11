import React, { useEffect, useState } from "react"
import Modal from "react-bootstrap/Modal";
import ReactMarkdown from "react-markdown";

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

    const commentsToShow = comments.map(comment => {
        console.log(comment.Body)
        console.log(comment)
        return <ReactMarkdown
            source={comment.body}
            escapeHtml={false}
        />
    });

    return (
        <Modal
            show={props.showIssueView}
            onHide={() => props.setShowIssue(false)}
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