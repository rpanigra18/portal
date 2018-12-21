var sessionSearchPage = require('../SearchPage/sessionSearch');
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
var testName = 'Verifications on Search - Session Search page';

describe('Verifications on Search - Session Search page', function(){
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
        ssp = await new sessionSearchPage();
        await ssp.driver.manage().window().maximize();
        await ssp.visit(data.currentDev_Url);
        await ssp.login();
        await ssp.waitForDashboardLoad();
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
                await ssp.quit();  
                await logger.info("Quitting Browser");
                await logger.info('*************xx*************');
            }    
  });

  it('1 - Verify the session search pulls the session search result for a week', async function(){
        
            if (!(testStatus[0] === 'Pass'))
                    {
                        await logger.info('Skipping Test 1');
                        await this.skip();   
                    }
        try{
            await logger.info('Executing Test 1 - Verify the session search pulls the session search result for a week');
            await ssp.sessionSearch(); 
            await logger.info('Test 1 Passed');
            testStatus[1] = 'Pass';
            }
        catch (e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
            }
   
  })

  it('2 - Verify session events add up for all payment types', async function(){
        
    if (!(testStatus[1] === 'Pass'))
            {
                await logger.info('Skipping Test 2');
                await this.skip();
            }
            try{
                await logger.info('Executing Test 2 - Verify session events add up for all payment types');
                var pOF = await ssp.sessionSearchFilterTest(); 
                await logger.debug('Pass or Fail returned -> '+pOF);
                await pOF.should.be.equal('True', 'Session event count doesnt match up');
            //    testStatus[1] = 'Pass';
                await logger.info('Test 2 Passed');
                }
            catch (e) {
                await dumpError(e);
                await logger.error('Test 2 Failed');
                assert.fail('2nd Test Failed');
                }

})

 
})