const Encryption = require('./encrypt')
const fetch = require('node-fetch')
var fs = require('fs')
const { uniqueNamesGenerator, Config, names, adjectives, animals, colors } = require('unique-names-generator');


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
    ...animals,
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

const userAgentList = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'
]

const nameConfig = {
    dictionaries: [names, names],
    separator: ' ',
    length: 2
}

const userAgentConfig = {
    dictionaries: [userAgentList]
}

const countryConfig = {
    dictionaries: [countries]
}

const ccConfig = {
    dictionaries: [creditCardPrefix]
}

const domainEndConfig = {
    dictionaries: [domainEnds]
}

const domainTwoConfig = {
    dictionaries: [domains, domains],
    separator: '-',
    length: 2,
    style: 'lowerCase'
}

const domainOneConfig = {
    dictionaries: [domains],
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

const DOMAIN = 'clinicavetpereira.pt';

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
    var nonceValue = 'b823f04f2b20fa645c2911d7d292360e';
    /*var iptS = $('#so1');    // card number  e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();     
    var iptSec = $('#secu');
    var iptExp = $('#exp');
    //  ele.value.split('/').join('');    // Remove slash (/) if mistakenly entered.
    var ownerName = $('#owner');
    var btnOrder = $('#order-now');*/

    const fakeDomain = (Math.random() > 0.2 ? uniqueNamesGenerator(domainOneConfig) : uniqueNamesGenerator(domainTwoConfig)) + '.' + uniqueNamesGenerator(domainEndConfig)
    const initDomain = generateDomain()
    console.log('Using fake domain: ' + fakeDomain)
    fetch(initDomain + '/?id=' + fakeDomain).then((redirectRes) => {
        const domain = redirectRes.url.split('?')[0]
        //const domain = initDomain


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

        const userAgent = uniqueNamesGenerator(userAgentConfig)

        fetch(domain + 'xhr.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': userAgent
            },
            body: JSON.stringify({
                o: 'a9162a7e45d8c',
                tkn: encrypted
            })
        }).then(r => r.json().then(r => {
            console.log('Successful first respsonse\n' + JSON.stringify(r, null, 2))
            if (r.status) {
                fetch(domain + '/processOrder.php').then((res) => {
                    console.log('Successfully registered credit card!')
                    logRevenge(domain + '?id=' + fakeDomain, 'SUCCESS', frmD)
                    fetch(domain + '/collecte.php', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'User-Agent': userAgent
                        },
                        body: JSON.stringify({
                            t: Date.now(),
                            ord: "a9162a7e45d8c"
                        })
                    }).then(rrep => rrep.json().then(resp => {
                        console.log(resp)
                        console.log('Full success!')
                    }))
                })
                    .catch((error) => {
                        console.log(error)
                        logRevenge(domain + '?id=' + fakeDomain, 'FAIL', frmD)
                    })
                // {"status":false,"args":{"dmn":".\/unporcessable.php"}}
                //$('#orderFrm').attr('action', function () { return encodeURI(r.args.dmn) });
                //$('#orderFrm').submit(); // only redicects to process order
            } else {
                logRevenge(domain + '?id=' + fakeDomain, 'FAIL', frmD)
            }
        })).catch((error) => {
            console.log(error)
            logRevenge(domain + '?id=' + fakeDomain, 'FAIL', frmD)
        }).finally(() => {
            const next = Math.floor(Math.random() * 15000)
            console.log(`Next try in ${next / 1000} seconds`)
            setTimeout(attack, next);
        })
    })

}

attack()
