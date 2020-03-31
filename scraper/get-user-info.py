import requests
from requests.auth import HTTPDigestAuth
import traceback
import json
from key import *
from api.githubapi import GitHubAPI
import time

USER = "zahin-mohammad"
TOKEN = GITHUB_PERSONAL_ACCESS_TOKEN


GITHUB_BASE_URL = "https://api.github.com"
GET_USER = "/users/%s"
GET_REPOS = "/users/%s/repos"
GET_REPO = "/repos/%s"
GET_FOLLOWING = "/users/%s/following"

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
    # print(json.dumps(response.json(), indent=2))
    try:
        repos = [repo["full_name"] for repo in response.json()]
        userToRepos[user] = repos
    except:
        print(URL)
##########################################################################################################
# Get tier 2 user data (the people followed by users in users.txt)

for user, following in userToFollowing.items():
    # Get the repos for the people we are following
    for user in following:
        if user in userToRepos:
            continue
        URL = GITHUB_BASE_URL + (GET_REPOS % (user))
        response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
        # print(json.dumps(response.json(), indent=2))
        try:
            repos = [repo["full_name"] for repo in response.json()]
            userToRepos[user] = repos
        except:
            print(URL)


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
# Get Info needed for Repository Entity

repoInfo = {}


def getRepoInfo(repo):
    URL = GITHUB_BASE_URL + (GET_REPO % (repo))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))

    repoInfo[user] = {}
    try:
        repoInfo[user]["id"] = response.json()["id"]
        repoInfo[user]["name"] = repo
        repoInfo[user]["description"] = response.json()["description"]
        repoInfo[user]["created_at"] = response.json()["created_at"]
        repoInfo[user]["updated_at"] = response.json()["updated_at"]
    except:
        print(json.dumps(response.json(), indent=2))


for user, repos in userToRepos.items():
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


createJSONFiles()


# print (json.dumps(userToRepos, indent=2))
# print (json.dumps(userToFollowing, indent=2))
# print(json.dumps(userInfo, indent=2))
