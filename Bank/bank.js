// const express = require("express");
const sqlite3 = require('sqlite3');
const axios = require('axios');
const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const { response } = require("express");

let app = express();
app.use(express.json());
app.use(xmlparser());

app.listen(5005, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Bank Server | Listening on port 5005');
    }
});

let db = new sqlite3.Database('bank_db.sqlite', (err) => {
    if(err) {
        return console.log(err.message);
    }
    console.log("Connected to the bank database")
});

// Implement CRUD for BankUser and Account

// Create bank user
app.post('/api/bank/users', (req, res) => {

    let UserId = req.body.UserId;
    let today = new Date().toLocaleString();
    let readUserSql = `SELECT * FROM BankUser WHERE UserId = ?`;
    let sql = `INSERT INTO BankUser(UserId, CreatedAt, ModifiedAt) VALUES(?, ?, ?)`;

    db.all(readUserSql, [UserId], (err, BankUser) => {
        if(err){
            res.status(400).json({error: err });
        }
        if(BankUser.length){
            res.status(400).json({ message: `Bank user with user id ${UserId} already exists`})
        } else {    

            db.run(sql, [UserId, today, today], (err) => {
                if (err) {
                    res.status(400).json({ message: 'Failed at creating bank user', error: err });
                }
                res.status(201).json({ message: 'Bank user created'});
            });
        }
    });
});

// Read all bank users
app.get('/api/bank/users', (req, res) => {

    let sql = `SELECT * FROM BankUser`;

    db.all(sql, [], (err, BankUsers) =>{
        if(err) {
            res.status(400).json({ message: 'Something went wrong', error: err });
        } else {
            res.status(200).json({BankUsers});
        }
    });
});

// Read bank user with specific id
app.get("/api/bank/users/:id", (req, res) => {
    let Id = req.params.id;
    let sql = `SELECT * FROM BankUser WHERE Id = ?`;

    db.all(sql, [Id], (err, bankUser) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(bankUser.length) {
            res.status(200).json({ bankUser });
        } else {
            res.status(404).json({ message: `No bank user with the following id: ${Id}` });
        }
    });
});

// Read bank user with specific uid
app.get("/api/bank/users/uid/:id", (req, res) => {
    let Id = req.params.id;
    let sql = `SELECT * FROM BankUser WHERE UserId = ?`;

    db.all(sql, [Id], (err, bankUser) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(bankUser.length) {
            res.status(200).json({ bankUser });
        } else {
            res.status(404).json({ message: `No bank user with the following id: ${Id}` });
        }
    });
});

// Update bank user with specific id
app.put("/api/bank/users/:id", (req, res) => {
    let Id = req.params.id;
    let UserId = req.body.UserId;
    let today = new Date().toLocaleString();
    let readSql = `SELECT * FROM BankUser WHERE Id = ?`;
    let updateSql = `UPDATE BankUser SET UserId = ?, ModifiedAt = ? WHERE Id = ?`;
    db.all(readSql, [Id], (err, BankUser) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(!BankUser.length) {
            res.status(404).json({ message: `No bank user with the following id: ${Id}` });

        } else {
            db.run(updateSql, [UserId, today, Id], (err) => {
                if (err) {
                    res.status(400).json({ message: `Failed at updating bank user with ${Id}`, error: err.message });
                } else {
                    res.status(201).json({ message: 'Bank user was updated successfully'});
                }
            });
        }
    });
});

// Delete bank user with specific id
app.delete("/api/bank/users/:id", (req, res) => {

    let Id = req.params.id;
    let readSql = `SELECT * FROM BankUser WHERE Id = ?`;
    let deleteSql = `DELETE FROM BankUser WHERE Id = ?`;

    db.all(readSql, [Id], (err, BankUser) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(!BankUser.length) {
            res.status(404).json({ message: `No bank user with the following id: ${Id}` });
        } else {
            db.run(deleteSql, Id, (err) => {
                if (err) {
                    res.status(400).json({ message: 'Failed at deleting bank user', error: err.message });

                } else {
                    res.status(201).json({ message: 'Bank user deleted successfully' });
                }
            });
        }
    });
});

// Create account
app.post('/api/bank/accounts', (req, res) => {

    let BankUserId = req.body.BankUserId;
    let AccountNo = req.body.AccountNo;
    let IsStudent = req.body.IsStudent;
    let InterestRate = req.body.InterestRate;
    let Amount = req.body.Amount;
    let today = new Date().toLocaleString();

    let readUserSql = `SELECT * FROM BankUser WHERE Id = ?`;
    let readAccountSql = `SELECT * FROM Account WHERE BankUserId = ?`;
    let accountSql = `INSERT INTO Account(BankUserId, AccountNo, IsStudent, CreatedAt, ModifiedAt, InterestRate, Amount) VALUES(?, ?, ?, ?, ?, ?, ?)`;

    db.all(readUserSql, [BankUserId], (err, BankUser) => {

        if (err) {
            res.status(400).json({ error: err });
        }
        if(!BankUser.length) {
            res.status(404).json({ message: `No bank user with the following id: ${BankUserId}` });
        
        } else {
            db.all(readAccountSql, [BankUserId], (err, Account) => {
                if(err){
                    res.status(400).json({ error: err })
                }
                if(Account.length){
                    res.status(400).json({ message: `Bank user already has an existing account`})

                } else {
                    db.run(accountSql, [BankUserId, AccountNo, IsStudent, today, today, InterestRate, Amount], (err) => {

                        if (err) {
                            res.status(400).json({ message: 'Failed at creating account', error: err.message });
                            
                        } else {
                            res.status(201).json({ message: 'Account created successfully'});
                        }
                    });
                }
            });     
        }
    });
});

// Read accounts
app.get("/api/bank/accounts", (req, res) => {

    let sql = `SELECT * FROM Account`;

    db.all(sql, [], (err, Accounts) => {
        if (err) {
            res.status(400).json({ message: 'Failed at reading accounts', error: err });

        } else {
            res.status(200).json({ Accounts });
        }
    });
});

// Read account with specific id
app.get("/api/bank/accounts/:id", (req, res) => {
    let Id = req.params.id;
    let sql = `SELECT * FROM Account WHERE Id = ?`;

    db.all(sql, [Id], (err, Account) => {
        if (err) {
            res.status(400).json({ error: err });

        }
        if(Account.length) {
            res.status(200).json({ Account });

        } else {
            res.status(404).json({ message: `No account with the following id: ${Id}` });
        }
    });
});

// Read account with specific user id
app.get("/api/bank/accounts/uid/:uid", (req, res) => {
    let Id = req.params.uid;
    let sql = `SELECT * FROM Account WHERE BankUserId = ?`;

    db.all(sql, [Id], (err, Account) => {
        if (err) {
            res.status(400).json({ error: err });

        }
        if(Account.length) {
            res.status(200).json({ Account });

        } else {
            res.status(404).json({ message: `No account with the following user id: ${Id}` });
        }
    });
});



// Update account with specific id
app.put("/api/bank/accounts/:id", (req, res) => {

    let Id = req.params.id;
    let BankUserId = req.body.BankUserId;
    let AccountNo = req.body.AccountNo;
    let IsStudent = req.body.IsStudent;
    let InterestRate = req.body.InterestRate;
    let Amount = req.body.Amount;
    let today = new Date().toLocaleString();
    
    let readSql = `SELECT * FROM Account WHERE Id = ?`;
    let updateSql = `UPDATE Account SET BankUserId = ?, AccountNo = ?, 
                        IsStudent = ?, ModifiedAt = ?, InterestRate = ?, 
                        Amount = ? WHERE Id = ?`;

    db.all(readSql, [Id], (err, Account) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(!Account.length) {
            res.status(404).json({ message: `No account with the following id: ${Id}` });

        } else {

            db.run(updateSql, [BankUserId, AccountNo, IsStudent, today, InterestRate, Amount, Id], (err) => {
                if (err) {
                    res.status(400).json({ message: 'Failed at updating account', error: err.message });
                } else {
                    res.status(201).json({ message: 'Account was updated successfully'});
                }
            });
        }
    });
});

// Delete account with specific id
app.delete("/api/bank/accounts/:id", (req, res) => {

    let Id = req.params.id;
    let readSql = `SELECT * FROM Account WHERE Id = ?`;
    let deleteSql = `DELETE FROM Account WHERE Id = ?`;

    db.all(readSql, [Id], (err, Account) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(!Account.length) {
            res.status(404).json({ message: `No account with the following id: ${Id}` });

        } else {
            db.run(deleteSql, Id, (err) => {
                if (err) {
                    res.status(400).json({ message: 'Failed at deleting account', error: err.message });

                } else {
                    res.status(201).json({ message: 'Account was deleted successfully' });
                }
            });
        }
    });
});

// Implement '/add-deposit' endpoint 
app.post("/api/bank/add-deposit", (req, res) => {
    let Amount = req.body.Amount;
    let BankUserId = req.body.BankUserId;
    let readUserSql = `SELECT * FROM BankUser WHERE Id = ?`;
    let readAccountSql = `SELECT * FROM Account WHERE BankUserId = ?`;
    let updateAccountSql = `UPDATE Account SET ModifiedAt = ?, Amount = ? WHERE BankUserId = ?`;
    let createDepositSql = `INSERT INTO Deposit(BankUserId, CreatedAt, Amount) VALUES(?, ?, ?)`;

    db.all(readUserSql, [BankUserId], (err, BankUser) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(!BankUser.length) {
            res.status(404).json({ message: `No bank user with the following id: ${BankUserId}` });

        } else {
            if (Amount === null || Amount <= 0) {
                res.status(404).json({ message: 'Amount deposited cannot be null or negative' });

            } else {
                axios.post('http://localhost:7071/api/Interest_Rate', {depositAmount: Amount}).then(response =>{
                    let result = response.data.amount;
                    let today = new Date().toLocaleString();

                    db.all(readAccountSql, [BankUserId], (err, Account) => {
                        if(err){
                            res.status(400).json({ error: err })
                        }
                        if(!Account.length){
                            res.status(404).json({ message: `No account with the following bank user id: ${BankUserId}`})
                        } else {
                            let accountAmount = Account[0].Amount;
                            let newAmount = accountAmount + result;
            
                            db.run(updateAccountSql, [today, newAmount, BankUserId], (err) => {
                                if (err) {
                                    res.status(400).json({ message: 'Failed at updating account', error: err });
                                } else {

                                    db.run(createDepositSql, [BankUserId, today, result], (err) => {
                                        if (err) {
                                            res.status(400).json({ message: 'Failed at creating deposit', error: err });
                                        } else {
                                            res.status(201).json({ message: 'Deposit was created successfully' });
                                        }
                                    });
                                }
                            });
                        }
                    });

                }).catch(err =>{
                    if(err){
                        res.status(400).json({ error: err });
                    }
                });
            }
        }
    });
});

// Implement '/list-deposits' endpoint
app.get("/api/bank/list-deposits/:id", (req, res) => {
    let BankUserId = req.params.id;
    let sql = `SELECT * FROM Deposit WHERE BankUserId = ?`;

    db.all(sql, [BankUserId], (err, deposits) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(deposits.length) {
            res.status(200).json({ deposits });
        } else {
            res.status(404).json({ message: `No deposits for bank user with following id: ${BankUserId}` });
        }
        
    });
});

// Implement '/create-loan' endpoint
app.post("/api/bank/create-loan", (req, res) => {
    let BankUserId = req.body.BankUserId;
    let LoanAmount = req.body.LoanAmount;
    let today = new Date().toLocaleString();
    let readBankUserSql = `SELECT * FROM BankUser WHERE Id = ?`;
    let readLoanSql = `SELECT * FROM Loan WHERE BankUserId = ? AND AMOUNT != 0`;
    let createLoanSql = `INSERT INTO Loan(BankUserId, CreatedAt, ModifiedAt, Amount) VALUES(?, ?, ?, ?)`;

    db.all(readBankUserSql, [BankUserId], (err, BankUser) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if(!BankUser.length) {
            res.status(404).json({ message: `No bank user with the following id: ${BankUserId}` });

        } else {
            // Check that the bank user doesn't already have an existing unpaid loan
            db.all(readLoanSql, [BankUserId], (err, Loan) => {
                if (err) {
                    res.status(400).json({ error: err });
                }
                if(Loan.length) {
                    res.status(400).json({ message: `Bank user already has an existing loan` });
                
                } else {
                    // Find the total amount for the specific user's account
                    axios.get(`http://localhost:5000/api/bank/accounts/uid/${BankUserId}`).then(response => {
                        let accounts = response.data.Account;
                        let amount;
                        for (i = 0; i < accounts.length; i++) {
                            amount = accounts[i].Amount;
                        }
                    
                        // Create loan if it doesn't exceed 75% of the account amount
                        axios.post(`http://localhost:7071/api/Loan_Algorithm`, {"loan": LoanAmount, "amount": amount})
                        .then((response) => {
                            db.run(createLoanSql, [BankUserId, today, today, LoanAmount], (err) => {
                                if (err) {
                                    res.status(400).json({ message: 'Failed to create loan', error: err.message });
                                } else {
                                    res.status(201).json({ message: 'The loan was created successfully' });
                                }
                            });
                        }, (err) => {
                            res.status(403).json({ message: 'The loan exceeds 75% of the account amount', error: err });
                        });
                    }).catch(err =>{
                        if(err){
                            res.status(400).json({ message: `Failed to get bank user ${BankUserId}'s total account amount`, error: err });
                        }
                    });

                }
            });

            
        }
    });
});


// Implement '/pay-loan' endpoint
app.put("/api/bank/pay-loan", (req, res) => {
    let BankUserId = req.body.BankUserId;
    let LoanId = req.body.LoanId;
    let readLoanSql = `SELECT * FROM Loan WHERE Id = ?`;
    let updateAccountSql = `UPDATE Account SET Amount = ?, ModifiedAt = ? WHERE Id = ?`;
    let updateLoanSql = `UPDATE Loan SET Amount = ?, ModifiedAt = ? WHERE Id = ?`;

    // Find all the users accounts
    axios.get(`http://localhost:5000/api/bank/accounts/uid/${BankUserId}`).then(response => {
        
        let accounts = response.data.Account;
     

        let today = new Date().toLocaleString();

        // Find the bank user's loan amount
        db.all(readLoanSql, [LoanId], (err, Loan) => {
            if (err) {
                res.status(400).json({ error: err });

            }
            if(!Loan.length) {
                res.status(404).json({ message: `No loan with the following id: ${LoanId}` });

            } else {
                let accountTotal = accounts[0].Amount;
                let loanAmount = Loan[0].Amount;
                let updatedAmount = accountTotal - loanAmount;

                if (accountTotal < loanAmount) {
                    res.status(400).json({ message: 'Insufficient funds in bank account' });
                } else {

                    // Subtract the loan amount from the user account, and update the loan amount to 0
                    db.run(updateAccountSql, [updatedAmount, today, accounts[0].Id], (err) => {
                        if (err) {
                            res.status(400).json({ message: 'Failed at updating account', error: err });
                        } else {
                            db.run(updateLoanSql, [0, today, LoanId], (err) => {
                                if (err) {
                                    res.status(400).json({
                                        message: 'Failed at updating loan',
                                        error: err.message
                                    });
                                } else {
                                    res.status(201).json({ message: 'The loan was paid successfully' });
                                }
                            });
                        }
                    });
                }
            }
        });
        
    }).catch(err =>{
        if(err){
            res.status(400).json({ message: `Failed to get bank user ${BankUserId}'s accounts`, error: err });
        }
        if(!accounts.length) {
            res.status(404).json({ message: `No account with the following id: ${req.params.id}` });
        }
    });
});


// Implement '/list-loans' endpoint
app.get("/api/bank/list-loans/:id", (req, res) => {
    let BankUserId = req.params.id;
    let sql = `SELECT * FROM Loan WHERE BankUserId = ?`;
    db.all(sql, [BankUserId], (err, Loans) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        if (!Loans.length) {
            res.status(400).json({ message: `This user doesn't have any loans` });

        } else {
            let unpaidLoans = [];

            for (i = 0; i < Loans.length; i ++){
                if(Loans[i].Amount !== 0){
                    unpaidLoans.push(Loans[i]);
                };
            }
            res.status(200).json({ loans: unpaidLoans });
        }
    });
});

// Implement '/withdrawl-money' endpoint
app.post("/api/bank/withdrawl-money", (req, res) => {
    let WithdrawlAmount = req.body.Amount;
    let UserId = req.body.UserId;
    let readAccountSql = `SELECT * FROM Account WHERE BankUserId = ?`;
    let updateAccountSql = `UPDATE Account SET Amount = ?, ModifiedAt = ? WHERE Id = ?`;

    axios.get(`http://localhost:5000/api/bank/users/uid/${UserId}`).then(response => {

        let User = response.data.bankUser;

        db.all(readAccountSql, [User[0].Id], (err, account) => {
            if (err) {
                res.status(400).json({ error: err });
            }
            if(!account.length) {
                res.status(404).json({ message: `Bank user with the following id: ${User.Id}, has no account` });
                
            } else {
                let id = account[0].Id;
                let accountAmount = account[0].Amount;
                let withdrawl = false;

                if (accountAmount - WithdrawlAmount >= 0) {
                    withdrawl = true;
                }

                if (withdrawl) {
                    let finalAccountAmount = accountAmount - WithdrawlAmount;
                
                    let today = new Date().toLocaleString();

                    db.run(updateAccountSql, [finalAccountAmount, today, id], (err) => {
                        if (err) {
                            res.status(400).json({ message: 'Failed at withdrawing money', error: err });

                        } else {
                            res.status(201).json({ message: 'Withdrawl was done successfully' });
                        }
                    });
                } else {
                    res.status(404).json({ message: `Bank user doesn't have enough money on the account` });
                }
            }
        });
        
    }).catch(err =>{
        if(err){
            res.status(400).json({ message: `Failed to find bank user with user id: ${UserId}`, error: err });
        }
    });
});



