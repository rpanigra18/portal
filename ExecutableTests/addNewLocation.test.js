var landingPage = require('../Pages/landingPage');
var newLocationPage = require('../Pages/newLocationPage');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver'),
test = require('selenium-webdriver/testing');
var retry = require('promise-retry');
var chai = require('chai');
var dumpError = require('../Base/dumpError');
assert = require('assert');
var logger = require('../Base/logger');
runOrSkip = require('../ExecutableTests/testLoader');
var oldLocationArray, newLocationArray, testStatus = [];
var flag;
var testName = 'Verify adding/deleting a new Location';
var tc1 = '1 - Add a new Location';
var tc2 = '2 - Delete an existing Location';


describe(testName, function(){
    this.timeout(80000);
   
before(async function(){

    tl = await new runOrSkip();
    flag = await tl.testToRun(testName);
    await logger.info('*************xx*************');
    await logger.info(testName + '-> '+flag);
        if (flag === 'False')
            {
            this.skip();
            }

   try  {
            await logger.debug('Loading Browser and launching application');
            nlp = await new newLocationPage();
            await nlp.driver.manage().window().maximize();
            await nlp.visit(data.currentDev_Url);
            await nlp.driver.manage().setTimeouts( { implicit: 5000 } );
            await nlp.login();
            await nlp.waitForDashboardLoad();
            testStatus[0] = 'Pass';
        } catch (e) {
            await logger.error('Error launching application');    
            await dumpError(e);
            assert.fail('Error Occured on Before Hook');
        }
    });

after(async function(){
    if (flag === 'True')
    {
        await nlp.quit();  
    }      
  });

it(tc1, async function(){
    
        if (!(testStatus[0] === 'Pass'))
                {
                    this.skip();
                }
        try{
            await logger.info('Executing '+tc1);
            await nlp.navToNewLocationPage();
            await nlp.addNewLocation();
            var pOF = await nlp.verifyLocationPresence();
            await logger.debug('Pass or fail flag returns ->'+pOF);
            pOF.should.be.equal('True', 'New Location was not added');
            testStatus[1] = 'Pass';
            await logger.info('Test 1 Passed');
        } catch(e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
        }

    })

    it(tc2, async function(){
        if (!(testStatus[1] === 'Pass'))
                {
                    this.skip();
                }
        try{
            await logger.info('Executing '+tc2);
            await nlp.waitForDashboardLoad();
            await nlp.clickOnLocationAddress();
            await nlp.deleteNewLocation();
            var pOF = await nlp.verifyLocationPresence();
            await logger.debug('Pass or fail flag returns ->'+pOF);
            pOF.should.be.equal('False', 'New Location was not Deleted');
                } catch(e) {
                        await dumpError(e);
                        await logger.error('Test 1 Failed');
                        assert.fail('1st Test Failed');
                } finally {
                await nlp.deleteTempMarket();
                await logger.info('Deleted the Market created for this TC');
                await nlp.deleteTempDivision();
                await logger.info('Deleted the Division created for this TC');
            }
        })
})