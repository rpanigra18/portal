var newDivisionTest = require('../ExecutableTests/addNewDivision.test');
var fs = require('fs');
var test = [];
var run;
var request = require('request');
// This code sample uses the 'request' library:
// https://www.npmjs.com/package/request
var request = require('request');


/* describe('Running the test from Test Loader)', function(){
    this.timeout(200000);
    it('Test Execution', function(){
        testExecution();
    }) */

function testExecution(){

this.testToRun = async function(testName){
    
var data = fs.readFileSync('./ExecutableTests/runTest.txt','utf8').toString().split("\n");

for (i in data){
    trimmedData = data[i].trim();
    if (trimmedData.includes(testName))
    {
        var lookingForSkip = (trimmedData.substr(trimmedData.length - 4)).toUpperCase(); 
        if (lookingForSkip === 'SKIP')
            {
                return 'False';
            }
        
        
    }
    
} return 'True';   
    
}

this.testToSkip = function(){
    test[2] = 'Adding a Kiosk (delete not available in portal)';
    test[3] = 'Verifications on Landing Page';
    test[4] = 'Verify adding/deleting a new Location';
  
    test[1] = 'Verifications on client list and Add/Delete a division';
}

}


module.exports = testExecution;

