// var landingPage = require('../Pages/landingPage');
var addKiosk = require('../Pages/addKiosk');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver'),
test = require('selenium-webdriver/testing');
var retry = require('promise-retry');
runOrSkip = require('../ExecutableTests/testLoader');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
assert = require('assert');
var logger = require('../Base/logger');
var testStatus = [];
var  flag;
var testName = 'Adding a Kiosk (delete not available in portal)';

describe('Adding a Kiosk (delete not available in portal)', function(){
    this.timeout(80000);
   
before(async function(){
   
        var tl = await new runOrSkip();
        flag = await tl.testToRun(testName);
            await logger.info('*************xx*************');
            await logger.info(testName +' -> '+flag);
        if (flag === 'False')
            {
            this.skip();
            }
   try  {
            await logger.debug('Loading Browser and launching application');
            akp = await new addKiosk();
            await akp.driver.manage().window().maximize();
            await akp.visit(data.currentDev_Url);
            await akp.driver.manage().setTimeouts( { implicit: 5000 } );
            await akp.login();
            await akp.waitForDashboardLoad();
            testStatus[0] = 'Pass';
           // await akp.waitForPageLoad();
        } catch (e) {
            await logger.error('Error launching application');    
            await dumpError(e);
            assert.fail('Error Occured on Before Hook');
        }
    });

after(async function(){
    if (flag === 'True')
            {
                await akp.quit();   
            }  
    });

  it('1 - Add a Kiosk', async function(){
    if ( !(testStatus[0] === 'Pass'))
            {
                this.skip();
            }
    try{
            await logger.info('Executing Test 1 - Add a Kiosk');
            await akp.navToAddKioskPage();
            await logger.info('Test 1 Passed');
        
        } catch(e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
        }

    })

})