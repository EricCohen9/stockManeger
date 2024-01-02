import pool from "../PostgreSQL/PostgreSQL";
import { UserInterface } from "../interfaces/userInterface";
import { comparePassword } from "../bycrypt/bycrypt";
import db from "../PostgreSQL/PostgreSQL";
export async function createUsersTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        isadmin BOOLEAN DEFAULT false,
        resetcode VARCHAR (255),
        registration_time TIMESTAMP
        )
    `);
    console.log("Users table created or already exists.");
  } catch (error) {
    console.error("Error creating users table:", (error as Error).message);
  }
}
export async function registerDal(
  user: UserInterface
): Promise<UserInterface | null> {
  const client = await pool.connect();

  try {
    const existingUserCheck = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [user.email]
    );

    if (existingUserCheck.rows.length > 0) {
      throw new Error("User with this email already exists.");
    }
    const result = await client.query(
      "INSERT INTO users (email, password, isadmin) VALUES ($1, $2, $3) RETURNING *",
      [user.email, user.password, user.isadmin || false]
    );

    if (result.rows.length > 0) {
      const insertedUser: UserInterface = result.rows[0];
      const result1 = await client.query(`
      SELECT * FROM login_logs
      `);
      if (result1.rows.length > 0) {
        // console.log(result1.rows);
      } else {
        // console.log("No login logs found.");
      }
      // console.log(result1);
      
      return insertedUser;
    } else {
      console.error("Error inserting user into the table.");
      return null;
    }
  } catch (error) {
    console.error("Error adding user to the table:", (error as Error).message);
    throw error;
  } finally {
    client.release();
  }
}
export async function forgotPasswordDal(email: string, code: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE users SET resetcode = $1 WHERE email = $2 RETURNING *",
      [code, email]
    );

    if (result.rows.length > 0) {
      const insertedUser: UserInterface = result.rows[0];
      return insertedUser;
    } else {
      console.error("Error inserting user into the table.");
      return null;
    }
  } catch (error) {
    console.error("Error adding code to the table:", (error as Error).message);
    throw error;
  } finally {
    client.release();
  }
}
export async function comperepasswordDal(email: string, newPassword: string) {
  try {
    const result = await pool.query(
      "SELECT resetcode FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 1) {
      const resetCodeFromDB = result.rows[0].resetcode;
      const isMatch = resetCodeFromDB === newPassword;
      if (isMatch) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}
export async function resetPasswordDal(email: string, newPassword: string) {
  console.log(newPassword, "new");
  const client = await pool.connect();
  try {
    await client.query(
      "UPDATE users SET password = $1, resetcode = NULL WHERE email = $2",
      [newPassword, email]
    );
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  } finally {
    client.release();
  }
}
export async function loginDal(userEmail: string, userPassword: string) {
  const client = await pool.connect();
  try {
    const result = (await client.query(
      "SELECT * FROM users WHERE email = $1 ",
      [userEmail]
    )) as { rows: UserInterface[] };

    if (result.rows.length > 0) {
      const userById: UserInterface = result.rows[0];
      console.log("user");
      if (comparePassword(userPassword, userById.password as string)) {
        console.log(userById);
        return userById;
      }
    } else {
      console.error("Incorrect email or password");
      return null;
    }
  } catch (error) {
    console.error("Error getting user by ID:", (error as Error).message);
    return null;
  } finally {
    client.release();
  }
}

export const getUserById = async (userId: string) => {
  const client = await pool.connect();
  try {
    const { rows: user } = await client.query(
      "SELECT * FROM users WHERE id=$1",
      [userId]
    );
    return user;
  } catch (error) {
    console.error("Error executing SQL query:", error);
  } finally {
    client.release();
  }
};

export const getAllUsersDal = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    console.error("Error executing SQL query:", error);
  } finally {
    client.release();
  }
};

export const deleteUserByIdDal = async (id: number): Promise<void> => {
  const client = await pool.connect();
  console.log(id);

  try {
    const deleteUser = await client.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);
    console.log(`User with id ${id} has been deleted.`);
    if (deleteUser.rowCount === 0) {
      console.log(`Order with ID ${id} not found`);
      throw new Error(`Order with ID ${id} not found!`);
    }
  } catch (error) {
    console.error("Error deleting user:", (error as Error).message);
    throw error;
  } finally {
    client.release();
  }
};
// createUsersTable();
async function createLoginTrigger() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_logs (
        log_id SERIAL PRIMARY KEY,
        user_id INTEGER,
        login_time TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE  FUNCTION log_user_login()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO login_logs (user_id, login_time) 
        VALUES (NEW.id, CURRENT_TIMESTAMP);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    const result = await pool.query(`
    SELECT *
    FROM information_schema.triggers
    WHERE trigger_name = 'user_login_trigger'
  `);
    if (result.rowCount === 0) {
      await pool.query(`
      CREATE TRIGGER user_login_trigger
      AFTER INSERT 
      ON users
      FOR EACH ROW
      EXECUTE PROCEDURE log_user_login();
    `);
    }
    await client.query("COMMIT");
  } catch (eror) {
    await client.query("ROLLBACK");
    throw eror;
  } finally {
    client.release();
  }
}
// createLoginTrigger();
export const getTimeRegisterDal = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXTRACT(HOUR FROM login_time) AS hour, COUNT(*) AS registrations
      FROM login_logs
      GROUP BY hour
      ORDER BY hour;
    `);
    // console.log(result.rows);

    const countHours = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    result.rows.forEach((entry) => {
      const hour: number = Number(entry.hour);
      const registrations: number = Number(entry.registrations);
      countHours[hour] += registrations;
    });
    // console.log(countHours);
    return countHours;
  } catch (error) {
    console.error("Error executing SQL query:", error);
  } finally {
    client.release();
  }
};
