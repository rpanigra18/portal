var Page = require('../../Base/Base');
var data = require('../../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var _ = require('../../node_modules/underscore');
var webdriver = require('selenium-webdriver');
var kdiVersion = faker.random.number(100);
var logger = require('../../Base/logger');


Page.prototype.verifyKdiPresence = async function() {
    try{
        await logger.verbose('Verifying Kdi presence on the list');
        await this.findByJs('#kdiVersionGrid', 'elId');
        var rowCount = await this.findGridItems('#kdiVersionGrid','rowCount');
        await logger.info('Row Count of KDI version page -> '+rowCount);
        newKdiRowElClientId = await _.range(rowCount).map(function(i){
                var x = 'return Ext.ComponentQuery.query("#kdiVersionGrid")[0].getStore().getData().getAt('+ i +').data.clientId;';
                return x;
            });
        for (const x in newKdiRowElClientId)
                {
                    var clientIdVal = await this.driver.executeScript(newKdiRowElClientId[x]);
                    if (clientIdVal == data.contactClientNum) 
                        {
                            var kdiVer = await this.driver.executeScript('return Ext.ComponentQuery.query("#kdiVersionGrid")[0].getStore().getData().getAt('+ x +').data.description;');
                            if (kdiVer == 1.64) return "True";                 //use expected kdi version
                        }
                }
        return "False";
        } catch (e) {
            await logger.Error('Error occred on verifyKdiPresence on kdiPage module');
            throw Error(e.stack);
        }
    
}


Page.prototype.login = async function() {
    try{
        await logger.verbose('Executing login function');
        await this.userNameText(data.validUserName);
        await this.passwordText(data.validPassword);
        await this.loginBtn();
        } catch (e) {
            await logger.error('Error occured in login function on kdiPage module');
            throw Error(e.stack);
    }
}

Page.prototype.kdiPageLoads = async function() {
    try{
        await logger.verbose('Navigate to kdi page');
        var maintenanceMenuEl = await this.findByJs('[text=Maintenance ]','elId');
        await maintenanceMenuEl.click();
        var maintenanceMenuKdiEl = await this.findByJs('[text=Kdi]','elId');
        await maintenanceMenuKdiEl.click();
        await this.findByJs('#kdiVersionGrid', 'elId');
        } catch (e) {
            await logger.error('Error occured on kdiPageLoads on kdiPage module');
            throw Error(e.stack);
    }
}



Page.prototype.addNewKdi = async function(method) {
        try{
            await logger.verbose('Adding a new kdi version');
            var addKdiIconEl = await this.findToolByCls('tool', 'elId', '2');
            await addKdiIconEl.click();
            await this.setComboListValue('#kdiClientId', 'setValue', data.contactClientNum);
            await this.setComboListValue('[name=status]', 'setValue', 'ACTIVE');
            await this.setComboListValue('#kdiVersionTextfield', 'setValue', kdiVersion);
            await this.setComboListValue('[name=description]', 'setValue', kdiVersion);
            var addVersionBtn = await this.findByJs('#addButton','elId');
            await addVersionBtn.click();
            await this.findByJs('#kdiVersionGrid', 'elId');
            await logger.info('New kdi version being added -> '+kdiVersion);

            } catch (e) {
                await logger.error('Error occured in addNewKdi function in kdiPage module');
                throw Error(e.stack);
            }
        }


        




module.exports = Page;