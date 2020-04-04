import React, { useState, useEffect } from "react"
import RepoCard from "./RepoCard"

export default function Repos() {
    const [search, setSearch] = useState("")
    const [repos, setRepos] = useState([])

    useEffect(() => {
        // TODO: Fetch from server here

        setRepos([
            {"id": 145274447, "name": "atulbipin/PantsOrShorts-iOS", "description": "The Official iOS Port of Pants or Shorts", "created_at": "2018-08-19T05:00:17Z", "updated_at": "2018-08-19T18:38:40Z"}, 
            {"id": 106156389, "name": "atulbipin/clojure-spellchecker", "description": "A simple spellchecker written in Clojure", "created_at": "2017-10-08T06:55:50Z", "updated_at": "2017-11-20T00:00:27Z"},
            {"id": 240529808, "name": "zahin-mohammad/gh-analytics", "description": "Playing around with the github API.", "created_at": "2020-02-14T14:44:17Z", "updated_at": "2020-02-14T23:14:31Z"},
            {"id": 249038105, "name": "zahin-mohammad/ece356-project", "description": null, "created_at": "2020-03-21T18:36:57Z", "updated_at": "2020-04-03T22:02:50Z"}
        ])
    }, []) // TODO: can add search to the trigger variables and do a fetch with MYSQL Query for search

    // TODO: Should probably actually do filtering with SQL...
    const reposToDisplay = repos
                            .filter(repo => repo.name.toLowerCase().includes(search.toLowerCase()))
                            .map(repo => <RepoCard key={repo.id} name={repo.name} description={repo.description} />)

    return (
        <div>
            <input 
                type="text"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
            />

        {reposToDisplay}
        </div>
    )
}