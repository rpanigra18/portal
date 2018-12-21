var Page = require('../Base/Base');
// var landing = require('../Pages/landingPage');
var data = require('../Base/data');
var to = require('await-to-js').default;
var logger = require('../Base/logger');
var nc = -1;    // For the nested list count as -1 and 0 are used from newLocation page
var add1, fakeDivName,fakeNewMarketName, fakeLocationName;

Page.prototype.login = async function(){
    try{
            await logger.verbose('Executing login function');
            await this.userNameText(data.validUserName);
            await this.passwordText(data.validPassword);
            await this.loginBtn();
        }
        catch(e) {
            await logger.error('Error occured in login function on addKiosk module');
            throw Error(e.stack);
        }
  }

Page.prototype.navToAddKioskPage = async function(){
      try{
            await logger.verbose('Navigate to Kiosk');
            var navToAddKioskPageEl;
            navToAddKioskPageEl = await this.clientAccess(data.clientName);
            [err] = await to(navToAddKioskPageEl.click());
                  if (err) throw new Error ('Cannot access > ' +data.clientName);
            fakeDivName = await this.addNewDiv(nc);
            navToAddKioskPageEl = await this.clientAccess(fakeDivName);
            [err] = await to(navToAddKioskPageEl.click());
                  if (err) throw new Error ('Cannot access > ' +fakeDivName); 
            fakeNewMarketName = await this.addNewMarket();
            navToAddKioskPageEl = await this.clientAccess(fakeNewMarketName);
            [err] = await to(navToAddKioskPageEl.click());
                  if (err) throw new Error ('Cannot access > ' +fakeNewMarketName); 
            fakeLocationName = await this.addNewLocation();
            navToAddKioskPageEl = await this.clientAccess(fakeLocationName);
            [err] = await to(navToAddKioskPageEl.click());
                  if (err) throw new Error ('Cannot access > ' +fakeLocationName); 
            await this.addKioskInformation();
      } catch(e) {
            await logger.error('Error occured in navToAddKioskPage function on addKiosk module');
            throw Error(e.stack);
      }
    
  }

  Page.prototype.addKioskInformation = async function(){
    try{
          await logger.verbose('Navigating to Kiosk detail page');
          nc = await this.nestedListIcon(nc);
          await this.clickOnAddFromNestedList(nc);
          await this.addKioskDetails();  
          var addKioskInformationEl = await this.findByJs('#addButton', 'elId');
          await addKioskInformationEl.click();
    } catch (e) {
            await logger.error('Error occured in addKioskInformation function on addKiosk module');
            throw Error (e.stack);
    }
    
  }

  Page.prototype.addKioskDetails = async function(){
    try{
            await logger.verbose('Filling out new kiosk details');
            var addKioskDetailsEl = await this.findByJs('#machineIdTextField','inputElement');
            var machineName = await this.fakeData('kioskData');
            await logger.info('Fake Machine added --> ' + machineName);
            await this.writeByEl(addKioskDetailsEl, machineName);

            addKioskDetailsEl = await this.findByJs('#machineSerialNumberId','inputElement');
            var srNumber = await this.fakeData('kioskData');
            await this.writeByEl(addKioskDetailsEl, srNumber);

            await this.setComboListValue('#machineWarrantyId','setValue', data.warrantyType);

            await this.setComboListValue('#machineLogLevelId','setValue', data.logLevel);

            await this.setComboListValue('#machinePcGenerationId','setValue', data.pcGeneration);

            addKioskDetailsEl = await this.findByJs('#machinePcSerialNumberId','inputElement');
            var pcSrNumber = await this.fakeData('kioskData');
            await this.writeByEl(addKioskDetailsEl, pcSrNumber);

            await this.setComboListValue('#machineStatusId','setValue', data.machineStatus);

            /* el = await this.findByJs('#machineDeliveryDateId','inputElement');
            await this.writeByEl(el,data.deliveryDate); */

            addKioskDetailsEl = await this.findByJs('#machinePasswordId','inputElement');
            await this.writeByEl(addKioskDetailsEl, data.kioskPassword);

            await this.setComboListValue('#machineIntendedAttractLoopId','setValue', data.attractLoopIntendedVersion);

            await this.setComboListValue('#machineIntendedKdiVersionId','setValue', data.kdiIntendedVersion);

            await this.setComboListValue('#machineIntendedKdogVersion','setValue', data.kdogIntendedVersion);

            await this.setComboListValue('#machineMaintenanceModeEnabledId','setValue', data.maintanceModeEnabled);

    } catch (e) {
            await logger.error('Error occured in addKioskDetails function on addKiosk module');
            throw Error (e.stack);
    }


  }


  module.exports = Page;
