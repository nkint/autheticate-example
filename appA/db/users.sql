CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT, -- sha256 hash of the plain-text password
    salt TEXT, -- salt that is appended to the password before it is hashed
    role TEXT
);
INSERT INTO users VALUES(0, "admin", "4ddf3f61c0c2d465dd949cc9fdb4899b02d933d4b2ddb0debb5ec42b9f630999", "foo", "ADMIN"); 
INSERT INTO users VALUES(1, "user", "d8215582333e446fab89b60f1831d12a08fb9a6140c6a0eeca4bc2bdec815a22", "foo1", "USER"); 

-- for testing porpouse both password are 'pass'