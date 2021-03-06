
CREATE TABLE IF NOT EXISTS BankUser (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	UserId INTEGER NOT NULL,
	CreatedAt DATETIME NOT NULL,
    ModifiedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS Account (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	BankUserId INTEGER NOT NULL,
    AccountNo INTEGER NOT NULL,
    IsStudent INTEGER DEFAULT 1,
	CreatedAt DATETIME NOT NULL,
    ModifiedAt DATETIME NOT NULL,
    InterestRate DECIMAL(2) NOT NULL,
    Amount DECIMAL(2) NOT NULL,
	FOREIGN KEY (BankUserId) REFERENCES BankUser(Id)
);


CREATE TABLE IF NOT EXISTS Loan (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	BankUserId INTEGER NOT NULL,
	CreatedAt DATETIME NOT NULL,
    ModifiedAt DATETIME NOT NULL,
    Amount DECIMAL(2) NOT NULL,
	FOREIGN KEY (BankUserId) REFERENCES BankUser(Id)
);


CREATE TABLE IF NOT EXISTS Deposit (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	BankUserId INTEGER NOT NULL,
	CreatedAt DATETIME NOT NULL,
    Amount DECIMAL(2) NOT NULL,
	FOREIGN KEY (BankUserId) REFERENCES BankUser(Id)
);