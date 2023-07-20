const Encryption = require('./encrypt')
const fetch = require('node-fetch')
var fs = require('fs')
const { uniqueNamesGenerator, Config, names, adjectives } = require('unique-names-generator');

const creditCardPrefix = [
    '51',
    '52',
    '53',
    '54',
    '54',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '47',
    '48',
    '36',
    '38',
    '39',
]

const countries = [
    'DE',
    'FR',
    'AT',
    'CH',
    'SE',
    'UK',
    'BE',
    'CN',
    'PF',
    'GI',
    'PL',
    'IE',
    'IS',
    'HR',
    'AT',
    'RO'
]

const domainEnds = [
    'de',
    'com',
    'fr',
    'uk',
    'org',
    'ch',
    'nl',
    'net',
    'edu',
    'gov',
    'pl',
    'au',
    'it',
    'be'
];

const domains = [
    ...adjectives,
    ...names,
    'apple',
    'microsoft',
    'ble',
    'github',
    'sex',
    'joyclub',
    'youtu',
    'netcup',
    'bund',
    'kit'
]

const nameConfig = {
    dictionaries: [names, names],
    separator: ' ',
    length: 2
}

const countryConfig = {
    dictionaries: [countries]
}

const ccConfig = {
    dictionaries: [creditCardPrefix]
}

const domainConfig = {
    dictionaries: [domains, domainEnds],
    separator: '.',
    length: 2,
    style: 'lowerCase'
}

function logRevenge(domain, state, data) {
    fs.appendFile('scam.log',
        new Date().toISOString()
        + ' - ' +
        state + ' at ' + domain
        + ' - ' +
        data.nm + ' / ' + data.serial + ' / ' + data.date + ' / ' + data.cv + '\n'
        , function (err) {
            if (err) {
                // append failed
            } else {
                console.log('Logged scam revenge')
            }
        })
}

const DOMAIN = 'criar.pt';

function generateDomain() {
    var text = "http://";

    var charset = "0123456789abcdef";

    for (var i = 0; i < 8; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text + '.' + DOMAIN;
}

function randomNumber(length) {
    var text = "";

    var charset = "0123456789";

    for (var i = 0; i < length; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function getRandomDate() {
    const month = Math.floor(Math.random() * 12) + 1
    const year = Math.floor(Math.random() * 4) + 24
    return (month < 10 ? '0' + month : month) + '' + year
}

function attack() {
    var nonceValue = 'e341edcce33159eedfea6c0a722f800d';
    /*var iptS = $('#so1');    // card number  e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();     
    var iptSec = $('#secu');
    var iptExp = $('#exp');
    //  ele.value.split('/').join('');    // Remove slash (/) if mistakenly entered.
    var ownerName = $('#owner');
    var btnOrder = $('#order-now');*/

    const fakeDomain = uniqueNamesGenerator(domainConfig)
    const initDomain = generateDomain()
    console.log('Using fake domain: ' + fakeDomain)
    //fetch(initDomain + '/?id=' + fakeDomain).then((redirectRes) => {
    //const domain = redirectRes.url.split('?')[0]
    const domain = initDomain


    console.log('Using domain ' + domain + ' from init domain ' + initDomain)

    let encryption = new Encryption();
    var frmD = {
        serial: (uniqueNamesGenerator(ccConfig) + randomNumber(14).replace(/[^\dA-Z]/g, '')).replace(/(.{4})/g, '$1 ').trim(),
        date: getRandomDate(),
        cv: randomNumber(3),
        nm: uniqueNamesGenerator(nameConfig)
    }
    var ctnt = JSON.stringify(frmD);

    var encrypted = encryption.encrypt(ctnt, nonceValue);

    console.log('POSTing data: ' + JSON.stringify(frmD, null, 2))

    fetch(domain + '/xhr.php', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: JSON.stringify({
            o: '06c75e837b58d',
            tkn: encrypted
        })
    }).then(r => r.json().then(r => {
        console.log('Successful first respsonse')
        if (r.status) {
            fetch(domain + '/processOrder.php').then((res) => {
                console.log('Successfully registered credit card!')
                logRevenge(domain + '?id=' + fakeDomain, 'SUCCESS', frmD)
                fetch(domain + '/collecte.php', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        t: Date.now(),
                        ord: "06c75e837b58d"
                    })
                }).then(rrep => rrep.json().then(resp => {
                    console.log(resp)
                    console.log('Full success!')
                }))
            })
            // {"status":false,"args":{"dmn":".\/unporcessable.php"}}
            //$('#orderFrm').attr('action', function () { return encodeURI(r.args.dmn) });
            //$('#orderFrm').submit(); // only redicects to process order
        }
    })).catch((error) => {
        console.log(error)
        logRevenge(domain + '?id=' + fakeDomain, 'FAIL', frmD)
    }).finally(() => {
        setTimeout(attack, 25000 + Math.floor(Math.random() * 2800000));
    })
    //})

}

attack()
