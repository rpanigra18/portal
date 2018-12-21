var Page = require('../Pages/landingPage');
test = require('selenium-webdriver/testing');
var chai = require('chai');
var data = require('../Base/data');
ruOrSkip = require('../ExecutableTests/testLoader');
var testStatus = [];
assert = require('assert');
var page, flag;
var logger = require('../Base/logger');
var dumpError = require('../Base/dumpError');
var testName = 'Verifications on Landing Page';
var tc1 = '1 - Validate Page Title is Kiosk Portal';
var tc2 = '2 - Invalid credentials entered';
var tc3 = '3 - Valid Login to the application';

describe(testName, function(){
    this.timeout(30000);
    
   
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
            page = await new Page();
            await page.driver.manage().window().maximize();
            await page.visit(data.currentDev_Url);
            testStatus[0] = 'Pass';
            } 
        catch (e) {
            await logger.error('Error launching application');    
            await dumpError(e);
            assert.fail('Error Occured on Before Hook');
              }
          });

  after(async function(){
          if (flag === 'True')
              {
                await page.quit();  
              }    
          });

  it(tc1, async function(){
          
                if (!(testStatus[0] === 'Pass'))
                      {
                          await logger.info('Skipping Test 1');
                          this.skip();
                      }
            try{
                await logger.info('Executing ' +tc1);
                assert.equal(await page.currTitle(), 'Kiosk Portal');
                testStatus[1] = 'Pass';
                await logger.info('Test 1 Passed');
              } catch (e) {
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
                await page.fakeUserNameText();
                await page.fakePasswordText();
                await page.loginBtn();
                var el = await page.errMsgAreaText();
                var errorMsg = await el.getText();
                await page.SS('Invalid Credentials SS');
                errorMsg.should.equal('You entered an invalid User Name or Password. Please try again. Remember, User Name and Password are case sensitive.');
                testStatus[2] = 'Pass';
                await logger.info('Test 2 Pased');
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
                await page.clearInputFields();
                await page.userNameText(data.validUserName);
                await page.passwordText(data.validPassword);
                await page.loginBtn();
                await page.waitForDashboardLoad();
                await page.SS('Positive usecase - valid credentials');
                var currUrl = await page.driver.getCurrentUrl();
                await currUrl.should.include('#dashboardContainer');
                await logger.info('Test 3 Passed');

    } catch (e) {
                await dumpError(e);
                await logger.error('Test 3 Failed');
                assert.fail('3rd Test Failed');
    }
       
      
  });
})

