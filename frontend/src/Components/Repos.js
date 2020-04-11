import React, { useState, useEffect, useContext } from "react"
import RepoCard from "./RepoCard"
import CreateNewRepo from "./CreateNewRepo"
import { AuthContext } from "../App"
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import IssueCard from "./IssueCard.js"
import CreateNewIssue from "./CreateNewIssue"

export default function Repos() {
    const { state } = useContext(AuthContext)
    const [search, setSearch] = useState("")
    const [repos, setRepos] = useState([])
    const [issues, setIssues] = useState([])
    const [addNew, setAddNew] = useState(false)
    const [followUnfollow, setFollowUnfollow] = useState(false)
    const [showNewRepo, setShowNewRepo] = useState(false)
    const [showNewIssue, setShowNewIssue] = useState(false)
    const [createdNewRepo, setCreatedNewRepo] = useState(false)
    const [createdNewIssue, setcreatedNewIssue] = useState(false)
    const [issuesRepo, setIssuesRepo] = useState("")

    useEffect(() => {
        if (!addNew) {
            fetch(`http://localhost:3001/following/repository?user_name=${state.username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        throw res
                    }
                })
                .then(resJson => {
                    setRepos(resJson)
                })
        } else {
            fetch(`http://localhost:3001/repository?user_name=${state.username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        throw res
                    }
                })
                .then(resJson => {
                    setRepos(resJson)
                })
        }
        if (issuesRepo !== "") {
            fetch(`http://localhost:3001/repository/posts?repository_name=${issuesRepo}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        throw res
                    }
                })
                .then(resJson => {
                    setIssues(resJson)
                })
        }
    }, [addNew, followUnfollow, createdNewRepo, issuesRepo, createdNewIssue, state.username]) // TODO: can add search to the trigger variables and do a fetch with MYSQL Query for search

    // TODO: Should probably actually do filtering with SQL...
    const reposToDisplay = repos
        .filter(repo => repo.name.toLowerCase().includes(search.toLowerCase()))
        .map(repo => <RepoCard
            key={repo.name}
            name={repo.name}
            viewRepoCallback={() => setIssuesRepo(repo.name)}
            description={repo.description}
            following={!addNew}
            followUnfollowCallback={() => setFollowUnfollow(!followUnfollow)}
        />
        )
    const issuesToDisplay = issues
        .filter(issue => issue.title.toLowerCase().includes(search.toLowerCase()))
        .map(issue => <IssueCard
            key={issue.id}
            id={issue.id}
            title={issue.title}
            repository_name={issue.repository_name}
            user={issue.username}
            date={new Date(issue.created_at).toISOString().split('T')[0]}
            notif={false}
        />
        )

    return (issuesRepo !== "" ?
        (<div>
            <InputGroup className="mb-3" style={{ width: "40rem", margin: "1rem" }}>
                <Button
                    variant="outline-dark"
                    style={{ marginRight: "0.5rem" }}
                    onClick={(event) => {
                        setIssuesRepo(false)
                        setSearch("")
                    }}
                >← Back</Button>
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1"><span role="img" aria-label="search emoji">🔍</span></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search"
                    aria-label="search"
                    aria-describedby="basic-addon1"
                />
                <Button
                    variant="outline-dark"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setShowNewIssue(true)}
                ><span role="img" aria-label="plus sign">➕</span> Issue</Button>
            </InputGroup>
            {issuesToDisplay}

            <CreateNewIssue
                repository_name={issuesRepo}
                showNewIssue={showNewIssue}
                setShowNewIssue={() => setShowNewIssue()}
                createdNewIssueCallback={() => setcreatedNewIssue(!createdNewIssue)}
            />
        </div>)
        :
        (
            <div>
                <InputGroup className="mb-3" style={{ width: "40rem", margin: "1rem" }}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1"><span role="img" aria-label="search emoji">🔍</span></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search"
                        aria-label="search"
                        aria-describedby="basic-addon1"
                    />
                    <Button
                        variant="outline-dark"
                        style={{ marginLeft: "1rem" }}
                        onClick={(event) => {
                            setAddNew(!addNew)
                            setSearch("")
                        }}
                    >{addNew ? "← Back" : "Follow New"}</Button>
                    <Button
                        variant="outline-dark"
                        style={{ marginLeft: "1rem" }}
                        onClick={() => setShowNewRepo(true)}
                    ><span role="img" aria-label="plus sign">➕</span> Repo </Button>
                </InputGroup>

                {reposToDisplay}

                <CreateNewRepo
                    showNewRepo={showNewRepo}
                    setShowNewRepo={() => setShowNewRepo()}
                    createdNewRepoCallback={() => setCreatedNewRepo(!createdNewRepo)}
                />

            </div>
        ))
}