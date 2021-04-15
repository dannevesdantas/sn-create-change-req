const core = require('@actions/core');
const axios = require('axios');

var server;
var username;
var password;
var fields = [];
var additionalFields;

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
        additionalFields = core.getInput('additional_fields');
    }
} catch (error) {
    core.setFailed(error.message);
}

console.log('Criando mudança no ServiceNow.');

axios({
    method: 'post',
    url: `${server}/api/now/table/change_request?sysparm_display_value=True&sysparm_input_display_value=True`,
    auth: {
        username: username,
        password: password
    },
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(fields)
}).then(function (response) {
    //console.log(JSON.stringify(response.data));
    var number = response.data.result.number;
    var sysId = response.data.result.sys_id;

    console.log(`Mudança criada com sucesso: ${number}`);
    console.log(`Link para mudança: ${server}/nav_to.do?uri=change_request.do?sys_id=${sysId}`);

    core.setOutput("data", JSON.stringify(response.data.result));
    core.setOutput("sys_id", sysId);
    core.setOutput("number", number);

}).catch(function (error) {
    //console.log(error);
    core.setFailed(error);
});
