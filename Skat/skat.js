const express = require("express");
const axios = require('axios');
const sqlite3 = require('sqlite3');

let app = express();
app.use(express.json());

app.listen(5006, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Skat System | Listening on port 8001');
    }
});

let db = new sqlite3.Database('skat_db.sqlite', (err) => {
    if(err) {
        return console.log(err.message);
    }
    console.log("Connected to the skat_db database")
});

// Create Skat User
app.post('/skat-user', (req, res) => {

    let userId = req.body.userId;
    let sql = `INSERT INTO SkatUser(UserId) VALUES(?)`;
  
    db.run(sql, [userId], (err) => {
        if(err){
            res.status(400).json({error:err.message})
        }
        res.status(201).json({message: 'Skat user added'})
        
    })  
});
// Read All Skat User
app.get('/skat-user', (req, res) => {
    
    let sql = `SELECT * FROM SkatUser;`; 
    db.all(sql, [], (err, skatUser) =>{
        if(err){
            res.status(400).json({
                message: 'Something went wrong',
                error: err
            });
        } else{
            res.status(200).json({skatUser});
            
        }
    });
})
// Read Skat User by id
app.get('/skat-user/:id', (req, res) =>{
    let Id = req.params.id;
    let sql = `SELECT * FROM SkatUser WHERE Id = ?`;
    db.all(sql, [Id], (err, skatUser) =>{
        if(err){
            res.status(400).json({error: err});
        } 
        if(skatUser.length){
            res.status(200).json({skatUser});

        }else{
            res.status(404).json({message: `No skat user with this id: ${Id}`});
           
        }
    });

})
// Read Skat User by UserId
app.get('skat-user-uid/:id', (req, res) =>{
    let UserId = req.params.id;
    let sql = `SELECT * FROM SkatUser WHERE UserId = ?`;
    db.all(sql, [UserId], (err, skatUser) =>{
        if(err){
            res.status(400).json({error: err});
        } 
        if(skatUser.length){
            res.status(200).json({skatUser});

        }else{
            res.status(404).json({message: `No borger with this id: ${UserId}`});
           
        }
    });
    
})
// Update Skat User
app.put('/skat-user/:id', (req, res) =>{
    let Id = req.params.id;
    let UserId = req.body.UserId;
    let getSql = `SELECT * FROM SkatUser WHERE Id = ?`;
    let updateSql = `UPDATE SkatUser SET UserId = ?  WHERE Id = ?`;
    db.all(getSql, [Id], (err, skatUser) => {
        if (err) {
            res.status(400).json({error: err});
        }
        if(!skatUser.length) {
            res.status(404).json({message: `No skat user with this id: ${Id}`});
        } else {
            db.run(updateSql, [UserId, Id], (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'The skat user was not updated',
                        error: err.message
                    });
                }
                res.status(201).json({message: 'Skat user was updated!'});
            });
        }
    });

    
})
// Delete Skat User
app.delete('/skat-user/:id', (req, res) =>{
    let Id = req.params.id;
    let getSql = `SELECT * FROM SkatUser WHERE Id = ?`;
    let deleteSql = `DELETE FROM SkatUser WHERE Id = ?`; 
    db.all(getSql, [Id], (err, skatUser) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        if(!skatUser.length) {
            res.status(404).json({message: `No Skat User with this borger user id: ${Id}`});
        } else {
            db.run(deleteSql, Id, (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'Skat User could not be deleted',
                        error: err.message
                    });
                }
                res.status(201).json({message: `Skat User with borger user id: ${Id} deleted`});
            });
    

        }
    });
    
})


// Create Skat Year
app.post('/skat-year', (req, res) => {
    let label = req.body.label;
    let start = req.body.startDate;
    let end = req.body.endDate;
    let skatyear = 'INSERT INTO SkatYear(Label, StartDate, EndDate) VALUES (?, ?, ?)';
    let skatUserYear = 'INSERT INTO SkatUserYear(SkatUserId, SkatYearId, UserId, Amount) VALUES(?, ?, ?, ?)';
    db.run(skatyear, [label, start, end], function (err){
        if(err){
            res.status(400).json({error:err.message})
        }else{
            axios.get(`http://localhost:5006/skat-user`).then(response =>{
                let skatuser = response.data.skatUser;
                for(i = 0; skatuser.length > i; i++){
                    db.run(skatUserYear, [skatuser[i].Id, this.lastID, skatuser[i].UserId, 0], (err) =>{
                        if(err){
                            res.status(400).json({error:err.message})
                        }

                    })
                }
               

            }) 
            
            
            res.status(201).json({message: 'Skat Year added'})
        }
    })
})

// Get All Skat User
app.get('/skat-year', (req, res) => {
    let sql = `SELECT * FROM SkatYear;`; 
    db.all(sql, [], (err, skatYear) =>{
        if(err){
            res.status(400).json({
                message: 'No Skat Year to show',
                error: err
            });
        } else{
            res.status(200).json({skatUser: skatYear});
            
        }
    });

});
// Get All Skat Year
app.get('/skat-year/:id', (req, res) => {
    let Id = req.params.id
    let sql = `SELECT * FROM SkatYear WHERE Id = ?;`; 
    db.all(sql, [Id], (err, skatYear) =>{
        if(err){
            res.status(400).json({
                message: 'No Skat Year to show',
                error: err
            });
        } else{
            res.status(200).json({skatUser: skatYear});
            
        }
    });

});

// Update Skat Year
app.put('/skat-year/:id', (req, res) =>{
    let Id = req.params.id;
    let Label = req.body.UserId;
    let start = req.body.startDate;
    let end = req.body.endDate;
    let getSql = `SELECT * FROM SkatYear WHERE Id = ?`;
    let updateSql = `UPDATE SkatYear SET Label = ?, ModifiedAt = CURRENT_TIMESTAMP, StartDate = ?, EndDate = ? WHERE Id = ?`;
    db.all(getSql, [Id], (err, skatYear) => {
        if (err) {
            res.status(400).json({error: err});
        }
        if(!skatYear.length) {
            res.status(404).json({message: `No skat year with this id: ${Id}`});
        } else {
            db.run(updateSql, [Label, start, end, Id], (err) => {
                if (err) {
                    res.status(400).json({
                        message: 'The skat year was not updated',
                        error: err.message
                    });
                }
                res.status(201).json({message: 'Skat year was updated!'});
            });
        }
    });

    
})



// Delete Skat Year by id
app.delete('/skat-year/:id', (req, res) => {

    let Id = req.params.id;
    let deleteSql = `DELETE FROM SkatYear WHERE Id = ?`; 
    db.run(deleteSql, Id, (err) => {
        if (err) {
            res.status(400).json({
                message: 'Skat User could not be deleted',
                error: err.message
            });
        }
        res.status(201).json({message: `Skat User with borger user id: ${Id} deleted`});
    });
});



app.post('/pay-taxes', (req, res) =>{

    let userId = req.body.userId;
    let amount = req.body.amount;
    let getUserSql = 'SELECT * FROM SkatUserYear WHERE UserId = ?';
    let getSkatYearSql = 'SELECT * FROM SkatYear WHERE Id = ?';
    let updateSql = 'UPDATE SkatUserYear SET IsPaid = ?, Amount = ? WHERE Id = ? ';

    //axios.get('http://localhost/5005/bank')
    db.all(getUserSql, [userId], (err, SkatUserYear )=>{
        if(err){
            res.status(400).json({
                message: `No Skat user year found with user id:${userId}`,
                err: err.message
            })
        }
        if(SkatUserYear.length){
            for(i = 0; SkatUserYear.length > i; i++){

                //if(SkatUserYear[i].IsPaid === 0 && SkatUserYear[i].Amount > 0)
                if(SkatUserYear[i].IsPaid === 0){

                    console.log(SkatUserYear[i].UserId)
                }

            }
            res.status(200).json({skatUser: SkatUserYear})

        }else{
            res.status(404).json({message: `No Skat user year found with user id:${userId}`});
           
        }
        
        
        
        

    })

    /*
    * Takes a body with a UserId (Not BankUserId, Not SkatUserId –UserId that comes from the supposed  
    *    Main System developed in Mandatory I)and the total amount that is in that user’sbank account. 
    * An initial check will occur –if theuserdid not previously paid his taxes
    * A user is deemed to have paid his taxes if the value is greater than 0in the SkatUserYear table.
    * A call will be made to the Tax Calculator and depending on the response, the SkatUserYearwill be updated 
    *    with the returned sum from the Tax Calculator and the IsPaid property will be set to true...
    * Make a call to an endpoint in BankAPI to subtract money from account. The body of that request 
    *    should contain an amount and a UserId(Not BankUserId, not SkatUserId)
    */

})