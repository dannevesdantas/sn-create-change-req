const core = require('@actions/core');
const axios = require('axios');

var server;
var username;
var password;
var fields = {};
var additionalFields = {};

try {
    server = core.getInput('server', { required: true });
    username = core.getInput('username');
    password = core.getInput('password');

    if (core.getInput('short_description')) { fields["short_description"] = core.getInput('short_description', { required: true }); }
    if (core.getInput('description')) { fields["description"] = core.getInput('description'); }
    if (core.getInput('configuration_item')) { fields["configuration_item"] = core.getInput('configuration_item'); }
    if (core.getInput('assignment_group')) { fields["assignment_group"] = core.getInput('assignment_group'); }
    if (core.getInput('assigned_to')) { fields["assigned_to"] = core.getInput('assigned_to'); }
    if (core.getInput('state')) { fields["state"] = core.getInput('state'); }
    if (core.getInput('priority')) { fields["priority"] = core.getInput('priority'); }
    if (core.getInput('comments')) { fields["comments"] = core.getInput('comments'); }

    if (core.getInput('additional_fields')) {
        additionalFields = JSON.parse(core.getInput('additional_fields'));
    }
} catch (error) {
    core.setFailed(error.message);
}

console.log(username);
console.log(password);

var allFields = Object.assign({}, fields, additionalFields);

axios({
    method: 'post',
    url: `${server}/api/now/table/change_request?sysparm_display_value=True&sysparm_input_display_value=True`,
    auth: { username: username, password: password },
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    data: JSON.stringify(allFields)
}).then(function (response) {
    //console.log(JSON.stringify(response.data));

    console.log(`Created '${response.data.result.number}' with sysId '${response.data.result.sys_id}' in Service Now.`);

    console.log(`Sys Id: ${response.data.result.sys_id}`);
    console.log(`Number: ${response.data.result.number}`);
    
    console.log(`${server}/nav_to.do?uri=change_request.do?sys_id=${response.data.result.sys_id}`);

    // Manually wrap output
    core.startGroup('Output properties')
    console.log(JSON.stringify(response.data.result));
    core.endGroup()

    core.setOutput("data", JSON.stringify(response.data.result));
    core.setOutput("sys_id", response.data.result.sys_id);
    core.setOutput("number", response.data.result.number);

    core.exportVariable('CHG_SYS_ID', response.data.result.sys_id);
    core.exportVariable('CHG_NUMBER', response.data.result.number);

}).catch(function (error) {
    //console.log(error);
    core.setFailed(error);
});
