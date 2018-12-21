var Page = require('../Base/Base');
var landing = require('../Pages/landingPage');
var data = require('../Base/data');
var faker = require('faker');
const retry = require('async-retry');
const to = require('await-to-js').default;
var nc = -1;    // For the nested list count
var newDiv = [];
var webdriver = require('selenium-webdriver');
var logger = require('../Base/logger');
var fakeDivName;

landing.prototype.login = async function(){
  try{
            await logger.verbose('Executing login function');
            await this.userNameText(data.validUserName);
            await this.passwordText(data.validPassword);
            await this.loginBtn();
  } catch (e) {
            await logger.error('Error occured in login function on newDivisionPage module');
            throw Error(e.stack);
  }
}

Page.prototype.findTreeIds = async function(findKey){
    try{
        await logger.verbose('Executing findTreeIds function with key -> '+findKey);
        var treeList = await this.findTreeList('#kioskMapNavigationList',findKey);
        return await treeList;
    } catch(e) {
        await logger.error('Error occured in findTreeIds function on newDivisionPage module');
        throw Error(e.stack);
    }
}

Page.prototype.addNewDiv = async function(reset){
    try{
            await logger.verbose('Executing adding new division');
            await logger.debug('Arguements passed to AddNewDiv function -> '+reset);
            if (reset)
                {
                  nc = reset;
                }
            await this.nestedListIcon();
            await this.clickOnAddFromNestedList();
            fakeDivName = await this.fakeData('Division');
            await logger.info('Fake Division from Div Test --> ' +fakeDivName);
            await this.enterDivisionDescription(fakeDivName);
            await this.addDivButton();
            await this.waitForDashboardLoad();
            return fakeDivName;
        } catch (e) {
          await logger.error('Error occured in addNewDiv function on newDivisionPage module');
          throw Error(e.stack);
        }
  }


Page.prototype.newDivPresence = async function(){
      try{
        await logger.verbose('Verifying new Division presence in the navigation list');
        var clientAccessFlag = await this.clientAccess(fakeDivName);
        if (clientAccessFlag === 'False')
          {
            return 'False';
          }
         return 'True';
      } catch(e){
        await logger.error('Error occured in newDivPresence function on newDivisionPage module');
        throw Error(e.stack);
      }
  }
  

Page.prototype.clientAccess = async function(cl){
  
        await logger.debug('Executing clientAccess in newDivPage with cl - '+cl);
        if (!cl)
          {
            cl = fakeDivName;
          }
        var clientAccessEl = await this.findTreeIds(cl)
          try{
                  var clientAccessName = await clientAccessEl.getText();
                  if ( clientAccessName.includes(cl))
                    {
                      return await clientAccessEl;
                    } 
            } catch (e) {
                    await logger.debug('Warning occured in clientAccess function on newDivisionPage module');
                    return 'False';
                  } 
}

Page.prototype.reNavigateToDivisionAndDelete = async function(){
  try{
            await logger.verbose('Renavigating to the created division to delete it');
            var newDivEl = await this.clientAccess(fakeDivName);
            await newDivEl.click();
            await this.nestedListIcon();
            await this.deleteDivButtonFromNestedList();
            await this.warningYes();
            await this.waitForDashboardLoad();
  } catch (e) {
    await logger.error('Error occured in reNavigateToDivisionAndDelete function on newDivisionPage module');
    throw Error(e.stack);
  }
}



Page.prototype.clientName = async function(elId){
  var clientNameEl = await this.findById(elId);
  return clientNameEl;
}

Page.prototype.nestedListIcon = async function(){
  var nestedListIconEl = await this.findNestedList('#nestedListOptionsIcon','elId');
  [err] = await to(nestedListIconEl.click());
      if (err) throw Error ('New Div page - nestedListIcon >' +e.stack);
  return nc++;
}

Page.prototype.clickOnAddFromNestedList = async function(){
  var addNestedListEl = await this.findNestedList('#addIcon','elId',nc);
  [err] = await to(addNestedListEl.click());
      if (err) throw Error ('New Div page - clickOnAddFromNestedList >' +e.stack);
}

Page.prototype.enterDivisionDescription = async function(divText){
  var divDescEl = await this.findByJs('#marketDescription','inputElement');
  await this.writeByEl(divDescEl, divText);
}

Page.prototype.addDivButton = async function(){
  var addDivButtonEl = await this.findByJs('#addButton','elId');
//  await this.driver.sleep(1000);    //must 11062018
  [err] = await to(addDivButtonEl.click());
      if (err) throw Error ('New Div page - addDivButton >' +e.stack);
}

Page.prototype.loadNavigationPaneTitle = async function(key){

  var navPaneTitleEl = await this.findElementTitle('#kioskNavigationListToolbar','titleComponent', key);
  return await navPaneTitleEl;    //True or False
  
}

Page.prototype.deleteDivButtonFromNestedList = async function(){
  var deleteNestedListEl = await this.findNestedList('#deleteIcon','elId',nc);
  [err] =  await to(deleteNestedListEl.click());
        if (err) throw Error ('New Div page - deleteDivButtonFromNestedList >' +e.stack);
}

Page.prototype.warningYes = async function(){
  var warnYesEl = await this.findByJs('#yes', 'elId');
  return await warnYesEl.click();
}

Page.prototype.warningNo = async function(){
  var warnNoEl = await this.findByJs('#no', 'elId');
  return await warnNoEl.click();
}


/* Page.prototype.verifyFloatingSuccessText = async function(divText){
  var el = await this.findByJs('#floatingSuccessWindow','bodyElement');
  var succ =  await el.getText();
  console.log(succ);
} */



module.exports = Page;
module.exports = landing;
