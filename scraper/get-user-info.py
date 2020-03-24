import requests
from requests.auth import HTTPDigestAuth
import traceback
import json
from key import * 
from api.githubapi import GitHubAPI



USER = "zahin-mohammad"
TOKEN = GITHUB_PERSONAL_ACCESS_TOKEN


GITHUB_BASE_URL = "https://api.github.com"
GET_USER =  "/users/%s"
GET_REPOS =  "/users/%s/repos"
GET_FOLLOWING = "/users/%s/following"

#TODO: Make this a set so that we avoid duplicate requests
users = []
with open("./scraper/users.txt") as f:
    users = [line.rstrip() for line in f]

gitHubAPI = GitHubAPI(USER, TOKEN)
print(gitHubAPI.USER)
print(gitHubAPI.rateLimitRemaining)

userToRepos = {}
userToFollowing = {}


for user in users:
    if user in userToFollowing:
        continue
    URL = GITHUB_BASE_URL +  (GET_FOLLOWING % (user))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
    following = [following["login"] for following in response.json()]
    # TODO: We can't do this, takes too long
    userToFollowing[user] = following
    # print(json.dumps(response.json(), indent=2))

    
    URL = GITHUB_BASE_URL +  (GET_REPOS % (user))
    response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
    # print(json.dumps(response.json(), indent=2))
    try:
        repos = [repo["full_name"] for repo in response.json()]
        userToRepos[user] = repos
    except:
        print(URL)

for user, following in userToFollowing.items():
    for user in following:
        if user in userToRepos:
            continue
        URL = GITHUB_BASE_URL +  (GET_REPOS % (user))
        response = gitHubAPI.makeRequest("get", URL, auth=(USER, TOKEN))
        # print(json.dumps(response.json(), indent=2))
        try:
            repos = [repo["full_name"] for repo in response.json()]
            userToRepos[user] = repos
        except:
            print(URL)

with open('userToFollowing.json', 'w') as fp:
    json.dump(userToFollowing, fp)


with open('userToRepos.json', 'w') as fp:
    json.dump(userToRepos, fp)
    

    

# print (json.dumps(userToRepos, indent=2))
# print (json.dumps(userToFollowing, indent=2))

