var faker = require('faker');

var fake = function(){
    return {
        email: faker.internet.email(),
        userName: faker.internet.userName()
    }
}

module.exports = fake;