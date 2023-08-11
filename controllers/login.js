import bcrypt from 'bcrypt'; // Import bcrypt
import db from '../config/db.js';


/** POST: http://localhost:3000/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    try {

        const { username, password } = req.body;

        // Check Username/Password are present or not 
        if(username===undefined || username==="" || password===undefined || password===""){
            return res.status(400).json({ message: 'Missing Credentials' });
        }
    
        // Retrieve the user based on the username
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
    
        // Check if the user exists
        if (!user) {
          return res.status(400).json({ message: 'User does not exist' });
        }
    
        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(400).json({ message: 'Wrong Password' });
        }
    
        return res.status(200).json({ message: 'Login successful' });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}
  
