## Setting up the SQL Server Database

1. run "docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourPassword" -p 1450:1433 -d mcr.microsoft.com/mssql/server:2022-latest" to create database image in docker. 
2. Open **SQL Server Management Studio (SSMS)**, connect to the image you created by connection to localhost,1450 with sa and YourPassword.
3. Either open `script.sql` inside the backup folder and run it to populate tables and data or use .bak file to restore the database.
4. Make sure your `.env` file in cour backend folder has the correct settings to connect to the dockerized database:

DB_USER=sa
DB_PASSWORD=YourPassword
DB_SERVER=host.docker.internal
DB_DATABASE=ColorBlindTest
DB_PORT=1450
