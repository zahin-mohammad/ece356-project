import requests
from requests.auth import HTTPDigestAuth
import traceback
import json
from key import *
from api.githubapi import GitHubAPI
import time
import datetime
import dateutil.parser
import traceback
import re
import markdown


# import re

# escaped = re.escape(a_string)


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

md = markdown.Markdown()

userToRepos = {}
userToFollowing = {}


def getEpochSecondTime(dateTimeString):
    return int(dateutil.parser.parse(dateTimeString).timestamp())

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
    if "email" not in response.json() or response.json()["email"] is None:
        userInfo[user]["email"] = user+"@example.com"
    else:
        userInfo[user]["email"] = response.json()["email"]

    # output_date = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    # print(output_date)
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
                "comment_id": issueID,
                "username": reaction["user"]["login"],
                "emoji": reaction["content"],
                "created_at": getEpochSecondTime(reaction["created_at"])
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
                "comment_id": commentID,
                "username": reaction["user"]["login"],
                "emoji": reaction["content"],
                "created_at": getEpochSecondTime(reaction["created_at"])
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
            commentInfo[id]["body"] = md.convert(comment["body"])
            commentInfo[id]["created_at"] = getEpochSecondTime(
                comment["created_at"])
            commentInfo[id]["updated_at"] = getEpochSecondTime(
                comment["updated_at"])
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
            issueInfo[id]["repository_name"] = repo
            issueInfo[id]["title"] = issue["title"]
            issueInfo[id]["username"] = issue["user"]["login"]
            getUserInfo(issue["user"]["login"])
            issueNumber = issue["number"]

            # Adding the issue body as a first comment
            commentInfo[id] = {}
            commentInfo[id]["id"] = id
            commentInfo[id]["post_id"] = id
            commentInfo[id]["username"] = issue["user"]["login"]
            commentInfo[id]["body"] = md.convert(issue["body"])
            commentInfo[id]["created_at"] = getEpochSecondTime(
                issue["created_at"])
            commentInfo[id]["updated_at"] = getEpochSecondTime(
                issue["updated_at"])
            getIssueReaction(repo, issueNumber, id)

            if issue["comments"] > 0:
                getIssueComments(id, issueNumber, repo)
    except:
        print(json.dumps(response.json(), indent=2))
        traceback.print_exc()


def getRepoInfo(user, repo):
    URL = GITHUB_BASE_URL + (GET_REPO % (repo))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))

    repoInfo[repo] = {}
    try:
        repoInfo[repo]["id"] = response.json()["id"]
        repoInfo[repo]["name"] = repo
        repoInfo[repo]["username"] = user
        repoInfo[repo]["description"] = response.json()["description"]
        repoInfo[repo]["created_at"] = getEpochSecondTime(
            response.json()["created_at"])
        repoInfo[repo]["updated_at"] = getEpochSecondTime(
            response.json()["updated_at"])
        if response.json()["has_issues"]:
            getIssues(repo)
    except:
        print(json.dumps(response.json(), indent=2))
        traceback.print_exc()


# remove dupes
for user in userToRepos.keys():
    userToRepos[user] = list(set(userToRepos[user]))

for user, repos in userToRepos.items():
    for repo in repos:
        getRepoInfo(user, repo)


def createJSONFiles():
    with open('./data/userToFollowing.json', 'w') as fp:
        json.dump(userToFollowing, fp)

    with open('./data/userToRepos.json', 'w') as fp:
        json.dump(userToRepos, fp)

    with open('./data/userInfo.json', 'w') as fp:
        json.dump(userInfo, fp)

    with open('./data/repoInfo.json', 'w') as fp:
        json.dump(repoInfo, fp)

    with open('./data/issueInfo.json', 'w') as fp:
        json.dump(issueInfo, fp)

    with open('./data/commentInfo.json', 'w') as fp:
        json.dump(commentInfo, fp)

    with open('./data/reactionInfo.json', 'w') as fp:
        json.dump(reactionInfo, fp)


def createCSVFiles():
    with open('./data/userInfo.csv', 'w') as fp:
        fp.write("username;name;avatar_url;email;last_login_time;password\n")
        for user in userInfo.values():
            fp.write("%s;%s;%s;%s;%s;%s\n" % (user["username"], user["name"], user["avatar_url"],
                                              user["email"], user["last_login_time"], "password"))

    with open('./data/repoInfo.csv', 'w') as fp:
        fp.write("id;name;username;description;created_at;updated_at\n")
        for repo in repoInfo.values():
            try:
                if "description" in repo and repo["description"] is not None:
                    description = repo["description"].replace(";", "SEMICOLON")

                    fp.write("%s;%s;%s;%s;%s;%s\n" % (repo["id"], repo["name"], repo["username"], description,
                                                      repo["created_at"], repo["updated_at"]))
                else:
                    fp.write("%s;%s;%s;%s;%s;%s\n" % (repo["id"], repo["name"], repo["username"], "",
                                                      repo["created_at"], repo["updated_at"]))
            except:
                print(json.dumps(repo, indent=2))
                traceback.print_exc()

    with open('./data/issueInfo.csv', 'w') as fp:
        fp.write("id;repository_name;title;username\n")
        for issue in issueInfo.values():
            fp.write("%s;%s;%s;%s\n" %
                     (issue["id"], issue["repository_name"], issue["title"], issue["username"]))

    with open('./data/commentInfo.csv', 'w') as fp:
        fp.write("id;post_id;username;body;created_at;updated_at\n")
        for comment in commentInfo.values():
            if "body" in comment and comment["body"] is not None:
                body = comment["body"].replace(";", "SEMICOLON")

                fp.write("%s;%s;%s;%s;%s;%s\n" % (
                    comment["id"], comment["post_id"], comment["username"], body, comment["created_at"], comment["updated_at"]))
            else:
                fp.write("%s;%s;%s;%s;%s;%s\n" % (
                    comment["id"], comment["post_id"], comment["username"], "", comment["created_at"], comment["updated_at"]))

    with open('./data/reactionInfo.csv', 'w') as fp:
        fp.write("comment_id;username;emoji;created_at\n")

        for reaction in reactionInfo:
            fp.write("%s;%s;%s;%s\n" % (
                reaction["post_id"], reaction["username"], reaction["emoji"], reaction["created_at"]))

    with open('./data/userToFollowing.csv', 'w') as fp:
        fp.write("follower;followee\n")

        for follower, followingList in userToFollowing.items():
            for followee in followingList:
                fp.write("%s;%s\n" % (follower, followee))

    with open('./data/userToRepos.csv', 'w') as fp:
        fp.write("user;repo\n")

        for user, repoList in userToRepos.items():
            for repo in repoList:
                fp.write("%s;%s\n" % (user, repo))


createJSONFiles()
createCSVFiles()
print('\007')


# TODO: convert all timestamps to UNIX time
