var Page = require('../../Base/Base');
var data = require('../../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var _ = require('../../node_modules/underscore');
var webdriver = require('selenium-webdriver');
var attractLoopVersion = faker.random.number(100);
const logger = require('../../Base/logger');



Page.prototype.verifyAttractLoopPresence = async function() {
    try{
        await logger.verbose('Verifying attract loop presence on the list')
        await this.findByJs('#attractLoopGrid', 'elId');
        var rowCount = await this.findGridItems('#attractLoopGrid','rowCount');
        await logger.info('Row Count of attractLoop version page -> '+rowCount);
        newattractLoopRowElClientId = await _.range(rowCount).map(function(i){
                var x = 'return Ext.ComponentQuery.query("#attractLoopGrid")[0].getStore().getData().getAt('+ i +').data.clientId;';
                return x;
            });
        for (const x in newattractLoopRowElClientId)
                {
                    var clientIdVal = await this.driver.executeScript(newattractLoopRowElClientId[x]);
                    if (clientIdVal == data.contactClientNum) 
                        {
                            var attractLoopVer = await this.driver.executeScript('return Ext.ComponentQuery.query("#attractLoopGrid")[0].getStore().getData().getAt('+ x +').data.description;');
                            if (attractLoopVer == '1.0 Lexar Attract Loop') return "True";                 //use expected kdi version
                        }
                }
        return "False";
        } catch (e) {
            await logger.Error('Error occred on verifyAttractLoopPresence on attractLoopPage module');
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
            await logger.error('Error occured in login function on attractLoopPage module');
            throw Error(e.stack);
    }
}

Page.prototype.attractLoopPageLoads = async function() {
    try{
        await logger.verbose('Navigate to attractLoop page');
        var maintenanceMenuEl = await this.findByJs('[text=Maintenance ]','elId');
        await maintenanceMenuEl.click();
        var maintenanceMenuKdiEl = await this.findByJs('[text=Attract Loop]','elId');
        await maintenanceMenuKdiEl.click();
        await this.findByJs('#attractLoopGrid', 'elId');
        } catch (e) {
            await logger.error('Error occured on attractLoopPageLoads on attractLoop module');
            throw Error(e.stack);
    }
}



Page.prototype.addNewattractLoop = async function(method) {
        try{
            await logger.verbose('Adding a new attract loop version');
            var addKdiIconEl = await this.findToolByCls('tool', 'elId', '2');
            await addKdiIconEl.click();
            await this.setComboListValue('#addAttractLoopClientDropdown', 'setValue', data.contactClientNum);
            await this.setComboListValue('[name=status]', 'setValue', 'ACTIVE');
            await this.setComboListValue('#attractLoopVersionTextfield', 'setValue', attractLoopVersion);
            await this.setComboListValue('[name=description]', 'setValue', attractLoopVersion);
            var addVersionBtn = await this.findByJs('#addButton','elId');
            await addVersionBtn.click();
            await this.findByJs('#attractLoopGrid', 'elId');
            await logger.info('New attract loop version being added -> '+attractLoopVersion);

            } catch (e) {
                await logger.error('Error occured on addNewattractLoop on attractLoop module');
                throw Error(e.stack);
            }
        }


        




module.exports = Page;