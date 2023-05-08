const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to Postgres DB");
  //   const data = await pool.query(
  //     'CREATE TABLE IF NOT EXISTS cards (card_id int generated always as identity,user_id int, company varchar not null, description varchar not null, notes varchar, status varchar not null default "Pending", created_at timestamp default current_timestamp, primary key(card_id), constraint fk_user foreign key(user_id) references users(user_id));'
  //   );
});

module.exports = {
  pool,
};
