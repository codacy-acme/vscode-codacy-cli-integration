# codacy-cli-integration

An extension to see Codacy results on VSCode


## Requirements

Codacy CLI tool depends on Docker

## Run the plugin

Open Command Palette and type "Run Codacy CLI"

## Extension Settings

Settings are configured on ".vscode/settings.json" under "codacy-cli".

Codacy CLI extension can be configured to both work with Project token or API Token

API token example:

    "codacy-cli": {
        "api-token":"##########",
        "provider":"gh|ge|gl",
        "username":"USERNAME"
        "project":"PROJ"
    }

Project token example

    "codacy-cli": {
        "project-token": "#########",
    }

### Tool
Codacy cli can use all tool availables for the repository or you can specify one using the key "tool"

    "codacy-cli": {
        "tool": "eslint"    
    }

### On-prem usage
In order to use it for servers on-prem, you'll need to use the key "codacy-api-base-url"

    "codacy-cli": {
        "codacy-api-base-url": "https://my-onprem.codacy.instance",
    }

**Enjoy!**
