var eventSearchPage = require('../SearchPage/eventSearch');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver');
var chai = require('chai');
runOrSkip = require('../ExecutableTests/testLoader');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var dumpError = require('../Base/dumpError');
var logger = require('../Base/logger');
var testStatus = [];
var flag;
assert = require('assert');
var testName = 'Verifications on Search - Event Search page';

describe('Verifications on Search - Event Search page', function(){
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
        esp = await new eventSearchPage();
        await esp.driver.manage().window().maximize();
        await esp.visit(data.currentDev_Url);
        await esp.login();
        await esp.waitForDashboardLoad();
        testStatus[0] = 'Pass';
   } catch (e) {
        await logger.error('Error launching application');    
        await dumpError(e);
        assert.fail('Error Occured on Before Hook: ' + e.stack);
   }
   
  });

  after(async function(){
        if (flag === 'True')
            {
                await esp.quit();  
                await logger.info("Quitting Browser");
                await logger.info('*************xx*************');
            }    
  });

  it('1 - Verify the current event search pulls the current events', async function(){
        
            if (!(testStatus[0] === 'Pass'))
                    {
                        await logger.info('Skipping Test 1');
                        await this.skip();
                    }
        try{
            await logger.info('Executing Test 1 - Verify the current event search pulls the current events');
            await esp.eventSearch(); 
            await logger.info('Test 1 Passed');
            testStatus[1] = 'Pass';
            }
        catch (e) {
            await dumpError(e);
            await logger.error('Test 1 Failed');
            assert.fail('1st Test Failed');
            }
   
  })

  it('2 - Verify all the events are OPEN', async function(){
        
    if (!(testStatus[1] === 'Pass'))
            {
                await logger.info('Skipping Test 2');
                await this.skip();
            }
            try{
                await logger.info('Executing Test 2 - Verify all the events are OPEN');
                var pOF = await esp.eventStatus(); 
                await logger.debug('Pass or Fail returned -> '+pOF);
                pOF.should.be.equal('True', 'All the events are not OPEN');
            //    testStatus[1] = 'Pass';
                }
            catch (e) {
                await dumpError(e);
                await logger.error('Test 2 Failed');
                assert.fail('2nd Test Failed');
                }

})

 
})