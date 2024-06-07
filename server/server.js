const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // Import the crypto module
const winston = require('winston');

const app = express();
const port = 5000;

// Use cors middleware to enable CORS with various options
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Configure Winston for logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// MySQL database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'mahal-apshin', // Update with your MySQL username
    password: 'Jan@799746', // Update with your MySQL password
    database: 'userbooks' // Update with your MySQL database name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        logger.error(`Error connecting to the database: ${err.message}`);
        return;
    }
    logger.info('Connected to the database');
});

// Define API endpoint to add a book
app.post('/api/books', (req, res) => {
    console.log('Received book creation request:', req.body);
    const { title, author, image, description, visibility, userId, chapters } = req.body;

    // Check if userId is provided in the request body
    if (!userId) {
        res.status(400).send('userId is required');
        return;
    }

    // Store the book data in the books table
    const bookData = {
        title: title,
        author: author,
        image: image,
        description: description,
        visibility: visibility,
        userId: userId, // Associate the book with the correct user
        chapters: JSON.stringify(chapters)
    };

    // Insert the book data into the books table
    const sql = 'INSERT INTO books SET ?';
    db.query(sql, bookData, (err, result) => {
        if (err) {
            logger.error(`Error adding book: ${err.message}`);
            res.status(500).send('Error adding book');
            return;
        }
        logger.info('Book added successfully');
        res.status(201).send('Book added');
    });
});

// Define API endpoint for user registration (including hashing the password)
const { v4: uuidv4 } = require('uuid');
app.post('/api/register', (req, res) => {
    console.log('Received registration request:', req.body);
    const { username, email, phone, password } = req.body;
    // Generate a unique UUID as the user ID
    const userId = uuidv4();
    console.log('Generated userId:', userId);
    // Generate a unique salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the password with SHA-256 and the salt
    const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');

    // Store the user data in the userinfo table
    const userData = {
        id: userId,
        username: username,
        email: email,
        phone: phone,
        password: hashedPassword,
        salt: salt
    };

    const sql = 'INSERT INTO userinfo SET ?';
    db.query(sql, userData, (err, result) => {
        if (err) {
            logger.error(`Error registering user: ${err.message}`);
            res.status(500).send('Error registering user');
            return;
        }
        logger.info('User registered successfully');
        res.status(201).send('User registered successfully');
    });
});

// Define API endpoint for user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to retrieve user data based on username
    const sql = 'SELECT id, username, salt, password FROM userinfo WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            logger.error(`Error retrieving user data: ${err.message}`);
            res.status(500).send('Error retrieving user data');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const user = results[0];
        const hashedPassword = crypto.createHash('sha256').update(password + user.salt).digest('hex');

        if (hashedPassword === user.password) {
            // Passwords match, login successful
            res.status(200).json({ username: user.username, userId: user.id });
        } else {
            // Passwords don't match, login failed
            res.status(401).send('Incorrect password');
        }
    });
});

// Define API endpoint to fetch books
app.get('/api/books', (req, res) => {
    const { userId } = req.query; // Assuming userId is included in the request query
    const sql = userId ? 'SELECT * FROM books WHERE visibility = "public" OR (visibility = "private" AND userId = ?)' : 'SELECT * FROM books WHERE visibility = "public"';
    const params = userId ? [userId] : [];

    db.query(sql, params, (err, results) => {
        if (err) {
            logger.error(`Error fetching books: ${err.message}`);
            res.status(500).send('Error fetching books');
            return;
        }
        res.status(200).json(results);
    });
});

// Define API endpoint to fetch book details by title
app.get('/api/books/:title', (req, res) => {
    const title = req.params.title;
    const sql = 'SELECT * FROM books WHERE title = ?';

    db.query(sql, [title], (err, result) => {
        if (err) {
            logger.error(`Error fetching book details: ${err.message}`);
            res.status(500).send('Error fetching book details');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Book not found');
            return;
        }
        res.status(200).json(result[0]);
    });
});

// Define API endpoint to update a book
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { description, chapters } = req.body;

    // Check if the description is provided in the request body
    if (!description) {
        res.status(400).send('Description is required');
        return;
    }

    // Update the book's description in the database
    const sql = 'UPDATE books SET description = ?, chapters = ? WHERE id = ?';
    db.query(sql, [description, JSON.stringify(chapters), id], (err, result) => {
        if (err) {
            logger.error(`Error updating book: ${err.message}`);
            res.status(500).send('Error updating book');
            return;
        }
        logger.info('Book updated successfully');
        res.status(200).send('Book updated');
    });
});

// Define API endpoint to fetch chapters by book ID
app.get('/api/books/:id/chapters', (req, res) => {
  const bookId = req.params.id;
  const sql = 'SELECT chapters FROM books WHERE id = ?';

  db.query(sql, [bookId], (err, result) => {
      if (err) {
          logger.error(`Error fetching chapters: ${err.message}`);
          res.status(500).send('Error fetching chapters');
          return;
      }
      if (result.length === 0) {
          res.status(404).send('Chapters not found for the book');
          return;
      }
      // Send the chapters data as JSON
      res.status(200).json(result[0].chapters);
  });
});

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
