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

const intervalMinutes = core.getInput('interval');
const intervalMs = intervalMinutes*60000;

console.log('Criando mudança no ServiceNow.');

axios({
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
}).then(function (response) {
    //console.log(JSON.stringify(response.data));
    console.log(`Mudança criada no ServiceNow: ${response.data.result.number.value}`);
    console.log('Aguardando aprovação.');
    var sysId = response.data.result.sys_id.value;
    setTimeout(function () { verificarAprovacaoChange(sysId); }, intervalMs);
}).catch(function (error) {
    //console.log(error);
    core.setFailed(error);
});

function verificarAprovacaoChange(sysId) {
    console.log('Verificando se a change já foi aprovada...');
    axios({
        method: 'get',
        url: `https://dev82459.service-now.com/api/sn_chg_rest/change/${sysId}`,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic YWRtaW46ajZMdXNxbFUzVUNF'
        }
    }).then(function (response) {
        //console.log(JSON.stringify(response.data));
        console.log(`Mudança está no status: ${response.data.result.state.value}`);
        var chgCurrentStatus = response.data.result.state.value;
        const approvedStatusValue = -2.0;
        if (chgCurrentStatus < approvedStatusValue) {
            console.log('Mudança ainda não foi aprovada. Verificando novamente em alguns minutos.');
            setTimeout(function () { verificarAprovacaoChange(sysId); }, intervalMs);
        } else {
            console.log('Mudança aprovada no ServiceNow!');
        }
    }).catch(function (error) {
        setTimeout(function () { verificarAprovacaoChange(sysId); }, intervalMs);
    });
}
