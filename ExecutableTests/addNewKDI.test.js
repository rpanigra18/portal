var addKDIPage = require('../MaintenancePage/kdi/kdiPage');
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
var testName = 'Verifications on Maintenance Menu - KDI';

describe('Verifications on Maintenance Menu - KDI', function(){
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
        aKdiPage = await new addKDIPage();
        await aKdiPage.driver.manage().window().maximize();
        await aKdiPage.visit(data.currentDev_Url);
        await aKdiPage.login();
        await aKdiPage.waitForDashboardLoad();
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
                await aKdiPage.quit();  
            }    
  });

  it('1 - Verfiy available KDI grid populates', async function(){
        
            if (!(testStatus[0] === 'Pass'))
                    {
                        await logger.info('Skipping Test 1');
                        await this.skip();
                    }
        try{
            await logger.info('Executing Test 1 - Verfiy available Kdi grid populates');
            await aKdiPage.kdiPageLoads(); 
            await logger.info('Test 1 Passed');
            testStatus[1] = 'Pass';
            }
        catch (e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
            }
   
  })

  it('2 - Verify new KDI can be added', async function(){
        
    if (!(testStatus[1] === 'Pass'))
            {
               await this.skip();
            }
            try{
                await logger.info('Executing Test 2 - Verify new Kdi can be added');
    //            await aKdiPage.addNewKdi(); 
                var pOF = await aKdiPage.verifyKdiPresence();
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