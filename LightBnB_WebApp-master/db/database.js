const { Pool } = require("pg");
const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { query } = require("express");

const pool = new Pool({
  database: 'lightbnb'
});



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let queryString = `SELECT * FROM users WHERE email = $1`;
  let queryParams = [email];
  return pool.query(queryString, queryParams)
    .then((result) => {
      console.log(result);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log('Error getting user: ', err.message);
    });
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  let queryString = `SELECT * FROM users WHERE id = $1`;
  let queryParams = [id];
  return pool.query(queryString, queryParams)
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  let queryString = `INSERT INTO users(name, password, email) VALUES ($1, $2, $3) RETURNING *`;
  let queryParams = [user.name, user.password, user.email];
  return pool.query(queryString, queryParams)
    .then((result) => {
      const newUser = result.rows[0];
      return newUser;
    })
    .catch((err) => console.log(`error adding: `, err));
};


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  let queryString = `SELECT
        reservations.*,
        properties.*,
        avg(rating) as average_rating
      FROM
        reservations
        JOIN properties ON reservations.property_id = properties.id
        JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE
        reservations.guest_id = $1
      GROUP BY
        properties.id,
        reservations.id
      ORDER BY
        reservations.start_date
      LIMIT
        $2`;

  return pool.query(queryString, [guest_id, limit])
    .then((result) => {
      console.log(`result is : `, result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(`Error retreiving reservations. `, err.message);
    });
};



/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `SELECT
                properties.*,
                avg(property_reviews.rating)
              FROM
                properties
                JOIN property_reviews on properties.id = property_reviews.property_id `;

  const conditions = [];

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    conditions.push(`city LIKE $${queryParams.length}`);
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    conditions.push(`owner_id = $${queryParams.length}`);
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    conditions.push(`cost_per_night >= $${queryParams.length}`);
  }
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    conditions.push(`cost_per_night <= $${queryParams.length}`);
  }

  if (conditions.length > 0) {
    queryString += 'WHERE ' + conditions.join(' AND ') + ' ';
  }

  
  queryString += `
        GROUP BY properties.id `;


  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString +=
    `ORDER BY cost_per_night
        LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
