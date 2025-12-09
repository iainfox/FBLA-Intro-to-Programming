import json

with open("./src/scripts/file_paths.json", "r") as f:
    filePaths = json.load(f)

BASE_URL = "https://cdn.jsdelivr.net/gh/iainfox/FBLA-Intro-To-Programming@latest/"

def traverseNode(node, path=[]):
    if isinstance(node, dict):
        if "files" in node and isinstance(node["files"], list):
            for filename in node["files"]:
                urlPath = '/'.join(path + [filename])
                print(BASE_URL + urlPath)
        for key, value in node.items():
            if key != "files":
                traverseNode(value, path + [key])
    elif isinstance(node, list):
        for item in node:
            traverseNode(item, path)

traverseNode(filePaths)