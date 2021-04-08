const core = require('@actions/core');
const axios = require('axios');

var instanceUrl;

try {
    instanceUrl = core.getInput('instance-url');
} catch (error) {
    core.setFailed(error.message);
}

console.log('Criando mudança no ServiceNow.');

axios({
    method: 'post',
    url: `${instanceUrl}/api/sn_chg_rest/change`,
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46ajZMdXNxbFUzVUNF',
        'Content-Type': 'application/json'
    },
    data: JSON.stringify({
        "description": "Deploy api-marketing B2B"
    })
}).then(function (response) {
    //console.log(JSON.stringify(response.data));
    var chgNumber = response.data.result.number.value;
    var sysId = response.data.result.sys_id.value;
    console.log(`Mudança criada com sucesso no ServiceNow: ${chgNumber}`);
    core.setOutput("number", chgNumber);
    core.setOutput("sys_id", sysId);
}).catch(function (error) {
    //console.log(error);
    core.setFailed(error);
});
