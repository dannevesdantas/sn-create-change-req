const core = require('@actions/core');
const axios = require('axios');

try {
    // `who-to-greet` input defined in action metadata file
    const instanceUrl = core.getInput('instance-url');
    console.log('Instance Url is ${instanceUrl}!');
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    //const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log('The event payload: ${payload}');
} catch (error) {
    core.setFailed(error.message);
}