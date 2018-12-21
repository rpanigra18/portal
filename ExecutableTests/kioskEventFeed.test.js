var kioskEventFeedPage = require('../KioskEventFeed/kioskEventFeedGrid');
var data = require('../Base/data');
const {Builder, By, Key, until} = require('selenium-webdriver');
var chai = require('chai');
runOrSkip = require('../ExecutableTests/testLoader');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var testStatus = [];
var flag;
assert = require('assert');

describe('Verification on Kiosk Events feed', function(){
    this.timeout(200000);

  before(async function(){
  
            tl = await new runOrSkip();
            flag = await tl.testToRun('Verification on Kiosk Events feed');
            if (flag === 'False')
                {
                    this.skip();
                }
    try{
        kfp = await new kioskEventFeedPage();
        await kfp.driver.manage().window().maximize();
        await kfp.visit(data.currentDev_Url);
        await kfp.login();
        await kfp.waitForDashboardLoad();
        testStatus[0] = 'Pass';
   } catch (e) {
        console.error(e);
        assert.fail('Error Occured on Before Hook: ' + e.stack);
   }
   
  });

  after(async function(){
    if (flag === 'True')
    {
        await kfp.quit();  
    }    
  });

  it('1 - Verify kiosk event feed page loads with active events', async function(){
        
            if (!(testStatus[0] === 'Pass'))
                    {
                       await this.skip();
                    }
        try{
            await kfp.kioskEventPageGrid();
            }
        catch (e) {
            console.error(e);
            assert.fail('1st Test Failed due to error --> ' +e.stack);
            }
   
  })

})