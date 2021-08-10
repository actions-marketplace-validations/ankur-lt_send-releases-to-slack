// Require module:

var MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

slack.alert({
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "LNS v1.0.29"
      }
    },
    {
      "type": "section",
      "text": {
        "text": "*<https://github.com/LambdaTest/notification-service/compare/v1.0.28...v1.0.29|Changelog>*",
        "type": "mrkdwn"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "```\n- <https://github.com/LambdaTest/notification-service/commit/e5a98d01a7d228659cbe3d4e860a1468c04d684a|Added configurable changelog format but random eords fd fd fd f df d>\n- lol1\n```"
      }
    }
  ]
})

slack.onError = function (err) {
  console.log('API error:', err);
};
