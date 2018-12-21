var Page = require('../Base/Base');
var landing = require('../Pages/landingPage');
var data = require('../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var webdriver = require('selenium-webdriver');

Page.prototype.login = async function() {
    try{
        await this.userNameText(data.validUserName);
        await this.passwordText(data.validPassword);
        await this.loginBtn();
        } catch (e) {
            throw new Error('KioskEvent Feed page - Login function > ' +e);
    }
}

Page.prototype.kioskEventPageGrid = async function() {
    try{
        var kioskEventPageGridEl = await this.findByJs('[text=Kiosk Events]', 'elId');
        await kioskEventPageGridEl.click();
        await this.findByJs('[cls=c-recent-events]', 'elId');
        var rowCount = await this.findGridItems('#recentEventsGrid', 'rowCount')
        await console.log('Kiosk Event Feed page row count of events -> ' +rowCount);
        } catch (e) {
            throw new Error('Kiosk Event page - kioskEventPageGrid function > ' +e);
    }
}

module.exports = Page;


