var Page = require('../Base/Base');
var landing = require('../Pages/landingPage');
var data = require('../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var webdriver = require('selenium-webdriver');
var logger = require('../Base/logger');
var dumpError = require('../Base/dumpError');

Page.prototype.login = async function() {
    try{
        await logger.verbose('Executing login function');
        await this.userNameText(data.validUserName);
        await this.passwordText(data.validPassword);
        await this.loginBtn();
        } catch (e) {
            await logger.error('Error occured in login function on eventSearch module')
            throw Error(e.stack);
    }
}

Page.prototype.eventSearch = async function() {
    try{
        await logger.verbose('Navigating to current events search page')
        var searchMenuEl = await this.findByJs('[text=Search]', 'elId');
        await searchMenuEl.click();
        var eventSearchEl = await this.findByJs('[text=Event Search]', 'elId');
        await eventSearchEl.click();
        await this.findByJs('#eventManagementSearch', 'bodyElement');
        await this.setComboListValue('#eventManagementSearchMachineClientIdId','setValue', data.contactClientNum);
        var currEventSearchRadioEl = await this.findByJs('#eventManagementSearchCurrentEventLookupTypeId','bodyElement');
        await currEventSearchRadioEl.click();
        var searcEventBtn = await this.findByJs('#eventManagementSearchSearchButton','elId');
        await searcEventBtn.click();
        await this.findByJs('#eventSearchGrid', 'bodyElement');
        } catch (e) {
            await logger.error('Error occured in eventSearch function on evenSearch module');
            throw Error(e.stack);
    }
}

Page.prototype.eventStatus = async function() {
    try{
        await logger.verbose('Validating if all the event status are OPEN')
        var rowCount = await this.findGridItems('#eventSearchGrid', 'rowCount');
        await logger.info('Number of events loaded on the page -> ' +rowCount);
            for (var i = 0; i<rowCount; i++)
                {   
                    var customQuery = 'return Ext.ComponentQuery.query("#eventSearchGrid")[0].getItemAt('+ i +').getRecord().getEventStatus();';
                    var firstNameInGrid = await this.findGridItems('#contactsGrid', 'executeCustomQuery', customQuery);
                    if (!(firstNameInGrid == 'OPEN')) return 'False';
                }
            return 'True';

        } catch (e) {
            await logger.error('Error occured in eventStatus function in eventSearch module');
            throw Error(e.stack);
        }
    }




module.exports = Page;


