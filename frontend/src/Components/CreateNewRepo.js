import React from "react"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


export default function CreateNewRepo(props) {
    return (
        <Modal show={props.showNewRepo} onHide={() => props.setShowNewRepo(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Repository</Modal.Title>
                </Modal.Header>
                <Modal.Body>This is where I would put the form for a new Repo</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => props.setShowNewRepo(false)}>Save New Repo</Button>
                </Modal.Footer>
            </Modal>
    )
}