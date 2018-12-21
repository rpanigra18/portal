var Page = require('../Base/Base');
var faker = require('faker');
var webdriver = require('selenium-webdriver'),
until = webdriver.until;
const to = require('await-to-js').default;
var logger = require('../Base/logger');
let err;


Page.prototype.userNameText = async function(un){
  try{
    await this.write('j_username', un);  
  } catch(e){
    await logger.error('Error occured in userNameText function on landingPage module');
    throw Error(e.stack);
  }
    
}

Page.prototype.passwordText = async function(ps){
    try{
        await this.write('j_password', ps);
    } catch(e){
        await logger.error('Error occured in userNameText function on landingPage module');
        throw Error(e.stack);
    }
    
}

Page.prototype.fakeUserNameText = async function(){
    var fakeName = faker.internet.userName();
    await logger.verbose('Fake Name enetred -> '+fakeName);
    await this.write('j_username', fakeName);
}

Page.prototype.fakePasswordText = async function(){
    await this.write('j_password', faker.internet.password());
}

Page.prototype.loginBtn = async function(){
    var loginBtnEl = await this.findByJs('#loginButton', 'buttonItemId');
    [err] = await to(loginBtnEl.click());
            if(err) throw Error ('Unable to click on Login Button > ' +e.stack);
} 

Page.prototype.clearInputFields = async function(){
    await logger.debug('Clearing the username and password');
    await this.findByName('j_username').clear();
    await this.findByName('j_password').clear();
}


Page.prototype.errMsgAreaText = async function(){

        var errMsgAreaTextEl = await this.findByCss('.c-login-message-area-error');
    
        return await errMsgAreaTextEl;

}

Page.prototype.waitForDashboardLoad = async function(){
    await logger.verbose('Waiting on Google Map to load');
    var dashboardLoad = await this.findByJs('#kioskGoogleMap', 'elId');
 //   await this.driver.wait(until(dashboardLoad.isDisplayed(), 5000));
}



module.exports = Page;

