const core = require('@actions/core');
const axios = require('axios');

var server;
var username;
var password;

try {
    server = core.getInput('server');
    username = core.getInput('username');
    password = core.getInput('password');
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
    data: JSON.stringify({
        "short_description":"Uma nova versao (1.2.0.25) das aplicacoes:\nB2B.Preco.Host.WebApi;B2B.Preco.Host.Console\nEsta disponivel para release",
        "assignment_group":"f0707de1db206780e1b032ffaa9619ed",
        "cmdb_ci":"a7baff87dbf7334830404410ba961924",
        "backout_plan":"Criar nova release de rollback",
        "description":"Uma nova versao (1.2.0.25) das aplicacoes:\nB2B.Preco.Host.WebApi;B2B.Preco.Host.Console\nEsta disponivel para release",
        "u_change_trigger":"project",
        "type":"continual",
        "x_xlbv_xl_release_identifier":"Applications/Folder9fbbec040721402eaf0acc000e0eae5b/Releasea88076a891b9450cae93fe89d2a38814",
        "x_xlbv_xl_release_state":"IN_PROGRESS",
        "u_classification":"7cc8727adb88e34070039d40ba9619a7",
        "test_plan":"Testes automatizados + aprovacao do time de QA",
        "change_plan":"Comunicar time B2B - Preço",
        "justification":"Time<span class=\"xl-ws\"> </span>B2B - Preço<span class=\"xl-ws\"> </span>tem uma nova versao para release",
        "assigned_to":"xl.integration",
        "start_date":"2019-10-20 23:22:25"
    })
}).then(function (response) {
    //console.log(JSON.stringify(response.data));
    var chgNumber = response.data.result.number;
    var sysId = response.data.result.sys_id;

    console.log(`Mudança criada com sucesso: ${chgNumber}`);
    console.log(`Link para mudança: ${server}/nav_to.do?uri=change_request.do?sys_id=${sysId}`);

    core.setOutput("chg-number", chgNumber);
    core.setOutput("sys_id", sysId);
    core.exportVariable('CHG_SYS_ID', sysId);

}).catch(function (error) {
    //console.log(error);
    core.setFailed(error);
});
