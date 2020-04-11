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
    const { state } = useContext(AuthContext)
    const [comments, setComments] = useState([])
    const [replies, setReplies] = useState({})


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

        fetch(`http://localhost:3001/post/replies?post_id=${props.id}`, {
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
                var replyMap = {}
                resJson.forEach(element => replyMap[element.reply_id] = element)
                setReplies(replyMap)
            })

    }, [isSubmitting])

    const submitPost = () => {
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

    const renderComment = (level, body, commentId) => {

        var myReplies = []
        Object.keys(replies).forEach(function (replyId) {
            if (replies[replyId].comment_id == commentId) {
                myReplies.push(replies[replyId]);
            }
        });
        var renderReplies = myReplies.map((reply) => renderComment(level + 1, reply.body, reply.reply_id))
        console.log(myReplies)
        return (
            <Container
                key={commentId}>
                <Row
                    style={{ marginLeft: `${0.5 * level}rem` }}
                    className="align-items-center"
                >
                    <Col xs={10}>
                        <ReactMarkdown
                            style={{ marginRight: "0.5rem" }}
                            source={body}
                            escapeHtml={false}
                        />
                    </Col>
                    <Col>
                        <span
                            style={{ right: "0.5rem", bottom: "0.5rem", cursor: "pointer" }}
                            role="image"
                            onClick={(event) => { setReplyingTo(commentId) }}
                        >
                            ↩️
                        </span>
                    </Col>
                </Row>
                {renderReplies}
            </Container>
        )
    }

    const commentsToShow = comments.filter(comment => {
        if (comment.id in replies) {
            return false;
        }
        return true;
    }).map(comment => {
        return (
            renderComment(1, comment.body, comment.id)
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