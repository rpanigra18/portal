var Page = require('../Base/Base');
var data = require('../Base/data');
var faker = require('faker');
const to = require('await-to-js').default;
var _ = require('../node_modules/underscore');
var webdriver = require('selenium-webdriver');
const logger = require('../Base/logger');




Page.prototype.rkpLoads = async function() {
    try{
                await logger.verbose("Navigating to reports Page");
        var navToReports = await this.findByJs('[text=Reports ]','elId');
        await navToReports.click();
        navToReports = await this.findByJs('[text=Kiosk Count]', 'elId');
        await navToReports.click();
        await this.findByJs('#kioskReportGridId', 'elId');      //waiting for grid
        } catch (e) {
            await logger.error('Error occured on navigating to Reports in rkpLoads function');
            throw Error(e.stack);
        }
    
}


Page.prototype.login = async function() {
    try{
                await logger.verbose("Logging in with valid username/password");
        await this.userNameText(data.validUserName);
        await this.passwordText(data.validPassword);
        await this.loginBtn();
        } catch (e) {
            await logger.error('Error occured in login function');
            throw Error(e.stack);
    }
}

Page.prototype.verifyKioskCount = async function() {
    try{
                await logger.verbose('Verifying Kiosk counts on the Reports screen');
        var rowCount = await this.findGridItems('#kioskReportGridId','rowCount');
                await logger.info('Row Count of reoprt grid page -> '+rowCount);
        reportGrid = await _.range(rowCount).map(function(i){
                var x = 'return Ext.ComponentQuery.query("#kioskReportGridId")[0].getStore().getData().getAt('+ i +').data.Client;';
                return x;
            });
        let activeCount, inActiveCount, pendingCount;
        for (const x in reportGrid)
                {
                    var clientIdVal = await this.driver.executeScript(reportGrid[x]);
                    if (clientIdVal == data.contactClientNum) 
                        {
                            activeCount = await this.driver.executeScript('return Ext.ComponentQuery.query("#kioskReportGridId")[0].getStore().getData().getAt('+ x +').data.Active;');
                            inActiveCount = await this.driver.executeScript('return Ext.ComponentQuery.query("#kioskReportGridId")[0].getStore().getData().getAt('+ x +').data.InActive;');
                            pendingCount = await this.driver.executeScript('return Ext.ComponentQuery.query("#kioskReportGridId")[0].getStore().getData().getAt('+ x +').data.Pending;');
                        }
                }
                await logger.info('Active Kiosk count for client > ' +activeCount);
                await logger.info('Inactive Kiosk Count for client > ' +inActiveCount);
                await logger.info('Pending Kiosk Count for client > ' +pendingCount);
        var summaryArray = [];
        var stringValues = await this.driver.executeScript('return Ext.ComponentQuery.query("#kioskCountReportBottomContainerId")[0]._html;'); 
        summaryArray = stringValues.match(/\d+/g).map(Number);              // reg ex to find the kiosk numbers
        if ((summaryArray[0] = summaryArray[1]+summaryArray[2]+summaryArray[3])) 
               /*  && (activeCount == summaryArray[1]) &&
                    (inActiveCount == summaryArray[2]) &&
                        (pendingCount == summaryArray[3])) */
                                                return "True";
        else return "False";
        } catch (e) {
            await logger.error('Error occured on verifyingKioskCount function');
            throw Error(e.stack);
    }
}





        




module.exports = Page;