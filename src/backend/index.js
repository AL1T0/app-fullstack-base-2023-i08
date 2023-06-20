//=======[ Settings, Imports & Data ]==========================================
var PORT    = 3000;
var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

class User {
    constructor(id, username, password, type) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.type = type;
    }
}

//=======[ Main module code ]==================================================

// Endpoint to validate a user by its username and password
app.post('/users/login/', function(req, res, next) {
    utils.query('SELECT * FROM `Users` WHERE username = ? AND password = ?', 
    [req.body.username, req.body.password], function(err, response, field) {
    if (err) {
        console.log('Database error:', err);
        res.status(400).send(err);
        return;
    }
    if (response.length == 0) {
        console.log('Invalid credentials');
        res.status(401).send('Error');
        return;
    } 
    console.log('Login successful');
    res.status(200).send('OK');
    });
});

// Endpoint to add a new user
app.post('/users', function(req, res, next) {
    const { username, password, type } = req.body;
    utils.query('INSERT INTO `Users` (`username`, `password`, `type`) VALUES (?, ?, ?)',
    [username, password, type], function(err, response, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send('Usuario creado correctamente').status(201);
    });
});

// Endpoint to bring all the devices from the DB
app.get('/devices/', function(req, res, next) { 
    utils.query('SELECT * FROM Devices', function(err, response, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
    res.send(JSON.stringify(response)).status(200);
    });
});

// Endpoint to get a device by its ID
app.get('/devices/:id', function(req, res, next) {
    utils.query('SELECT * FROM Devices WHERE id = ?',req.params.id,
        function(err, response, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(response)).status(200);
        }
    );
});

// Endpoint to change a device state
app.put('/devices/state/:id', function(req, res, next) {
    utils.query('UPDATE `Devices` SET `state` = ? WHERE `id` = ?', 
    [req.body.state, req.params.id], function(err, response, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
    res.send({'changedRows': response.changedRows}).status(200);
    });
});

// Endpoint to edit device properties
app.put('/devices/:id', function(req, res, next) {
    utils.query('UPDATE `Devices` SET `name` = ?, `description` = ? , `type` = ? WHERE `id` = ?', 
    [req.body.name, req.body.description, req.body.type, req.params.id], function(err, response, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
    res.send({'changedRows': response.changedRows}).status(200);
    });
});

// Endpoint to add a new device to the DB
app.post('/devices/', function(req, res, next) {
    utils.query('INSERT INTO `Devices` (`name`, `description`, `state`, `type`) VALUES (?, ?, ?, ?)',
        [req.body.name, req.body.description, req.body.state, req.body.type],
        function(err, response, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send({ 'id': response.insertId }).status(201);
        }
    );
});

// Endpoint to delete a device from the DB
app.delete('/devices/:id', function(req, res, next) {
    utils.query('DELETE FROM Devices WHERE id = ?',req.params.id,
        function(err, response, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send("deleted").status(200);
        }
    );
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});