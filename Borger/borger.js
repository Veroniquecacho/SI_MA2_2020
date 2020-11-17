const express = require("express");
const axios = require('axios');
const sqlite3 = require('sqlite3');
//const sqlite3 = require('sqlite3').verbose();
const xmlparser = require('express-xml-bodyparser');
const { response } = require("express");

let app = express();
app.use(express.json());
app.use(xmlparser());
//


app.listen(5004, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Borger Server | Listening on port 5004');
    }
});

let db = new sqlite3.Database('borger_db.sqlite', (err) => {
    if(err) {
        return console.log(err.message);
    }
    console.log("Connected to the borger_db database")
});

// create Borger
app.post('/borger', (req, res) => {

    let UserId = req.body.UserId;
    let address = req.body.address;
    let today = new Date().toLocaleDateString();
    let sql = `INSERT INTO borger(UserId, CreatedAt) VALUES(? ,?)`;
    let addressSql = `INSERT INTO address(BorgerUserId, Address, CreatedAt, isValid) VALUES(?, ?, ?, ?)`;

    db.serialize(() => {
        db.run(sql, [UserId, today])
        .run(addressSql, [UserId, address, today, 1], (err) => {
            if(err){
                res.status(400).json({error:err.message})
            }else{
                res.status(201).json({message: 'Borger and Address added'})
            }
        })

    })

    
});
// read all borger
app.get('/borger', (req, res) => {
    
    let sql = `SELECT * FROM borger;`; 
    db.all(sql, [], (err, borger) =>{
        if(err){
            res.status(400).json({
                message: 'Something went wrong',
                error: err
            });
        } else{
            res.status(200).json({borger});
            
        }
    });
});
// read borger by id
app.get('/borger/:id', (req, res) => {
    let Id = req.params.id;
    let sql = `SELECT * FROM borger WHERE Id = ?`;
    db.all(sql, [Id], (err, borger) =>{
        if(err){
            res.status(400).json({error: err});
        } 
        if(borger.length){
            res.status(200).json({borger});

        }else{
            res.status(404).json({message: `No borger with this id: ${Id}`});
           
        }
    });
   
})
// read borger by user id
app.get('/borgeruid/:id', (req, res) => {
    let userId = req.params.id;
    let sql = `SELECT * FROM borger WHERE UserId = ?`;
    db.all(sql, [userId], (err, borger) =>{
        if(err){
            res.status(400).json({error: err});
        } 
        if(borger.length){
            res.status(200).json({borger});

        }else{
            res.status(404).json({message: `No borger with this user id: ${userId}`});
           
        }
    });
   
})
// update borger by id
app.put('/borger/:id', (req, res) => {
    let Id = req.params.id;
    let UserId = req.body.UserId;
    let getSql = `SELECT * FROM borger WHERE Id = ?`;
    let updateSql = `UPDATE borger SET UserId = ?  WHERE Id = ?`;
    db.all(getSql, [Id], (err, borger) => {
        if (err) {
            res.status(400).json({error: err});
        }
        if(!borger.length) {
            res.status(404).json({message: `No borger with this id: ${Id}`});
        } else {
            db.run(updateSql, [UserId, Id], (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'The borger was not updated',
                        error: err.message
                    });
                }
                res.status(201).json({message: 'Borger was updated!'});
            });
        }
    });

   
})
// delete borger by id
app.delete('/borger/:id', (req, res) => {
    let Id = req.params.id;
    let getSql = `SELECT * FROM borger WHERE Id = ?`;
    let deleteSql = `DELETE FROM borger WHERE Id = ?`; 
    db.all(getSql, [Id], (err, borger) => {
        borger.forEach(element => {
            let userId = element.UserId;
            axios.delete(`http://localhost:5004/addresses/${userId}`).then(response =>{

            }) 
            .catch(err =>{
                res.status(400).json({message: 'There is no Address with this Borger user Id'})
        })
            
        });
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        if(!borger.length) {
            
            res.status(404).json({message: `No borger with this id: ${Id}`});
        } else {
            db.run(deleteSql, Id, (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'Borger could not be deleted',
                        error: err.message
                    });
                }
                res.status(201).json({message: `Borger with id: ${Id} deleted`});
            });
  

        }
    });
   
    

 
})

// create borger address
app.post('/address', (req, res) => {
    let borgerUserId = req.body.borgerUserId;
    let a = req.body.address;
    let today = new Date().toLocaleDateString();

    let sql = `INSERT INTO address(BorgerUserId, Address, CreatedAt, isValid) VALUES(?, ?, ?, 1)`;
    let updateSql =`UPDATE address SET isValid = 0 WHERE BorgerUserID = ? AND isValid = 1`;
    axios.get(`http://localhost:5004/borgeruid/${borgerUserId}`).then(response =>{

        axios.get(`http://localhost:5004/addressByUser/${borgerUserId}`).then(response =>{
            let addresses = response.data.address
            for (i = 0; i < addresses.length; i++){
                if(addresses[i].Address != a){
                    db.run(updateSql, [addresses[i].BorgerUserId], (err) => {
                        if (err) {
                            res.status(400).json({
                                message: 'The address was not updated',
                                error: err.message
                            });
                        }
                    });
                    break;
                } 
            }
            db.run(sql, [borgerUserId, a, today], (err) => {
                if(err){
                    res.status(400).json({error:err})
                }else{
                    res.status(201).json({message: 'Address added'})
                }
            })
            
        })
        .catch(err =>{
            if(err){
                res.status(400).json({message: err.message});
            }
        });
    })
    .catch(err =>{
        if(err){
            res.status(400).json({message: 'There is no Borger with this id'})
        }
    })

      
  
})
// read all borger address
app.get('/address', (req, res) => {
    let sql = `SELECT * FROM address`;
    db.all(sql, [], (err, addresses) => {
        if (err) {
            res.status(400).json({
                message: 'The addresses not found',
                error: err
            });
        }
        res.status(200).json({addresses});
    });
});
// read borger address by id
app.get('/address/:id', (req, res) => {
    let Id = req.params.id
    let sql = `SELECT * FROM address WHERE Id = ?`;
    db.all(sql, [Id], (err, address) => {
        if(err){
            res.status(400).json({error: err});
        } 
        if(address.length){
            res.status(200).json({address});

        }else{
            res.status(404).json({message: `No address with this id: ${Id}`});
           
        }
    });
})
// read borger address by borgerUserId
app.get('/addressByUser/:id', (req, res) => {
    let Id = req.params.id
    let sql = `SELECT * FROM address WHERE BorgerUserId = ?`;
    db.all(sql, [Id], (err, address) => {
        if(err){
            res.status(400).json({error: err});
        } 
        if(address.length){
            res.status(200).json({address});

        }else{
            res.status(404).json({message: `No address with this id: ${Id}`});
           
        }
    });
})

// update borger address id
app.put('/address/:id', (req, res) => {
    let Id = req.params.id;
    let a = req.body.address;
    let getSql = `SELECT * FROM address WHERE Id = ?`;
    let updateSql = `UPDATE address SET Address = ?  WHERE Id = ?`;
    db.all(getSql, [Id], (err, address) => {
        if (err) {
            res.status(400).json({error: err});
        }
        if(!address.length) {
            res.status(404).json({message: `No Address with this id: ${Id}`});
        } else {
            db.run(updateSql, [a, Id], (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'The Address was not updated',
                        error: err.message
                    });
                }
                res.status(201).json({message: 'Address was updated!'});
            });
        }
    });

    
})
// delete borger address id
app.delete('/address/:id', (req, res) => {
    let Id = req.params.id;
    let getSql = `SELECT * FROM address WHERE Id = ?`;
    let deleteSql = `DELETE FROM address WHERE Id = ?`; 
    db.all(getSql, [Id], (err, address) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        if(!address.length) {
            res.status(404).json({message: `No address with this id: ${Id}`});
        } else {
            db.run(deleteSql, Id, (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'Address could not be deleted',
                        error: err.message
                    });
                }
                res.status(201).json({message: `Address with id: ${Id} deleted`});
            });
         

        }
    });
    
    
})
// delete all borger address by borgerUserId
app.delete('/addresses/:id', (req, res) => {
    let borgerUserId = req.params.id;
    let getSql = `SELECT * FROM address WHERE borgerUserId = ?`;
    let deleteSql = `DELETE FROM address WHERE borgerUserId = ?`; 
    db.all(getSql, [borgerUserId], (err, addresses) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        if(!addresses.length) {
            res.status(404).json({message: `No addresses with this borger user id: ${borgerUserId}`});
        } else {
            db.run(deleteSql, borgerUserId, (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'Addresses could not be deleted',
                        error: err.message
                    });
                }
                res.status(201).json({message: `Addresses with borger user id: ${borgerUserId} deleted`});
            });
    

        }
    });
    
    
})

