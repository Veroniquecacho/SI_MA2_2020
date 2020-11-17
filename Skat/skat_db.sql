CREATE TABLE IF NOT EXISTS SkatUser(
    [Id] INTEGER PRIMARY KEY AUTOINCREMENT,
   	[UserId] INTEGER NOT NULL,
	[CreatedAt] DATETIME DEFAULT CURRENT_TIMESTAMP,
    [IsActive] INTEGER DEFAULT 1
);


CREATE TABLE IF NOT EXISTS SkatUserYear(
    [Id] INTEGER PRIMARY KEY AUTOINCREMENT,
   	[SkatUserId] INTEGER NOT NULL,
    [SkatYearId] INTEGER NOT NULL,
    [UserId] INTEGER NOT NULL,
    [IsPaid] INTEGER DEFAULT 0,
	[Amount] DECIMAL NOT NULL
);


CREATE TABLE IF NOT EXISTS SkatYear(
    [Id] INTEGER PRIMARY KEY AUTOINCREMENT,
   	[Label] VARCHAR NOT NULL,
	[CreatedAt] DATETIME DEFAULT CURRENT_TIMESTAMP,
    [ModifiedAt] DATETIME DEFAULT CURRENT_TIMESTAMP,
    [StartDate] DATETIME NOT NULL,
    [EndDate] DATETIME NOT NULL
);
