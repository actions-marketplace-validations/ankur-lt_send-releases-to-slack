const core = require('@actions/core');
const SLACK_WEBHOOK_URL = core.getInput('webhook_url');
const slack = require('slack-notify')(SLACK_WEBHOOK_URL);
const _ = require('lodash');

try {
  // `body` input defined in action metadata file
  let body = core.getInput('body');
  let repoName = core.getInput('repo_name');
  let revertedRelease = core.getInput('reverted_release');

  console.log('Changelog Body received::', body);

  if (typeof body === 'string') {
    console.log('Parsing the stringified body to JSON');
    body = JSON.parse(body);
  }

  if (_.isEmpty(body) && !Array.isArray(body)) {
    console.log('Changelog is empty or not in required format!');
    core.setFailed('Changelog is empty or not in required format!');
  }

  // Get first release of the body for normal release, else the last one for reverted release
  if (revertedRelease === 'true' || revertedRelease === true) {
    body = body[body.length - 1];
    console.log('Getting the last release as revertedRelease::', revertedRelease);
  } else {
    body = body[0];
    console.log('Getting the first release as revertedRelease::', revertedRelease);
  }

  console.log('Current release changelog parsed as::', JSON.stringify(body));

  // initialise skeleton of slack message body
  let slackMessageBody = {
    'blocks': [
      {
        'type': 'header',
        'text': {
          'type': 'plain_text',
          'text': '',
        },
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '',
        },
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '',
        },
      },
    ],
  };

  let slackChangelog = '```\n';

  // Assign header for message
  _.set(slackMessageBody, 'blocks[0].text.text',
      `${repoName} ${_.get(body, 'title')}`);

  // Assign changelog title
  let changelogTitle = 'Changelog';

  if (body.href) {
    changelogTitle = `*<${body.href}|Changelog>*`;
  }

  _.set(slackMessageBody, 'blocks[1].text.text', changelogTitle);

  // Generate changelog from commits
  _.isArray(body.commits) && _.forEach(body.commits, (log) => {
    slackChangelog += `- <${log.href}|${_.get(log, 'subject')}>\n`;
  });

  // Generate changelog from merges
  _.isArray(body.merges) && _.forEach(body.merges, (log) => {
    slackChangelog += `- <${log.href}|${_.get(log, 'message')}>\n`;
  });

  // Generate changelog from fixes
  _.isArray(body.fixes) && _.forEach(body.fixes, (log) => {
    slackChangelog += `- <${log.href}|${_.get(log, 'subject') ||
    _.get(log, 'message')}>\n`;
  });

  // Add closing code snippets to the body
  slackChangelog += '```';

  // Assign generated changelog to the body
  _.set(slackMessageBody, 'blocks[2].text.text', slackChangelog);

  // Send slack alert
  // Channel has been configured in the respective slack app
  console.log('Sending slack message as::', JSON.stringify(slackMessageBody));
  slack.alert(slackMessageBody);

  slack.onError = function(err) {
    console.log('API error:', err);
    core.setFailed(err);
  };
} catch (error) {
  core.setFailed(error.message);
}
