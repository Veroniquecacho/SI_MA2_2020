const express = require("express");
const axios = require('axios');
// const sqlite3 = require('sqlite3');

let app = express();
app.use(express.json());

app.listen(5006, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Borger Service');
    }
});

// Create Borger User
app.post('/borger-user', (req, res) => {

    let userId = req.body.userId;
    let sql = `INSERT INTO BorgerUser(UserId) VALUES(?)`;
  
    db.run(sql, [userId], (err) => {
        if(err){
            res.status(400).json({error:err.message})
        }
        res.status(201).json({message: 'Borger user added'})
        
    })  
});

// Create Borger User Address
app.post('/address', (req, res) => {

    let userId = req.body.userId;
    let getSql = `SELECT * FROM Address WHERE BorgerUserId = ${userId}`;
    let sql = `INSERT INTO Address(BorgerUserId, IsValid) VALUES(?, ?)`;
  
    db.run(getSql, [userId], (err) => {
        if(res.status(201)){
            res.status(201).json({message: 'User already exists'})
        } else {
            db.run(sql, [userId], (err) => {
                if(err){
                    res.status(400).json({error:err.message})
                }
                res.status(201).json({message: 'Address added for borger user added'})
            })
        }
    })  
});

// Read All Address
app.get('/address', (req, res) => {
    
    let sql = `SELECT * FROM Address;`; 
    db.all(sql, [], (err, address) =>{
        if(err){
            res.status(400).json({
                message: 'Something went wrong',
                error: err
            });
        } else{
            res.status(200).json({address});
            
        }
    });
})

// Read All Borger User
app.get('/borgeruser', (req, res) => {
    
    let sql = `SELECT * FROM BorgerUser;`; 
    db.all(sql, [], (err, borgerUser) =>{
        if(err){
            res.status(400).json({
                message: 'Something went wrong',
                error: err
            });
        } else{
            res.status(200).json({borgerUser});
            
        }
    });
})

// Update Address
app.put('/address/:id', (req, res) =>{
    let Id = req.params.id;
    let UserId = req.body.UserId;
    let getSql = `SELECT * FROM Address WHERE Id = ?`;
    let updateSql = `UPDATE Address SET Id = ?  WHERE Id = ?`;
    db.all(getSql, [Id], (err, address) => {
        if (err) {
            res.status(400).json({error: err});
        }
        if(!address.length) {
            res.status(404).json({message: `No address with this id: ${Id}`});
        } else {
            db.run(updateSql, [UserId, Id], (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'The address was not updated',
                        error: err.message
                    });
                }
                res.status(201).json({message: 'Address was updated!'});
            });
        }
    });
})


// Delete Address
app.delete('/address/:id', (req, res) =>{
    let Id = req.params.id;
    let getSql = `SELECT * FROM Address WHERE Id = ?`;
    let deleteSql = `DELETE FROM Address WHERE Id = ?`; 
    db.all(getSql, [Id], (err, address) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        if(!address.length) {
            res.status(404).json({message: `No Address with this id: ${Id}`});
        } else {
            db.run(deleteSql, Id, (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'Address could not be deleted',
                        error: err.message
                    });
                }
                res.status(201).json({message: `Address id: ${Id} deleted`});
            });
        }
    });
})

// Delete Borger User
app.delete('/borgeruser/:id', (req, res) =>{
    let Id = req.params.id;
    let getSql = `SELECT * FROM BorgerUser WHERE Id = ?`;
    let deleteSql = `DELETE From BorgerUser WHERE BorgerUserId = ? && DELETE FROM BorgerUser WHERE Id = ?`;
    db.all(getSql, [Id], (err, borgerUser) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        if(!borgerUser.length) {
            res.status(404).json({message: `No Borger User with this id: ${Id}`});
        } else {
            db.run(deleteSql, Id, (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'This Borger User could not be deleted',
                        error: err.message
                    });
                }
                res.status(201).json({message: `Borger User id: ${Id} deleted`});
            });
        }
    });
})



