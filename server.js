const express = require('express');
const mongoose = require('mongoose');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const User = require('./models/user'); // User schema
const Item = require('./models/item'); // Inventory item schema

const app = express();

const bcrypt = require('bcrypt');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    name: 'session',
    keys: ['yourSecretKey'], // Replace with your own secret key
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.set('view engine', 'ejs');

// Connect to MongoDB (Direct Connection URI)
mongoose.connect('mongodb+srv://leolai9321:leolai9321@cluster0.qizn5.mongodb.net/users?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Routes
// Render Login Page
app.get('/login', (req, res) => {
    res.render('login', {error:null});
});

// Handle Login Submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.authenticated = true;
            req.session.username = username;
            res.redirect('/inventory');
        } else {
            // Render the login page with an error message
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        // Handle internal server error
        res.render('login', { error: 'Internal server error' });
    }
});

//Create a User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({ username, password: hashedPassword }); // Save hashed password
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Internal server error');
    }
});


// Logout

app.get('/', (req, res) => {
    req.session = null; // Destroy the session
    res.redirect('/login');
});

app.get('/logout', (req, res) => {
    req.session = null; // Destroy the session
    res.redirect('/login');
});

app.get('/inventory', isAuthenticated, async (req, res) => {
    try {
        const items = await Item.find(); // Fetch all inventory items
        res.render('inventory', { items, username: req.session.username }); // Pass username
    } catch (err) {
        console.error('Error fetching inventory:', err);
        res.status(500).send('Internal server error');
    }
});

// Inventory Management Routes
app.get('/inventory', isAuthenticated, async (req, res) => {
    const items = await Item.find(); // Fetch all inventory items
    res.render('inventory', { items });
});

app.post('/inventory', isAuthenticated, async (req, res) => {
    const { name, quantity, price, category } = req.body;
    await new Item({ name, quantity, price, category }).save();
    res.redirect('/inventory');
});

app.post('/inventory/update/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, category } = req.body;
    await Item.findByIdAndUpdate(id, { name, quantity, price, category });
    res.redirect('/inventory');
});

app.post('/inventory/delete/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.redirect('/inventory');
});

app.post('/inventory/update/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, category } = req.body;
    try {
        await Item.findByIdAndUpdate(id, { name, quantity, price, category });
        res.redirect('/inventory');
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).send('Failed to update the item');
    }
});

// 1. GET /api/inventory - Retrieve all inventory items
app.get('/api/inventory', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items); // Respond with a JSON array of items
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
});

// 2. GET /api/inventory/:id - Retrieve a specific item by ID
app.get('/api/inventory/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item); // Respond with the item
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch the item' });
    }
});

// 3. POST /api/inventory - Add a new inventory item
app.post('/api/inventory', async (req, res) => {
    const { name, quantity, price, category } = req.body;
    try {
        const newItem = new Item({ name, quantity, price, category });
        await newItem.save();
        res.status(201).json(newItem); // Respond with the newly created item
    } catch (err) {
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
});

// 4. PUT /api/inventory/:id - Update an existing item by ID
app.put('/api/inventory/:id', async (req, res) => {
    const { name, quantity, price, category } = req.body;
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { name, quantity, price, category },
            { new: true } // Return the updated document
        );
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(updatedItem); // Respond with the updated item
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the item' });
    }
});

// 5. DELETE /api/inventory/:id - Delete an inventory item by ID
app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the item' });
    }
});


// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
