import React, { useContext, useEffect, useState } from "react"
import Modal from "react-bootstrap/Modal";
import ReactMarkdown from "react-markdown";
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { AuthContext } from "../App";


export default function IssueView(props) {

    const [postBody, setPostBody] = useState("")
    const [replyingTo, setReplyingTo] = useState("")
    const [isSubmitting, setIsSubmitting] = useState("")
    const { state } = useContext(AuthContext)
    const [comments, setComments] = useState([])
    const [replies, setReplies] = useState({})
    const [toggleRefresh, setToggleRefresh] = useState(false)
    const [reactionInfo, setReactionInfo] = useState({})

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

        fetch(`http://localhost:3001/post/reactions?post_id=${props.id}`, {
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
                var reactionMap = {}
                resJson.forEach(reaction => {
                    if (!(reaction.comment_id in reactionMap)) {
                        reactionMap[reaction.comment_id] = {}
                    }
                    reactionMap[reaction.comment_id][reaction.emoji] = reaction.count
                })
                setReactionInfo(reactionMap)
            })

    }, [isSubmitting, props.id, toggleRefresh])

    const submitPost = () => {
        fetch(`http://localhost:3001/create/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_name: state.username,
                post_id: props.id,
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

    const reactToComment = (reaction, commentId) => {
        fetch("http://localhost:3001/create/reaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_name: state.username,
                comment_id: commentId,
                reaction: reaction,
            })
        })
            .then(res => {
                if (res.ok) {
                    setToggleRefresh(!toggleRefresh)
                } else {
                    throw res
                }
            })
    }

    const renderComment = (level, username, body, commentId) => {
        var renderReplies = Object
            .values(replies)
            .filter(reply => reply.comment_id === commentId)
            .map(reply => renderComment(level + 1, reply.username, reply.body, reply.reply_id))


        return (
            <Container
                style={{ margin: 0, padding: 0 }}
                key={commentId}>
                <Row
                    style={{ marginLeft: `${0.5 * level}rem`, borderLeft: '3px solid red' }}
                    className="align-items-center"
                >
                    <Col xs={10}>
                        <span style={{ backgroundColor: "#FDD7E4", backgroundImage: "linear-gradient(to right, #ffe359 0 %, #fff2ac 100 %)" }}
                        >{username}</span>
                        <ReactMarkdown
                            source={body}
                            escapeHtml={false}
                        />
                        <ListGroup horizontal style={{ cursor: "pointer" }}>
                            <ListGroup.Item
                                onClick={() => reactToComment("+1", commentId)}
                            >{reactionInfo[commentId] && reactionInfo[commentId]["+1"] || 0} <span role="img" aria-label="thumbs up">👍🏽</span></ListGroup.Item>
                            <ListGroup.Item
                                onClick={() => reactToComment("-1", commentId)}
                            >{reactionInfo[commentId] && reactionInfo[commentId]["-1"] || 0} <span role="img" aria-label="thumbs down">👎🏽</span></ListGroup.Item>
                            <ListGroup.Item
                                onClick={() => reactToComment("laugh", commentId)}
                            >{reactionInfo[commentId] && reactionInfo[commentId]["laugh"] || 0} <span role="img" aria-label="laugh">😂</span></ListGroup.Item>
                            <ListGroup.Item
                                onClick={() => reactToComment("rocket", commentId)}
                            >{reactionInfo[commentId] && reactionInfo[commentId]["rocket"] || 0} <span role="img" aria-label="rocketship">🚀</span></ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col>
                        <span
                            style={{ right: "0.5rem", bottom: "0.5rem", cursor: "pointer" }}
                            role="img" aria-label="curved arrow pointing left"
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

    const commentsToShow = comments
        .filter(comment => !(comment.id in replies))
        .map(comment => renderComment(0, comment.username, comment.body, comment.id))

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
                {replyingTo === "" ?
                    null
                    : <Button
                        variant="outline-dark"
                        style={{ marginRight: "0.5rem" }}
                        onClick={() => setReplyingTo("")}
                    >← Back</Button>}
                <FormControl
                    value={postBody}
                    onChange={event => setPostBody(event.target.value)}
                    placeholder={replyingTo === "" ? "Comment" : "Reply"}
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
                ><span role="img" aria-label="plus sign">➕</span> Post</Button>
            </InputGroup>
        </Modal>
    )
}
