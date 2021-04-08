const core = require('@actions/core');
const axios = require('axios');

try {
    // `who-to-greet` input defined in action metadata file
    const instanceUrl = core.getInput('instance-url');
    //console.log(`Instance Url is ${instanceUrl}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    //const payload = JSON.stringify(github.context.payload, undefined, 2)
    //console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}

// teste Danilo

var config = {
    method: 'post',
    url: 'https://dev82459.service-now.com/api/sn_chg_rest/change',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46ajZMdXNxbFUzVUNF',
        'Content-Type': 'application/json'
    },
    data: JSON.stringify({
        "description": "Deploy api-marketing B2B"
    })
};

axios(config)
    .then(function (response) {
        //console.log(JSON.stringify(response.data));
        console.log(`Mudança criada no ServiceNow: ${response.data.result.number.value}`);
    })
    .catch(function (error) {
        console.log(error);
    });

