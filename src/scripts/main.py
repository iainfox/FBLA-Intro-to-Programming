import json
import requests
import os

with open("./file_paths.json", "r") as f:
    filePaths = json.load(f)

BASE_URL = "https://cdn.jsdelivr.net/gh/iainfox/FBLA-Intro-To-Programming@latest/"

def traverseNode(node, path=[]):
    if isinstance(node, dict):
        if "files" in node and isinstance(node["files"], list):
            for filename in node["files"]:
                urlPath = '/'.join(path + [filename])
                print("Downloading: " + BASE_URL + urlPath)
                response = requests.get(BASE_URL + urlPath)
                if response.status_code == 200:
                    file_path = './' + urlPath
                    dir_path = os.path.dirname(file_path)
                    if dir_path and not os.path.exists(dir_path):
                        os.makedirs(dir_path, exist_ok=True)
                    with open(file_path, 'wb') as outFile:
                        outFile.write(response.content)
                else:
                    print(f"Failed to download: {BASE_URL + urlPath} (Status code: {response.status_code})")
                
        for key, value in node.items():
            if key != "files":
                traverseNode(value, path + [key])
    elif isinstance(node, list):
        for item in node:
            traverseNode(item, path)

traverseNode(filePaths)