var Page = require('../Base/Base');
var landing = require('../Pages/landingPage');
var data = require('../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
var logger = require('../Base/logger');
var fakeContactName;

Page.prototype.login = async function() {
    try{
        await logger.verbose('Executing login function');
        await this.userNameText(data.validUserName);
        await this.passwordText(data.validPassword);
        await this.loginBtn();
        } catch (e) {
        await logger.error('Error occured in login function on addContact module');
        throw Error(e.stack);
    }
}

Page.prototype.addContact = async function() {
    try{
        await logger.verbose('Navigate to add new contact page');
        var addContactEl = await this.findByJs('[text=Contacts]','elId');
        await addContactEl.click();
        await this.findByJs('#contactsGrid', 'elId');
        addContactEl = await this.findToolByCls('tool', 'elId', '3');
        await addContactEl.click();
        await this.setComboListValue('#contactClientId','setValue', data.contactClientNum);
        fakeContactName = await faker.name.firstName();
        await logger.info('Fake contact to add -> '+fakeContactName);
        await this.setComboListValue('#firstNameField','setValue', fakeContactName);
        await this.setComboListValue('#lastNameField','setValue', await faker.name.lastName());
        await this.setComboListValue('#contactAddressLine1Field','setValue', await faker.address.streetAddress());
        await this.setComboListValue('#cityField','setValue', await faker.address.city());
        await this.setComboListValue('#stateId','setValue', await faker.address.stateAbbr());
        await this.setComboListValue('#zipField','setValue', await faker.address.zipCode("#####"));
        await this.setComboListValue('#emailAddressField','setValue', await faker.internet.email());
        await this.setComboListValue('#phoneNumberField','setValue', '4022221435');
        addContactEl = await this.findByJs('#addButton', 'elId');
        await addContactEl.click();
        await this.findByJs('#contactsGrid', 'elId');
        return fakeContactName;
        } catch (e) {
            await logger.error('Error occured in addContact function on addContact module');
            throw Error(e.stack);
    }
}

Page.prototype.verifyContactPresence = async function() {
    try{
        await logger.verbose('Verifying contact presence on the list');
        await this.findByJs('#contactsGrid', 'elId');
        var gridRowCount = await this.findGridItems('#contactsGrid', 'rowCount');
        await logger.verbose('Contact Grid Size --> ' +gridRowCount);
        var verifyContactPresence = await this.findGridItems('#contactsGrid', 'itemValue', 'firstName', fakeContactName)
            if(verifyContactPresence == 'False')
                {
                    // console.log('Fake Contact cannot be added --> '+fakeContactName);
                    return 'False';
                }
            else{   
                await logger.info('Fake Contact added on the page verified --> '+fakeContactName);
                    return 'True';
                }
        
        } catch (e) {
            await logger.error('Error occured in verifyContactPresence function on addContact module');
            throw Error(e.stack);
    }
}

Page.prototype.navigateToSelectedContact = async function() {
    try{
        await logger.verbose('Navigate to selected Contact');
        var navigateToSelectedContact = await this.findGridItems('#contactsGrid', 'itemValue', 'firstName', fakeContactName);
        const actions = this.driver.actions({bridge: true});
        await actions.click(navigateToSelectedContact)
                     .click(navigateToSelectedContact)
                     .perform();
        } catch (e) {
            await logger.error('Error occured in navigateToSelectedContact function on addContact module');
            throw Error(e.stack);
    }
}

Page.prototype.deleteSelectedContact = async function() {
    try{
        await logger.verbose('Deleting selected contact');
        var deleteSelectedContact = await this.findByJs('#deleteButton', 'elId');
        await deleteSelectedContact.click();
        await this.warningYes();
        } catch (e) {
            await logger.error('Error occured in deleteSelectedContact function on addContact module');
            throw Error(e.stack);
    }
}

Page.prototype.searchContact = async function() {
    try{
        await logger.verbose('Searching the contact using search filter');
        await this.setComboListValue('#contactFirstNameFilter','setValue', fakeContactName);
        var rowCount = await this.findGridItems('#contactsGrid', 'rowCount');
            for (var i = 0; i<rowCount; i++)
                {   
                    var customQuery = 'return Ext.ComponentQuery.query("#contactsGrid")[0].getItemAt('+ i +').getRecord().getFirstName();';
                    var firstNameInGrid = await this.findGridItems('#contactsGrid', 'executeCustomQuery', customQuery);
                    if (!(firstNameInGrid == fakeContactName)) return 'False';
                }
                await logger.verbose('Contact found via the filter');
                return 'True';
        
        } catch (e) {
            await logger.error('Error occured in searchContact function on addContact module');
            throw Error(e.stack);
    }
}

module.exports = Page;


