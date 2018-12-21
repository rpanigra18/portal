var Page = require('../Base/Base');
var landing = require('../Pages/landingPage');
var data = require('../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var webdriver = require('selenium-webdriver');
var dumpError = require('../Base/dumpError');
var logger = require('../Base/logger');

Page.prototype.login = async function() {
    try{
        await logger.verbose('Logging in with valid username/password')
        await this.userNameText(data.validUserName);
        await this.passwordText(data.validPassword);
        await this.loginBtn();
        } catch (e) {
            await logger.error('Error occured in login function');
            throw Error(e.stack);
    }
}

Page.prototype.sessionSearch = async function() {
    try{
        await logger.verbose('Navigating to session search screen');
        var searchMenuEl = await this.findByJs('[text=Search]', 'elId');
        await searchMenuEl.click();
        var sessionSearchEl = await this.findByJs('[text=Session Search]', 'elId');
        await sessionSearchEl.click();
        await this.findByJs('[xtype=sessionListSearch]', 'bodyElement');
        await this.setComboListValue('#sessionSearchMachineClientId','setValue', data.contactClientNum);
        var searcSessionBtn = await this.findByJs('#sessionListSearchButton','elId');
        await searcSessionBtn.click();
        await this.findByJs('#sessionListGrid', 'bodyElement');
        } catch (e) {
            await logger.error('Error occured on sessionSearch function');
            throw Error(e.stack);
    }
}

Page.prototype.sessionSearchFilterTest = async function() {
    try{
        await logger.verbose('Executing session search per payment type');
        await this.findByJs('#sessionListGrid', 'bodyElement');
        //await this.driver.sleep(1000);
        var rowCount = await this.findGridItems('#sessionListGrid', 'rowCount');
        await logger.info('Total number of events loaded for the client for a week -> ' +rowCount);
        var resetSessionBtn = await this.findByJs('#sessionListResetFormButton','elId')
        await resetSessionBtn.click();
        await this.findByJs('[xtype=sessionListSearch]', 'bodyElement');                //waiting on search panel
        var cashEventCount = await this.sessionSearchPerPaymentType('Cash');
                await logger.info('Number of Cash Events loaded on the page -> ' + cashEventCount);
                var resetSessionBtn = await this.findByJs('#sessionListResetFormButton','elId')
                await resetSessionBtn.click();
                await this.findByJs('[xtype=sessionListSearch]', 'bodyElement');
        var cardEventCount = await this.sessionSearchPerPaymentType('Card');
                await logger.info('Number of Card Events loaded on the page -> ' + cardEventCount);
                var resetSessionBtn = await this.findByJs('#sessionListResetFormButton','elId')
                await resetSessionBtn.click();
                await this.findByJs('[xtype=sessionListSearch]', 'bodyElement');
        var checkEventCount = await this.sessionSearchPerPaymentType('Check');
                await logger.info('Number of Check Events loaded on the page -> ' + checkEventCount);
                var resetSessionBtn = await this.findByJs('#sessionListResetFormButton','elId')
                await resetSessionBtn.click();
                await this.findByJs('[xtype=sessionListSearch]', 'bodyElement');
        var unatmpEventCount = await this.sessionSearchPerPaymentType('Unattempted');
                await logger.info('Number of Unattempted Events loaded on the page -> ' + unatmpEventCount);
        if ((cashEventCount + cardEventCount + checkEventCount + unatmpEventCount) == rowCount) 
            {
                return await 'True';
            }
        else return await 'False'
        } catch (e) {
            await logger.error('Error occured on sessionSearchFilterTest on sessionSearch.js')
            throw Error(e.stack);
        }
    }

Page.prototype.sessionSearchPerPaymentType = async function(method) {
        try{
            await logger.debug('Executing session search for payment method - > '+method);
            await this.setComboListValue('#sessionSearchMachineClientId','setValue', data.contactClientNum);
            await this.setComboListValue('#sessionListPaymentTypeId','setValue', method);
            var searcSessionBtn = await this.findByJs('#sessionListSearchButton','elId');
            await searcSessionBtn.click();
            await this.findByJs('#sessionListGrid', 'bodyElement');
            //var customQuery = 'return Ext.ComponentQuery.query("#sessionListGrid")[0].getStore().getData().length;';
            var dataCount = await this.findGridItems('#sessionListGrid', 'rowCount');
            return await dataCount;
    
            } catch (e) {
                await logger.error('Error occured on sessionSearchPerPaymentType on sessionSearch.js')
                throw Error(e.stack);
            }
        }







module.exports = Page;


