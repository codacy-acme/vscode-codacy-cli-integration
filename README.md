# codacy-cli-integration

An extension to see Codacy results on VSCode


## Requirements

Codacy CLI tool depends on Docker

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

### On-prem usage
In order to use it for servers on-prem, you'll need to use the flag "codacy-api-base-url"

    "codacy-cli": {
        "codacy-api-base-url": "https://my-onprem.codacy.instance",
    }

**Enjoy!**
