var webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until,
chrome = require('selenium-webdriver/chrome');
proxy = require('selenium-webdriver/proxy');
const retry = require('async-retry');
var fs = require('fs');
const to = require('await-to-js').default;
var faker = require('faker');
var dumpError = require('../Base/dumpError');
var logger = require('../Base/logger');
let err;


 function Page(){
    this.driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .setProxy(null)
    .forBrowser('chrome')
    .build();
    var driver = this.driver;


    this.visit = async function(theURL){
         return await driver.get(theURL);
    }

    this.SS = async function(name){
        try{
                await driver.sleep(1000);
                await driver.takeScreenshot().then(function(data){
                fs.writeFileSync(name + '.png', data, 'base64');
            });
        } catch(e){
            await logger.error('Error occured in taking screenshot');
        }
    }
    

    this.quit = async function(){
        await driver.sleep(1000);
        await logger.info("Quitting Browser");
        await logger.info('*************xx*************');
        return await driver.quit();
        
    }

    this.currTitle = async function(){
        return await driver.getTitle();
    }

    this.findByCss = async function(findByCssEl){
        [err] = await to(driver.wait(until.elementLocated(By.css(findByCssEl)), 5000));
            if(err) throw new Error ('Cannot wait for Element findByCss') ;
        [err, cSSEl] = await to(driver.findElement(By.css(findByCssEl)));
            if(err) throw new Error('Find by CSS element cannot be found');
        return await cSSEl;
    }

    this.waitForPageLoad = async function(){
        var result = await driver.executeScript('return document.readyState;');
        if (result == 'complete')
        {
            return await driver;
        } else
        {
            this.waitForPageLoad();
        }
    }

    this.findNestedList = async function(el, type, nc){
        if (el == '#nestedListOptionsIcon') 
            {
                var findNestedListEl =  await driver.executeScript('return Ext.ComponentQuery.query("' + el + '")[0].el.id;');
            }
        else
            {
                var script =  'return Ext.ComponentQuery.query("' + el + '")[' + nc + '].el.id;';
                findNestedListEl =  await driver.executeScript(script);        
            }

        
        await driver.wait(until.elementLocated(By.id(findNestedListEl)), 5000);
        [err, findNestedListEl] = await to(driver.findElement(By.id(findNestedListEl)));
            if(err) throw new Error ('Nested List Icon issue on Navigation Bar');
    
            await driver.sleep(1000);
            return await findNestedListEl;
    
    }

    this.findToolByCls = async function(el, type, n){
            try{
                var script =  'return Ext.ComponentQuery.query("' + el + '")[' + n + '].el.id;';
                var findToolByClsEl =  await driver.executeScript(script);        
                await driver.wait(until.elementLocated(By.id(findToolByClsEl)), 5000);
                findToolByClsEl = await driver.findElement(By.id(findToolByClsEl));
                await driver.sleep(1000);
                return await findToolByClsEl;
            } catch(e) {
                throw Error(e.stack);
        }
            
            
    
            
    
    }

    this.findByName = function(findByNameEl){
        driver.wait(until.elementLocated(By.name(findByNameEl)), 5000);
        return driver.findElement(By.name(findByNameEl));
    }

    this.findByJs = async function(el, type){
                    await logger.debug('Executing findByJs function');
            var formatString = await this.formatFunction(el, type)
                    await logger.debug('EXT function executing -> '+formatString);
         try{
            const retByJs = await retry(async () => {
                var extEl = await driver.executeScript(formatString); 
         //     console.log('el - > ' +extEl);
                var tempEl = await driver.findElement(By.id(extEl));
                if (tempEl)
                {
                    return tempEl;
                }

            },{
                    retries: 10,
                    minTimeout: 500,
                    maxTimeout: 500,
                               
                })
                await driver.sleep(1000);
                return await retByJs;

            }
            catch(e){
            await logger.error('Error occured in FindByJs function');
            throw Error(e.stack);
            }             
        
    }

    this.findTreeList = async function(el, validity){ 
        await logger.debug('Executing findTreeList in Base module');

    try{    
        const retTree = await retry(async () => {
        var n = 0;
        var elm = [];
        for (;; n++){
                    var func = 'return Ext.ComponentQuery.query("' + el + '")[0].getActiveItem().el.component.dataItems[' + n + '].bodyElement.id;';
                    elm[n] =  await driver.executeScript(func); 
                    var tempEl = await this.findById(elm[n]);
                //    await driver.wait(until.elementIsEnabled(tempEl), 10000); 
                    var key = await tempEl.getText();
                    if (key.includes(validity))
                        {
                            return await tempEl;  
                        }
                     
                    }
                } , {
                    retries: 3,
                    minTimeout: 1000,
                    maxTimeout: 1000,  
                })
                
                        await driver.sleep(1000);
                        return await retTree;
                    }   

    catch (e){
                await logger.debug('Error in Tree list function');
                return 'False';
            }
        
                        
    }

    
    this.formatFunction = async function(el, type){
        try{   
                if (type == 'buttonItemId')
                {
                    var statement = 'return Ext.ComponentQuery.query("' + el + '")[0].buttonElement.id;';
                }
                else if (type == 'innerHtmlElement')
                {
                    var statement = 'return Ext.ComponentQuery.query("' + el + '")[0].innerHtmlElement.id;';
                }
                else if (type == 'elId')
                {
                    var statement = 'return Ext.ComponentQuery.query("' + el + '")[0].el.id;';
                }
                else if (type == 'inputElement')
                {
                    var statement = 'return Ext.ComponentQuery.query("' + el + '")[0].inputElement.id;';
                }
                else if (type == 'titleComponent')
                {
                    var statement = 'return Ext.ComponentQuery.query("' + el + '")[0].titleComponent._title;';
                }
                else if (type == 'bodyElement')
                {
                    var statement = 'return Ext.ComponentQuery.query("' + el + '")[0].bodyElement.id;';
                }
                /* else if (type == 'text')
                {
                    var statement = 'return Ext.ComponentQuery.query("' + el + '")[0].el.id;';
                } */
                else {
                    throw new Error('Fomat function doesnt have the type specified');
                }
                await logger.silly('Formatted EXT to execute -> ' +statement);
                return await statement;
            } catch (e) {
                await logger.error('Error occured in Format function in Base class');
                throw Error(e.stack);
        }
    }

    this.findElementTitle = async function(el, type, key){
        var func = await this.formatFunction(el, type);
        try{
        var titleName = await retry(async () => {
        var titlePresent = await driver.executeScript(func); 
        if (titlePresent.includes(key))
        {
            return 'True';
        }
            } , {
                retries: 3,
                minTimeout: 1000,
                maxTimeout: 1000,  
            }) } catch (e) {
                    await logger.error('Cannot find Title > ' , Key);
                    return 'False';
            }
        return titleName;
    }

    this.setComboListValue = async function(el, type, value){
        var localFormatFunc;
        if (type == 'setValue')
        {
            localFormatFunc = 'Ext.ComponentQuery.query("' + el + '")[0].setValue(\'' + value + '\');';
        }
       else
       {
            localFormatFunc = 'Ext.ComponentQuery.query("' + el + '")[0].setInputValue(\'' + value + '\');';
       } 
        
      [err] = await to(driver.executeScript(localFormatFunc));    
      if (err) throw new Error('CombolistValue failed');
}
 

    this.findAll = async function(findAllEl){
        await driver.wait(until.elementLocated(By.css(findAllEl)), 5000);
        await driver.findElement(By.css(findAllEl));
    }

    this.findByLinkText = async function(findByLinkTextEl){
        await driver.wait(until.elementLocated(By.linkText(findByLinkTextEl)), 5000);
        await driver.findElement(By.linkText(findByLinkTextEl));
    }

    this.findById = async function(findByIdEl){
        await driver.wait(until.elementLocated(By.id(findByIdEl)), 10000);
        [err, findByIdElm] = await to(driver.findElement(By.id(findByIdEl)));
                if (err) throw new Error('Finding By ID failed');
        return await findByIdElm;
    }

    this.write = async function(writeEl, txt){
        [err] = await to(driver.wait(until.elementLocated(By.name(writeEl)), 10000));
                if(err) throw new Error('Cant locate write Element.v1');
        [err] = await to(this.findByName(writeEl).sendKeys(txt));
            if(err) throw new Error('Cant write to El');
    }   
    
    this.writeByEl = async function(writeByElm, txt){
        [err] = await to(driver.wait(until.elementIsEnabled(writeByElm), 10000));
                if(err) throw new Error('Cant locate write Element.v2');
        await writeByElm.sendKeys(txt);
    }

    this.wdwait = function(wdwaitEl){
        driver.wait(until.elementLocated(wdwaitEl), 5000);
    }

    this.findByClass = async function(findByClassEl){
        await driver.wait(until.elementLocated(By.className(findByClassEl)), 10000);
        await driver.findElement(By.className(findByClassEl));
    }

    this.fakeData = async function(data){
        if (data == 'kioskData')
        {
            var fakeName = faker.random.alphaNumeric();
            while (fakeName.length < 11)
                {
                    fakeName = faker.random.word();
                }
            return fakeName;
        }
        else
        var fakeName = faker.random.word();
        while (fakeName.length < 5)
        {
            fakeName = faker.random.word();
        }
        return fakeName;        
    }

    this.findGridItems = async function(el, type, field, key){
    await driver.sleep(1000);
    await logger.debug('Executing findGridItems in Base Class');
    if (type == 'rowCount')                 // return the row count of a grid
        {
            var gridElString = 'return Ext.ComponentQuery.query("' + el + '")[0].getStore().getData().length;';
            gridElString =  await driver.executeScript(gridElString); 
            return await gridElString;
        }
    if (type == 'itemValue')                // return the row El for a specific item value
        {
            gridElString = await this.gridListItem(el, field, key);
            return await gridElString;

        }
    if (type == 'executeCustomQuery')            //Execute custom query
        {   
            try{
                gridElString =  await driver.executeScript(field); 
                return await gridElString;
               } catch (e) {
                   return 'False';
               }
        }
        await logger.error('Error occured in FindGridItems function');
        throw new Error('Error in Base Grid Item > ' +e);
    }

    this.gridListItem = async function(el, field, key) {            //Find the element value and then return the row El
       await logger.debug('Executing gridListItem item in Base');
        try{    
            const gridTree = await retry(async () => {
            var n = 0;
            var elm = [];
            for (;; n++){
                        var func = 'return Ext.ComponentQuery.query("' + el + '")[0].getItemAt('+ n +').getRecord().getData().'+field+';';
                        elm[n] =  await driver.executeScript(func); 
                        if (elm[n].includes(key))
                            {
                                func = 'return Ext.ComponentQuery.query("' + el + '")[0].getItemAt('+ n +').getId();';
                                var gridRowEl = await driver.executeScript(func); 
                                gridRowEl = await this.findById(gridRowEl);
                                return await gridRowEl;
                            }
                        }
                    } , {
                        retries: 3,
                        minTimeout: 1000,
                        maxTimeout: 1000,  
                    })
                    
                            await driver.sleep(1000);
                            return await gridTree;
                        }   
    
        catch (e){
                   await logger.error('Cannot find in Tree Grid');
                   return 'False';
                }
    }


 }


module.exports = Page;