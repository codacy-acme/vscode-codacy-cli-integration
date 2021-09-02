# codacy-cli-integration

An extension to see Codacy results on VSCode


## Requirements

Codacy CLI tool depends on Docker

## Install the plugin

Download the vsix from [here](https://github.com/codacy-acme/vscode-codacy-cli-integration/releases)

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

Skip SSL Verification
    "codacy-cli": {
        "ssl-verification": "true",
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

# Development

## Package
    npm install -g vsc
    vsce package