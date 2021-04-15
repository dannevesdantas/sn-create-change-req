const core = require('@actions/core');
const axios = require('axios');

var instanceUrl;
var username;
var password;

try {
    instanceUrl = core.getInput('instance-url');
    username = core.getInput('username');
    password = core.getInput('password');
} catch (error) {
    core.setFailed(error.message);
}

console.log('Criando mudança no ServiceNow.');

axios({
    method: 'post',
    url: `${instanceUrl}/api/now/table/change_request?sysparm_display_value=True&sysparm_input_display_value=True`,
    auth: {
        username: username,
        password: password
    },
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    data: JSON.stringify({
        "description": "Deploy api-marketing B2B"
    })
}).then(function (response) {
    //console.log(JSON.stringify(response.data));
    var chgNumber = response.data.result.number;
    var sysId = response.data.result.sys_id;

    console.log(`Mudança criada com sucesso: ${chgNumber}`);
    console.log(`Link para mudança: ${instanceUrl}/nav_to.do?uri=change_request.do?sys_id=${sysId}`);

    core.setOutput("chg-number", chgNumber);
    core.setOutput("sys_id", sysId);
    core.exportVariable('CHG_SYS_ID', sysId);

}).catch(function (error) {
    //console.log(error);
    core.setFailed(error);
});
