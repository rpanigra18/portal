var reportsKiosk = require('../Reports/report_KioskCount');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver');
var chai = require('chai');
runOrSkip = require('../ExecutableTests/testLoader');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var testStatus = [];
var flag;
var dumpError = require('../Base/dumpError');
assert = require('assert');
const logger = require('../Base/logger');
var testName = 'Verififcation on Kiosk Reports';

describe('Verififcation on Kiosk Reports', async function(){
            this.timeout(20000);

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
        rkp = await new reportsKiosk();
        await rkp.driver.manage().window().maximize();
        await rkp.visit(data.currentDev_Url);
        await rkp.login();
        await rkp.waitForDashboardLoad();
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
                await rkp.quit(); 
                await logger.debug("Quitting Browser");
                await logger.info('*************xx*************');
            }    
  });

  it('1 - Verfiy kiosk reports grid loads', async function(){
        
            if (!(testStatus[0] === 'Pass'))
                    {
                        await logger.info('Skipping Test 1');
                        await this.skip();
                    }
        try{
                    await logger.info('Running Test 1 - Verfiy kiosk reports grid loads');
            await rkp.rkpLoads(); 
                    await logger.info('Test 1 Passed');
            testStatus[1] = 'Pass';
            }
        catch (e) {
            await dumpError(e);
                        await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
            }
   
  })

  it('2 - Verify kiosk count adds up as expected in the summary', async function(){
        
    if (!(testStatus[1] === 'Pass'))
            {
                        await logger.info('Skipping Test 2');
                await this.skip();
            }
            try{
                        await logger.info('Running Test 2 - Verify kiosk count adds up as expected in the summary');
                var pOF = await rkp.verifyKioskCount(); 
                        await logger.debug('Pass or Fail returned -> '+pOF);
                await pOF.should.be.equal('True', 'Kiosk report count does\'nt sum up as expected');
                        await logger.info('Test 2 Passed');
                }
            catch (e) {
                await dumpError(e);
                    await logger.error('Test 2 Failed');
                assert.fail('2nd Test Failed');
                }
    await logger.debug('End of Test Case');
  

})



 
})