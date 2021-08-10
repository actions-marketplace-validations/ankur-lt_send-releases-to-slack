 ```yaml
name: Changelog

on:
  release:
    types:
      - created
jobs:
  # sample comment
  generate-changelog:
    runs-on: ubuntu-latest
    steps:
      - name: Initial setup
        uses: actions/checkout@v2

      - name: Get latest tagname
        uses: ankur-lt/send-releases-to-slack@v1.0.1
        with:
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          body: 'body'

```
