# Send Release Changelog to Slack
The Github action supports sending the release changelog to slack. The data supported by the `body` parameter is the JSON changelog output supported by https://www.npmjs.com/package/auto-changelog.


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
        # Send JSON changelog to the slack app
      - name: Send release notes to sack
        uses: ankur-lt/send-releases-to-slack@v1.1.0
        with:
          repo_display_name: 'Service Name'
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          body: ${{ steps.jsonChangelog.outputs.content }}
          reverted_release: false
```
