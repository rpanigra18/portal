var addContactPage = require('../ContactsPage/addContact');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver');
var chai = require('chai');
runOrSkip = require('../ExecutableTests/testLoader');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var testStatus = [];
var dumpError = require('../Base/dumpError');
var logger = require('../Base/logger');
var flag;
assert = require('assert');
var testName = 'Verificaiton on Add Contacts';
var tc1 = '1 - Verify user can add a contact';
var tc2 = '2 - Verify user can search the contact with FirstName';
var tc3 = '3 - Verify user can delete a contact';

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
        acp = await new addContactPage();
        await acp.driver.manage().window().maximize();
        await acp.visit(data.currentDev_Url);
        await acp.login();
        await acp.waitForDashboardLoad();
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
        await acp.quit();  
    }    
  });

  it(tc1, async function(){
        
            if (!(testStatus[0] === 'Pass'))
                    {
                        await logger.info('Skipping Test 1');
                        await this.skip();
                    }
        try{
            await logger.info('Executing -> '+tc1);
            await acp.addContact();
            var pOF = await acp.verifyContactPresence();
            await logger.debug('Pass or Fail return -> '+pOF);
            await pOF.should.equal('True', 'Contact could not be added');  
            testStatus[1] = 'Pass';
            await logger.info('Test 1 Passed');
            }
        catch (e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
            }
   
  })

  it(tc2, async function(){
    if (!(testStatus[1] === 'Pass'))
            {
                await logger.info('Skipping Test 2');
                await this.skip();
            }
        try{
            await logger.info('Executing -> '+tc2);
            var pOF = await acp.searchContact();
            await logger.debug('Pass or Fail return from page ->' +pOF);
            await pOF.should.equal('True', 'Contact could not be Searched');  
            testStatus[2] = 'Pass';
            await logger.info('Test 2 Passed');
            }
        catch (e) {
                await dumpError(e);
                await logger.error('Test 2 Failed');
                assert.fail('2nd Test Failed');
            }

})

  it(tc3, async function(){
        if (!(testStatus[1] === 'Pass'))            //Depends on Test1 if contact was added.
                {
                    await logger.info('Skipping Test 3');
                    await this.skip();
                }
    try{
        await logger.info('Executing -> '+tc3);
        await acp.navigateToSelectedContact();
        await acp.deleteSelectedContact();
        var pOF = await acp.verifyContactPresence();
        await logger.debug('Pass or Fail return from page ->' +pOF);
        await pOF.should.equal('False', 'Contact could not be deleted');  
        testStatus[2] = 'Pass';
        await logger.info('Test 3 Passed');
        }
    catch (e) {
        await dumpError(e);
        await logger.error('Test 3 Failed');
        assert.fail('3rd Test Failed');
        }

})

})