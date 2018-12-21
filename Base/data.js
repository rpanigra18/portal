
module.exports = {

    // Generic input data
             dev1_Url: 'https://cxpdev1.convergentcare.com/ksprt/admin/kioskadminportal/goToAdminLogin.action?subClientId=0#login',
             dev2_Url: 'https://cxpdev2.convergentcare.com/ksprt/admin/kioskadminportal/goToAdminLogin.action?subClientId=0#login',
             dev3_Url: 'https://cxpdev3.convergentcare.com/ksprt/admin/kioskadminportal/goToAdminLogin.action?subClientId=0#login',
    
            currentDev_Url: 'https://cxpdev1.convergentcare.com/ksprt/admin/kioskadminportal/goToAdminLogin.action?subClientId=0#login',

    // Landing Page Data
    fakeUserName: 'abc',
    fakePassword: 'xyz',
    validUserName: 'super',
    validPassword: 'eCarePass1234!',

    // New Division Page Data
    clientName: 'Lexar 103',                //has to be present and user should have access to it.
    newDivisionName: 'AutomationDiv9',

    // New Market Page Data
    navigateToDivision: 'Lexar Division',    //has to be present.
    newMarketName: 'La Vista1',


    // New Location Page Data
    navigateToNewMarket: 'La Vista',          //has to be present.
    addressLine1: '617 N 114th St',
    cityName: 'Omaha',
    postal: '68124',                            // has to be present
    Description: 'Added By automation',         // has to be present

    // New Kiosk Page Data
    machineName: 'TestAutomat',                 // has to be 11 char
    serialNumber: '1236547898745',
    warrantyType: 2,                           // currently hard coding NE
    logLevel: 'FATAL',
    pcGeneration: 2,
    pcSerialNum: 'awdas123123',
    machineStatus: 'ACTIVE',
    deliveryDate: '2018-10-19',
    kioskPassword: 'tEST12345678',
    attractLoopIntendedVersion: '1.0',
    kdiIntendedVersion: '1.57',
    kdogIntendedVersion: '1.57',
    maintanceModeEnabled: 'Y',

    // Contact client data
    contactClientNum: 103,



}