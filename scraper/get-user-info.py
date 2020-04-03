import requests
from requests.auth import HTTPDigestAuth
import traceback
import json
from key import *
from api.githubapi import GitHubAPI
import time
import traceback


TOKEN = GITHUB_PERSONAL_ACCESS_TOKEN

REACTION_HEADER = {
    'Accept': 'application/vnd.github.squirrel-girl-preview+json'}
GITHUB_BASE_URL = "https://api.github.com"
GET_USER = "/users/%s"
GET_REPOS = "/users/%s/repos"
GET_REPO = "/repos/%s"
GET_ISSUES = "/repos/%s/issues"
GET_COMMENTS = "/repos/%s/issues/%s/comments"  # rep, issue number
GET_FOLLOWING = "/users/%s/following"
GET_ISSUE_COMMENT_REACTION = "/repos/%s/issues/comments/%s/reactions"  # repo, comment ID
GET_ISSUE_REACTION = "/repos/%s/issues/%s/reactions"  # repo, issue number
GET_CONTRIBUTORS = "/repos/%s/contributors"  # repo

# TODO: Make this a set so that we avoid duplicate requests
users = []
with open("./scraper/users.txt") as f:
    users = [line.rstrip() for line in f]

gitHubAPI = GitHubAPI(USER, TOKEN)
print(gitHubAPI.USER)
print(gitHubAPI.rateLimitRemaining)

userToRepos = {}
userToFollowing = {}

##########################################################################################################
# Get tier 1 user data (users.txt)

for user in users:
    if user in userToFollowing:
        continue
    # Get all the people this person follows
    URL = GITHUB_BASE_URL + (GET_FOLLOWING % (user))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
    following = [following["login"] for following in response.json()]
    userToFollowing[user] = following

    # Get all the repos of this user
    URL = GITHUB_BASE_URL + (GET_REPOS % (user))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
    try:
        repos = [repo["full_name"] for repo in response.json()]
        userToRepos[user] = repos
    except:
        print(URL)
        traceback.print_exc()
##########################################################################################################
# Get tier 2 user data (the people followed by users in users.txt)

for user, following in userToFollowing.items():
    # Get the repos for the people we are following
    for user in following:
        if user in userToRepos:
            continue
        URL = GITHUB_BASE_URL + (GET_REPOS % (user))
        response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
        try:
            repos = [repo["full_name"] for repo in response.json()]
            userToRepos[user] = repos
        except:
            print(URL)
            traceback.print_exc()


##########################################################################################################
# Get Info needed for User Entity
userInfo = {}


def getUserInfo(user):
    URL = GITHUB_BASE_URL + (GET_USER % (user))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
    userInfo[user] = {}
    userInfo[user]["username"] = user
    userInfo[user]["name"] = response.json()["name"]
    userInfo[user]["avatar_url"] = response.json()["avatar_url"]
    userInfo[user]["email"] = response.json()["email"]
    userInfo[user]["last_login_time"] = int(time.time())


for user, following in userToFollowing.items():
    if user in userInfo:
        continue
    getUserInfo(user)

    for followingUser in following:
        if followingUser in userInfo:
            continue
        getUserInfo(followingUser)

##########################################################################################################
# Add repo's for thing's you've contributed to
tempMap = {}
contributorToRepo = {}
for repos in userToRepos.values():
    for repo in repos:
        if repo in tempMap:
            continue
        URL = GITHUB_BASE_URL + (GET_CONTRIBUTORS % (repo))
        response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))

        try:
            if response.status_code == 200:

                for contributor in response.json():
                    # try:
                    # if "login" not in contributor:
                    #     print(response.json())
                    #     break
                    contributorUsername = contributor["login"]
                    if contributorUsername not in userToRepos:
                        continue
                    if contributorUsername not in contributorToRepo:
                        contributorToRepo[contributorUsername] = []
                    contributorToRepo[contributorUsername].append(repo)
                    # except:
                    #     print(json.dumps(contributor, indent=2))
                    #     traceback.print_exc()

        except:
            print(response)
            print(json.dumps(response.json(), indent=2))
            traceback.print_exc()

for contributor, repos in contributorToRepo.items():
    userToRepos[contributor].extend(repos)


##########################################################################################################
# Get Info needed for Repository Entity

repoInfo = {}
issueInfo = {}
commentInfo = {}
reactionInfo = []


def getIssueReaction(repo, issueNumber, issueID):
    URL = GITHUB_BASE_URL + (GET_ISSUE_REACTION % (repo, issueNumber))
    response = gitHubAPI.makeRequest(
        "get", URL, headers=REACTION_HEADER, auth=(USER, TOKEN))
    try:
        for reaction in response.json():

            reactionInfo.append({
                "post_id": issueID,
                "username": reaction["user"]["login"],
                "emoji": reaction["content"],
                "created_at": reaction["created_at"]
            })
    except:
        print(json.dumps(response.json(), indent=2))
        traceback.print_exc()


def getIssueCommentReaction(repo, commentID):
    URL = GITHUB_BASE_URL + (GET_ISSUE_COMMENT_REACTION % (repo, commentID))
    response = gitHubAPI.makeRequest(
        "get", URL, headers=REACTION_HEADER, auth=(USER, TOKEN))
    try:
        for reaction in response.json():

            reactionInfo.append({
                "post_id": commentID,
                "username": reaction["user"]["login"],
                "emoji": reaction["content"],
                "created_at": reaction["created_at"]
            })
    except:
        print(json.dumps(response.json(), indent=2))
        traceback.print_exc()


def getIssueComments(issueID, issueNumber, repo):
    URL = GITHUB_BASE_URL + (GET_COMMENTS % (repo, issueNumber))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
    try:
        for comment in response.json():
            id = comment["id"]
            commentInfo[id] = {}

            commentInfo[id]["id"] = id
            commentInfo[id]["post_id"] = issueID
            commentInfo[id]["username"] = comment["user"]["login"]
            commentInfo[id]["body"] = comment["body"]
            commentInfo[id]["created_at"] = comment["created_at"]
            commentInfo[id]["updated_at"] = comment["updated_at"]
            getIssueCommentReaction(repo, id)

    except:
        print(json.dumps(response.json(), indent=2))
        traceback.print_exc()


def getIssues(repo):
    URL = GITHUB_BASE_URL + (GET_ISSUES % (repo))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))

    try:
        for issue in response.json():
            id = issue["id"]
            issueInfo[id] = {}
            issueInfo[id]["id"] = issue["id"]
            issueInfo[id]["title"] = issue["title"]
            issueInfo[id]["username"] = issue["user"]["login"]
            getUserInfo(issue["user"]["login"])
            issueNumber = issue["number"]

            # Adding the issue body as a first comment
            commentInfo[id] = {}
            commentInfo[id]["id"] = id
            commentInfo[id]["post_id"] = id
            commentInfo[id]["username"] = issue["user"]["login"]
            commentInfo[id]["body"] = issue["body"]
            commentInfo[id]["created_at"] = issue["created_at"]
            commentInfo[id]["updated_at"] = issue["updated_at"]
            getIssueReaction(repo, issueNumber, id)

            if issue["comments"] > 0:
                getIssueComments(id, issueNumber, repo)
    except:
        print(json.dumps(response.json(), indent=2))
        traceback.print_exc()


def getRepoInfo(repo):
    URL = GITHUB_BASE_URL + (GET_REPO % (repo))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))

    repoInfo[repo] = {}
    try:
        repoInfo[repo]["id"] = response.json()["id"]
        repoInfo[repo]["name"] = repo
        repoInfo[repo]["description"] = response.json()["description"]
        repoInfo[repo]["created_at"] = response.json()["created_at"]
        repoInfo[repo]["updated_at"] = response.json()["updated_at"]
        if response.json()["has_issues"]:
            getIssues(repo)
    except:
        print(json.dumps(response.json(), indent=2))
        traceback.print_exc()


# remove dupes
for user in userToRepos.keys():
    userToRepos[user] = list(set(userToRepos[user]))

for repos in userToRepos.values():
    for repo in repos:
        getRepoInfo(repo)


def createJSONFiles():
    with open('userToFollowing.json', 'w') as fp:
        json.dump(userToFollowing, fp)

    with open('userToRepos.json', 'w') as fp:
        json.dump(userToRepos, fp)

    with open('userInfo.json', 'w') as fp:
        json.dump(userInfo, fp)

    with open('repoInfo.json', 'w') as fp:
        json.dump(repoInfo, fp)

    with open('issueInfo.json', 'w') as fp:
        json.dump(issueInfo, fp)

    with open('commentInfo.json', 'w') as fp:
        json.dump(commentInfo, fp)

    with open('reactionInfo.json', 'w') as fp:
        json.dump(reactionInfo, fp)


def createCSVFiles():
    print(len(userInfo))
    with open('userInfo.csv', 'w') as fp:
        fp.write("username,name,avatar_url,email,last_login_time")
        for user in userInfo.values():
            fp.write("%s,%s,%s,%s,%s\n" % (user["username"], user["name"], user["avatar_url"],
                                           user["email"], user["last_login_time"]))

    print(len(repoInfo))
    with open('repoInfo.csv', 'w') as fp:
        fp.write("id,name,description,created_at,updated_at")
        for repo in repoInfo.values():
            try:
                fp.write("%s,%s,%s,%s,%s\n" % (repo["id"], repo["name"], repo["description"],
                                               repo["created_at"], repo["updated_at"]))
            except:
                print(json.dumps(repo, indent=2))
                traceback.print_exc()

    print(len(issueInfo))
    with open('issueInfo.csv', 'w') as fp:
        fp.write("id,title,username")
        for issue in issueInfo.values():
            fp.write("%s,%s,%s\n" %
                     (issue["id"], issue["title"], issue["username"]))

    print(len(commentInfo))
    with open('commentInfo.csv', 'w') as fp:
        fp.write("id,post_id,username,body,created_at,updated_at")
        for comment in commentInfo.values():
            fp.write("%s,%s,%s,%s,%s,%s" % (
                comment["id"], comment["post_id"], comment["username"], comment["body"], comment["created_at"], comment["updated_at"]))

    print(len(reactionInfo))
    with open('reactionInfo.csv', 'w') as fp:
        fp.write("post_id,username,emoji,created_at")

        for reaction in reactionInfo:
            fp.write("%s,%s,%s,%s" % (
                reaction["post_id"], reaction["username"], reaction["emoji"], reaction["created_at"]))

    print(len(userToFollowing))
    with open('userToFollowing.csv', 'w') as fp:
        fp.write("follower,followee")

        for follower, followingList in userToFollowing.items():
            for followee in followingList:
                fp.write("%s,%s" % (follower, followee))

    print(len(userToRepos))
    with open('userToRepos.csv', 'w') as fp:
        fp.write("user,repo")

        for user, repoList in userToRepos.items():
            for repo in repoList:
                fp.write("%s,%s" % (user, repo))


createJSONFiles()
createCSVFiles()

# TODO: convert all timestamps to UNIX time
