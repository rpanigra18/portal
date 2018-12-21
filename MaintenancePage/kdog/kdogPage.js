var Page = require('../../Base/Base');
var data = require('../../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var _ = require('../../node_modules/underscore');
var webdriver = require('selenium-webdriver');
var kDogVersion = faker.random.number(100);
var logger = require('../../Base/logger');



Page.prototype.verifyKDogPresence = async function() {
    try{
        await logger.verbose('Verifying KDOG presence on the list');
        await this.findByJs('#kDogVersionGrid', 'elId');
        var rowCount = await this.findGridItems('#kDogVersionGrid','rowCount');
        await logger.info('Row Count of KDog version page -> '+rowCount);
        newKDogRowElClientId = await _.range(rowCount).map(function(i){
                var x = 'return Ext.ComponentQuery.query("#kDogVersionGrid")[0].getStore().getData().getAt('+ i +').data.clientId;';
                return x;
            });
        for (const x in newKDogRowElClientId)
                {
                    var clientIdVal = await this.driver.executeScript(newKDogRowElClientId[x]);
                    if (clientIdVal == data.contactClientNum) 
                        {
                            var kDogVer = await this.driver.executeScript('return Ext.ComponentQuery.query("#kDogVersionGrid")[0].getStore().getData().getAt('+ x +').data.description;');
                            if (kDogVer == 1.64) return "True";                 //use expected kdi version
                        }
                }
        return "False";
        } catch (e) {
            await logger.Error('Error occred on verifyKDogPresence on kdogPage module');
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
            await logger.error('Error occured in login function on kdogPage module');
            throw Error(e.stack);
    }
}

Page.prototype.kDogPageLoads = async function() {
    try{
        await logger.verbose('Navigate to kDog page');
        var maintenanceMenuEl = await this.findByJs('[text=Maintenance ]','elId');
        await maintenanceMenuEl.click();
        var maintenanceMenuKdiEl = await this.findByJs('[text=Kdog]','elId');
        await maintenanceMenuKdiEl.click();
        await this.findByJs('#kDogVersionGrid', 'elId');
        } catch (e) {
            await logger.error('Error occured on kDogPageLoads on kdogPage module');
            throw Error(e.stack);
    }
}



Page.prototype.addNewKDog = async function(method) {
        try{
            await logger.verbose('Adding a new kDog version');
            var addKdiIconEl = await this.findToolByCls('tool', 'elId', '2');
            await addKdiIconEl.click();
            await this.setComboListValue('#kdogClientId', 'setValue', data.contactClientNum);
            await this.setComboListValue('[name=status]', 'setValue', 'ACTIVE');
            await this.setComboListValue('#kdogVersionTextfield', 'setValue', kDogVersion);
            await this.setComboListValue('[name=description]', 'setValue', kDogVersion);
            var addVersionBtn = await this.findByJs('#addButton','elId');
            await addVersionBtn.click();
            await this.findByJs('#kDogVersionGrid', 'elId');
            await logger.info('New kDog version being added -> '+kDogVersion);

            } catch (e) {
                await logger.error('Error occured in addNewKDog function in kdogPage module');
                throw Error(e.stack);
            }
        }


        




module.exports = Page;