var addATPage = require('../MaintenancePage/attractLoop/attractLoopPage');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver');
var chai = require('chai');
runOrSkip = require('../ExecutableTests/testLoader');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var testStatus = [];
var flag;
var dumpError = require('../Base/dumpError');
var logger = require('../Base/logger');
assert = require('assert');
var testName = 'Verifications on Maintenance Menu - AttractLoop';

describe('Verifications on Maintenance Menu - AttractLoop', function(){
    this.timeout(100000);

  before(async function(){
  
            tl = await new runOrSkip();
            flag = await tl.testToRun(testName);
            await logger.info('*************xx*************');
            await logger.info(testName + ' -> '+flag);
            if (flag === 'False')
                {
                    this.skip();
                }
    try{
        await logger.debug('Loading Browser and launching application');
        attractLoopPage = await new addATPage();
        await attractLoopPage.driver.manage().window().maximize();
        await attractLoopPage.visit(data.currentDev_Url);
        await attractLoopPage.login();
        await attractLoopPage.waitForDashboardLoad();
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
                await attractLoopPage.quit();  
            }    
  });

  it('1 - Verfiy available AttractLoop grid populates', async function(){
        
            if (!(testStatus[0] === 'Pass'))
                    {
                        await logger.info('Skipping Test 1');
                        await this.skip();
                    }
        try{
            await logger.info('Executing Test 1 - Verfiy available AttractLoop grid populates');
            await attractLoopPage.attractLoopPageLoads(); 
            await logger.info('Test 1 Passed');
            testStatus[1] = 'Pass';
            }
        catch (e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
            }
   
  })

  it('2 - Verify new AttractLoop can be added', async function(){
        
    if (!(testStatus[1] === 'Pass'))
            {
               await this.skip();
            }
            try{
                await logger.info('Executing Test 2 - Verify new AttractLoop can be added');
    //            await attractLoopPage.addNewattractLoop(); 
                var pOF = await attractLoopPage.verifyAttractLoopPresence();
                await logger.debug('Pass or Fail returned -> '+pOF);
                await pOF.should.be.equal('True', 'Added KDI does\'nt exist');
            //    testStatus[1] = 'Pass';
                }
            catch (e) {
                await dumpError(e);
                await logger.error('Test 2 Failed');
                assert.fail('2nd Test Failed');
                }

})

 
})