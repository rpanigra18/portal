var Page = require('../Base/Base');
var landing = require('../Pages/landingPage');
var newDivPage = require('../Pages/newDivisionPage');
var newMarketPage = require('../Pages/newMarketPage');
var data = require('../Base/data');
var f = require('../Base/utils');
var faker = require('faker');
var logger = require('../Base/logger');
var dumpError = require('../Base/dumpError');
var radd = require('rrad');
var fadd = radd.addresses[Math.floor(Math.random() * radd.addresses.length)];
//console.log('Random Add --> ' + JSON.stringify(fadd));
var obj = JSON.parse(JSON.stringify(fadd));
var fakeLocationName, fakeNewMarketName, fakeDivName;
var nc = -1;    // For the nested list count
var add1;


landing.prototype.login = async function(){
    try{
          await logger.verbose('Executing login function');
          await this.userNameText(data.validUserName);
          await this.passwordText(data.validPassword);
          await this.loginBtn(); 
    } catch (e) {
      await logger.error('Error occured in login function on newLocationPage module');
      throw Error(e.stack);
    }
  }

newMarketPage.prototype.navToNewLocationPage = async function(){
    try{
            await logger.verbose('Navigate to new Location page');
            var navToNewLocEl = await this.clientAccess(data.clientName);
            await navToNewLocEl.click();
            fakeDivName = await this.addNewDiv(nc);
            navToNewLocEl = await this.clientAccess(fakeDivName);
            await navToNewLocEl.click();
            fakeNewMarketName = await this.addNewMarket();
            await this.findTreeIds(fakeNewMarketName);
            navToNewLocEl = await this.clientAccess(fakeNewMarketName);
            await navToNewLocEl.click();
    } catch (e) {
      await logger.error('Error occured in navToNewLocationPage function on newLocationPage module');
      throw Error(e.stack);
    }
  }

newMarketPage.prototype.addNewLocation = async function(){
    try{
          await logger.verbose('Adding new location page');
          await this.nestedListIcon();
          await this.clickOnAddFromNestedList();
          fakeLocationName = await this.addLocationForm();
          return fakeLocationName;
    } catch (e) {
      await logger.error('Error occured in addNewLocation function on newLocationPage module');
      throw Error(e.stack);
    }
  }

newMarketPage.prototype.deleteNewLocation = async function(){
    try{  
          await logger.verbose('Executing to delete the new Location');
          await this.nestedListIcon();
          await this.deleteDivButtonFromNestedList();
          await this.warningYes();
    } catch(e) {
      await logger.error('Error occured in addNewLocation function on newLocationPage module');
      throw Error(e.stack);
    }
    
  }

Page.prototype.addLocationForm = async function(){
    try{
            await logger.verbose('Fill out details to create a new location ');     
            fakeLocationName = await this.fakeData('location');
            await logger.info('Fake Location from Location page --> ' + fakeLocationName)

            var addLocFormEl = await this.findByJs('#addressLine1Id','inputElement');
            await this.writeByEl(addLocFormEl, obj.address1);
            await logger.debug('Address line 1 added -' +obj.address1);

            addLocFormEl = await this.findByJs('#cityUSA','inputElement');
            await this.writeByEl(addLocFormEl,obj.city);
            await logger.debug('City added -' +obj.city);

            await this.setComboListValue('#stateId','setValue', obj.state);
            
            addLocFormEl = await this.findByJs('#postalCodeUSA','inputElement');
            await this.writeByEl(addLocFormEl,obj.postalCode);
            await logger.debug('Postal added -' +obj.postalCode);

            addLocFormEl = await this.findByJs('#descriptionId','inputElement');
            
            await this.writeByEl(addLocFormEl,fakeLocationName);

            addLocFormEl = await this.findByJs('#coordinatesButton','buttonItemId');
            await addLocFormEl.click();
            await this.driver.sleep(1000);    //must 11062018

            addLocFormEl = await this.findByJs('#addButton','buttonItemId');
            await addLocFormEl.click();

            return fakeLocationName;
    } catch (e) {
      await logger.error('Error occured in addLocationForm function on newLocationPage module');
      throw Error(e.stack);
    }

  }

  newMarketPage.prototype.verifyLocationPresence = async function(){
            try{
                  await logger.verbose('Verifying location presence on the navigation list');
                  var verifyLocFlag = await this.clientAccess(fakeLocationName);
                  if (verifyLocFlag === 'False')
                        {
                              return 'False';
                        }
                  return 'True';  
            }  catch(e){
                  await logger.error('Error occured in verifyLocationPresence function on newLocationPage module');
                  throw Error(e.stack);

    }
  }

  newMarketPage.prototype.clickOnLocationAddress = async function(){
    var locAddrEl = await this.findTreeIds(fakeLocationName)
    await locAddrEl.click();
  }

  newMarketPage.prototype.deleteTempMarket = async function(){
    try{
          await logger.verbose('Deleting the temporary market created for the TC ->'+fakeNewMarketName);
            await this.loadNavigationPaneTitle(fakeNewMarketName);
            await this.waitForDashboardLoad();
            await this.nestedListIcon();
            await this.deleteDivButtonFromNestedList();
            await this.warningYes();
    } catch (e) {
      await logger.error('Error occured in deleteTempMarket function on newLocationPage module');
      throw Error(e.stack);
    }
  }

  newMarketPage.prototype.deleteTempDivision= async function(){
    try{
          await logger.verbose('Deleting the temporaty Division created -> '+fakeDivName);
            await this.loadNavigationPaneTitle(fakeDivName);   
            await this.waitForDashboardLoad();
            await this.nestedListIcon();
            await this.deleteDivButtonFromNestedList();
            await this.warningYes();
    } catch (e) {
            await logger.error('Error occured in deleteTempDivision function on newLocationPage module');
            throw Error(e.stack);   
    }
  }

  
  module.exports = Page;
  module.exports = landing;
  module.exports = newMarketPage;
 
