import React, { useContext, useEffect, useState } from "react"
import Modal from "react-bootstrap/Modal";
import ReactMarkdown from "react-markdown";
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Button, Container, Row, Col } from 'react-bootstrap';
import { AuthContext } from "../App";


export default function IssueView(props) {

    const [postBody, setPostBody] = useState("")
    const [replyingTo, setReplyingTo] = useState("")
    const [isSubmitting, setIsSubmitting] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const { state } = useContext(AuthContext)
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
    }, [isSubmitting])

    const submitPost = () => {
        // console.log(comments[0])
        fetch(`http://localhost:3001/create/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_name: state.username,
                post_id: comments[0].post_id,
                comment_body: postBody,
                replying_to: replyingTo
            }),
        })
            .then(res => {
                if (res.ok) {
                    return res.text()
                } else {
                    throw res
                }
            })
            .then(resJson => {
                setIsSubmitting(false)
            })
    };

    const commentsToShow = comments.map(comment => {
        return (
            <Container
                key={comment.id}>
                <Row className="align-items-center">
                    <Col xs={10}>
                        <ReactMarkdown
                            style={{ marginRight: "0.5rem" }}
                            source={comment.body}
                            escapeHtml={false}
                        />
                    </Col>
                    <Col>
                        <span
                            style={{ right: "0.5rem", bottom: "0.5rem", cursor: "pointer" }}
                            role="image"
                            onClick={(event) => { setReplyingTo(comment.id) }}
                        >
                            ↩️
                        </span>
                    </Col>
                </Row>
            </Container>
        )
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

            <InputGroup className="mb-3" style={{ width: "40rem", margin: "1rem" }}>
                {replyingTo == "" ?
                    null
                    : <Button
                        variant="outline-dark"
                        style={{ marginRight: "0.5rem" }}
                        onClick={(event) => {
                            setReplyingTo("")
                        }}
                    >← Back</Button>}
                <FormControl
                    value={postBody}
                    onChange={(event) => setPostBody(event.target.value)}
                    placeholder={replyingTo == "" ? "Comment" : "Reply"}
                    aria-label="text"
                    aria-describedby="basic-addon1"
                />
                <Button
                    variant="outline-dark"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => {
                        setIsSubmitting(true)
                        setPostBody("")
                        setReplyingTo("")
                        submitPost()
                    }}
                >➕ Post</Button>
            </InputGroup>
        </Modal>
    )
}