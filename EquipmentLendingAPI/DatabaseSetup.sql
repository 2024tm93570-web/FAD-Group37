-- Database Setup Script for Equipment Lending System
-- Run this script in SQL Server Management Studio or Azure Data Studio
-- Make sure to update the connection string in appsettings.json to match your server name

USE master;
GO

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EqpLending')
BEGIN
    CREATE DATABASE EqpLending;
END
GO

USE EqpLending;
GO

-- Create Roles table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE Roles (
        RoleId INT PRIMARY KEY IDENTITY(1,1),
        RoleName NVARCHAR(50) NOT NULL UNIQUE
    );

    -- Insert default roles
    INSERT INTO Roles (RoleName) VALUES ('Admin');
    INSERT INTO Roles (RoleName) VALUES ('Staff');
    INSERT INTO Roles (RoleName) VALUES ('LabAssistant');
    INSERT INTO Roles (RoleName) VALUES ('Student');
END
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserId INT PRIMARY KEY IDENTITY(1,1),
        FullName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        RoleId INT NOT NULL,
        FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
    );
END
GO

-- Create Equipment table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Equipment')
BEGIN
    CREATE TABLE Equipment (
        EquipmentId INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        Condition NVARCHAR(50) NOT NULL,
        Quantity INT NOT NULL DEFAULT 1,
        Availability BIT NOT NULL DEFAULT 1
    );
END
GO

-- Create EquipmentRequests table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EquipmentRequests')
BEGIN
    CREATE TABLE EquipmentRequests (
        RequestId INT PRIMARY KEY IDENTITY(1,1),
        EquipmentId INT NOT NULL,
        RequestedBy INT NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
        ApprovedBy INT NULL,
        RequestDate DATETIME NOT NULL DEFAULT GETDATE(),
        ReturnDate DATETIME NULL,
        FOREIGN KEY (EquipmentId) REFERENCES Equipment(EquipmentId),
        FOREIGN KEY (RequestedBy) REFERENCES Users(UserId),
        FOREIGN KEY (ApprovedBy) REFERENCES Users(UserId)
    );
END
GO

-- Insert sample data (optional - for testing)
-- Note: Passwords are hashed using BCrypt. Default password for all test users is "password123"
-- You can generate new hashes using the BCrypt.Net library or online BCrypt generators

-- Sample Admin user (password: password123)
-- Hash: $2a$11$KIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXx
-- For production, use actual BCrypt hashes
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@school.com')
BEGIN
    DECLARE @AdminRoleId INT = (SELECT RoleId FROM Roles WHERE RoleName = 'Admin');
    INSERT INTO Users (FullName, Email, PasswordHash, RoleId)
    VALUES ('Admin User', 'admin@school.com', '$2a$11$KIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXx', @AdminRoleId);
END
GO

-- Sample Lab Assistant user (password: password123)
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'lab@school.com')
BEGIN
    DECLARE @LabRoleId INT = (SELECT RoleId FROM Roles WHERE RoleName = 'LabAssistant');
    INSERT INTO Users (FullName, Email, PasswordHash, RoleId)
    VALUES ('Lab Assistant', 'lab@school.com', '$2a$11$KIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXx', @LabRoleId);
END
GO

-- Sample Student user (password: password123)
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'student@school.com')
BEGIN
    DECLARE @StudentRoleId INT = (SELECT RoleId FROM Roles WHERE RoleName = 'Student');
    INSERT INTO Users (FullName, Email, PasswordHash, RoleId)
    VALUES ('Student User', 'student@school.com', '$2a$11$KIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXxKIXx', @StudentRoleId);
END
GO

-- Sample Equipment (optional)
IF NOT EXISTS (SELECT * FROM Equipment WHERE Name = 'Microscope')
BEGIN
    INSERT INTO Equipment (Name, Category, Condition, Quantity, Availability)
    VALUES ('Microscope', 'Lab', 'Good', 5, 1);
END
GO

IF NOT EXISTS (SELECT * FROM Equipment WHERE Name = 'Camera')
BEGIN
    INSERT INTO Equipment (Name, Category, Condition, Quantity, Availability)
    VALUES ('Camera', 'Media', 'Excellent', 3, 1);
END
GO

PRINT 'Database setup completed successfully!';
PRINT 'Note: Default test user passwords need to be set using the registration endpoint or by updating the PasswordHash with actual BCrypt hashes.';
GO

