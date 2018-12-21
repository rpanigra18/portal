var landingPage = require('../Pages/landingPage');
var clientTree = require('../Pages/newDivisionPage');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver');
var chai = require('chai');
runOrSkip = require('../ExecutableTests/testLoader');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var testStatus = [];
var existingDivList;
var flag;
assert = require('assert');
var logger = require('../Base/logger');
var dumpError = require('../Base/dumpError');
var testName = 'Verifications on client list and Add/Delete a division';
var tc1 = '1 - Verify the dashboard page Title is Kiosk Portal';
var tc2 = '2 - User have access to Lexar 103';
var tc3 = '3 - Add a division for the User';
var tc4 = '4 - Delete the division added for the User';


describe(testName, function(){
    this.timeout(100000);

  before(async function(){
  
            tl = await new runOrSkip();
            flag = await tl.testToRun(testName);
            await logger.info('*************xx*************');
            await logger.info(testName +' -> '+flag);
            if (flag === 'False')
                {
                    this.skip();
                }
    try{
        await logger.debug('Loading Browser and launching application');
        ndp = await new clientTree();
        await ndp.driver.manage().window().maximize();
        await ndp.visit(data.currentDev_Url);
        await ndp.login();
        await ndp.waitForDashboardLoad();
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
        await ndp.quit();  
    }    
  });

  it(tc1, async function(){
        try{
            if (!(testStatus[0] === 'Pass'))
                    {
                        await logger.info('Skipping Test 1');
                        this.skip();
                    }
            await logger.info('Executing ' +tc1);
            var pageTitle = await ndp.currTitle();
            await pageTitle.should.equal('Kiosk Portal');  
            testStatus[1] = 'Pass';
            await logger.info('Test 1 Passed');
            }
        catch (e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
            }
   
  });

  it(tc2, async function(){
    if (!(testStatus[1] === 'Pass'))
    {
        await logger.info('Skipping Test 2');
        this.skip();
    }
    try{
            await logger.info('Executing '+tc2);
            var cl = await ndp.clientAccess(data.clientName);
            await cl.click();
            var navTitle = await ndp.loadNavigationPaneTitle(data.clientName);
            await ndp.SS('Client access SS');
            await navTitle.should.be.equal('True', 'Failed as the specific client is not listed');
            testStatus[2] = 'Pass';
            await logger.info('Test 2 Passed');
    } catch (e) {
            await dumpError(e);
            await logger.error('Test 2 Failed');
            assert.fail('2nd Test Failed');
    }
  });


it(tc3, async function(){
    if (!(testStatus[2] === 'Pass'))
        {
            await logger.info('Skipping Test 3');
            this.skip();
        }
   try{
            await logger.info('Executing '+tc3);
            await ndp.addNewDiv();
            var pOF = await ndp.newDivPresence();  
            await logger.debug('Pass of fail returned -> '+pOF);
                if(pOF === 'False')
                    {
                        await logger.info('New division cannot be added');
                        await ndp.SS('No new divisions SS');
                    }
                else 
                    {
                        await logger.info('New Division is added');
                        await ndp.SS('New divisions SS');
                        
                    }
        pOF.should.be.equal('True', 'Failed as new Division is not added.'); 
        testStatus[3] = 'Pass';
        await logger.info('Test 3 Passed');
    } catch (e) {
            await dumpError(e);
            await logger.error('Test 3 Failed');
            assert.fail('3rd Test Failed');
    }
    
    });

it(tc4, async function(){
    if (!(testStatus[3] === 'Pass'))
        {
            await logger.info('Skipping Test 4');
            this.skip();
        }
    try{
        await logger.info('Executing '+tc4);
        await ndp.waitForDashboardLoad();
        await ndp.reNavigateToDivisionAndDelete();
        var pOF = await ndp.newDivPresence();
        await logger.debug('Pass of fail returned -> '+pOF);
        pOF.should.be.equal('False', 'New division could not be deleted');
        await logger.info('Test 4 Passed');
    } catch (e) { 
        await dumpError(e);
        await logger.error('Test 3 Failed');
        assert.fail('3rd Test Failed');
         } 
         
    });
  

})



