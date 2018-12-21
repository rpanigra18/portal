var landing = require('../Pages/landingPage');
var data = require('../Base/data');
var Page = require('../Base/Base');
var newDivPage = require('../Pages/newDivisionPage');
var newDivision;
var faker = require('faker');
var logger = require('../Base/logger');
var nc = -1;    // For the nested list count
var fakeNewMarketName;

landing.prototype.login = async function(){
    try{
        await logger.verbose('Executing login function');
        await this.userNameText(data.validUserName);
        await this.passwordText(data.validPassword);
        await this.loginBtn();
    } catch(e){
        await logger.error('Error occured in login function on newMarketPage module');
        throw Error(e.stack);
    }
  }

newDivPage.prototype.navigateToMarket = async function(){
    try{
            await logger.verbose('Navigate to New market');
            var navToMarketEl = await this.clientAccess(data.clientName);
            await navToMarketEl.click();
            await this.addNewDiv(nc);  
            navToMarketEl = await this.clientAccess();
            await navToMarketEl.click();
    } catch(e){
            await logger.error('Error occured in navigateToMarket function on newMarketPage module');
            throw Error(e.stack);
    }  
    
}  

newDivPage.prototype.addNewMarket = async function(){
    try{
        fakeNewMarketName = await this.fakeData('Market');
        await logger.info('Fake Market from Market Page --> ' +fakeNewMarketName);
        await this.nestedListIcon();
        await this.clickOnAddFromNestedList();
        await this.marketDescription(fakeNewMarketName);
        await this.addDivButton();
        return fakeNewMarketName;
    } catch(e){
        await logger.error('Error occured in addNewMarket function on newMarketPage module');
        throw Error(e.stack);
    }
    
}  

Page.prototype.marketDescription = async function(newMarketName){
    try{
        var marketDescriptionEl = await this.findByJs('#descriptionId','inputElement');
        await this.writeByEl(marketDescriptionEl, newMarketName);
    } catch(e){
        await logger.error('Error occured in marketDescription function on newMarketPage module');
        throw Error(e.stack);
    }
}

newDivPage.prototype.verifyNewMarketPresence = async function(){
    try{
            await logger.verbose('Verifying new Market presence on the navigation list');
            var newMarketPresFlag = await this.clientAccess(fakeNewMarketName);
            if (newMarketPresFlag === 'False')
                {
                    return 'False';
                }
            return 'True';
        } catch(e){
            await logger.error('Error occured in verifyNewMarketPresence function on newMarketPage module');
            throw Error(e.stack);
        }
  }
    

newDivPage.prototype.reNavigateToNewMarket = async function(){
    try{
            var reNavToNewMarketEl = await this.clientAccess(fakeNewMarketName);
            await reNavToNewMarketEl.click();
    } catch(e){
            await logger.error('Error occured in reNavigateToNewMarket function on newMarketPage module');
            throw Error(e.stack);
    }
}

newDivPage.prototype.deleteNewMarket = async function(){
    try{
        await logger.verbose('Deleting new Marktet from the page')
        await this.nestedListIcon();
        await this.deleteDivButtonFromNestedList();
        await this.warningYes();
    } catch(e){
        await logger.error('Error occured in deleteNewMarket function on newMarketPage module');
        throw Error(e.stack);
    }
}

newDivPage.prototype.deleteTempDiv = async function(){
    try{
        await logger.verbose('Deleting temporary Division from the page')
        await this.nestedListIcon();
        await this.deleteDivButtonFromNestedList();
        await this.warningYes();
    } catch(e){
        await logger.error('Error occured in deleteTempDiv function on newMarketPage module');
        throw Error(e.stack);
    }
}






module.exports = Page;
module.exports = landing;
module.exports = newDivPage;