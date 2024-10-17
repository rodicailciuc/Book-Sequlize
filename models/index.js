import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { DataTypes, Sequelize } from 'sequelize';

// import models
import createUser from './user.js';
import createBook from './book.js';

// construct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// path configuration
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            socketPath: '/tmp/mysql.sock'
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = createUser(sequelize, DataTypes);
db.books = createBook(sequelize, DataTypes);

// one-to-many relationship
db.users.hasMany(db.books, { as: 'books', foreignKey: 'user_id' });
db.books.belongsTo(db.users, { as: 'user', foreignKey: 'user_id' });

db.sequelize.sync({ force: false }).then(() => {
    console.log('yes re-sync done!');
});

export default db;
