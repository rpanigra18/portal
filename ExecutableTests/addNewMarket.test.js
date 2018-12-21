var landingPage = require('../Pages/landingPage');
var newMarket = require('../Pages/newMarketPage');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver'),
test = require('selenium-webdriver/testing');
var retry = require('promise-retry');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
runOrSkip = require('../ExecutableTests/testLoader');
var should = chai.should();
assert = require('assert');
var dumpError = require('../Base/dumpError');
var logger = require('../Base/logger');
var oldMarketList, testStatus = [];
var newMarketName, flag;
var testName = 'Verifications on client list and Add/Delete a Market';
var tc1 = '1 - Add a Market';
var tc2 = '2 - Delete a Market';

describe(testName,function(){
    this.timeout(50000);
   
before(async function(){

    tl = await new runOrSkip();
    flag = await tl.testToRun(testName);
    await logger.info('*************xx*************');
    await logger.info(testName +' -> '+flag);
        if (flag === 'False')
            {
            this.skip();
            }
   try  {
            await logger.debug('Loading Browser and launching application');
            nmp = await new newMarket();
            await nmp.driver.manage().window().maximize();
            await nmp.visit(data.currentDev_Url);
            await nmp.driver.manage().setTimeouts( { implicit: 5000 } );
            await nmp.login();
            await nmp.waitForDashboardLoad();
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
                await nmp.quit(); 
              }    
  });

it(tc1, async function(){
    try{
        if ( !(testStatus[0] === 'Pass'))
                {
                    await logger.info('Skipping Test 1');
                    this.skip();
                }
        await logger.info('Executing ' +tc1);
        await nmp.navigateToMarket();
        await nmp.addNewMarket();
        var pOF = await nmp.verifyNewMarketPresence();
        await logger.debug('Pass or Fail return from page ->' +pOF);
        pOF.should.be.equal('True', 'New market was not added');
        testStatus[1] = 'Pass';
        await logger.info('Test 1 Passed');
    
    } catch(e) { 
        await dumpError(e);
        await logger.error('Test 1 Failed');
        assert.fail('1st Test Failed');
        }

    })

    it(tc2, async function(){
        try{    
            if ( !(testStatus[1] === 'Pass'))
                    {
                        await logger.info('Skipping Test 2');
                        this.skip();
                    }
            await logger.info('Executing '+tc2);
            await nmp.reNavigateToNewMarket();
            await nmp.deleteNewMarket();
            var pOF = await nmp.verifyNewMarketPresence();
            await logger.debug('Pass or Fail return from page ->' +pOF);
            pOF.should.be.equal('False', 'New market was not Deleted');
            await logger.info('Test 2 Passed');
            } catch(e) {
                await dumpError(e);
                await logger.error('Test 1 Failed');
                assert.fail('1st Test Failed');
            } finally {
                await nmp.deleteTempDiv();
                await logger.info('Temporary Division creted has been deleted');
            }
    
        })


})
