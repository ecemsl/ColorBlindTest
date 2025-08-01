## Setting up the SQL Server Database

1. Open **SQL Server Management Studio (SSMS)**
2. Create a new database
3. Open `DB.sql` inside backend and run it to populate tables and data
4. Make sure your `.env` file has the correct settings for your local SQL Server:


## Inside the backend folder:
```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_SERVER=localhost\\SQLEXPRESS
DB_DATABASE=ColorBlindTest
DB_PORT=1433