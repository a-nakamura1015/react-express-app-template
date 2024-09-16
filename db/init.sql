-- Create 'users' table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Create 'posts' table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data into 'users' table
INSERT INTO users (name, email) VALUES 
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com');

-- Insert sample data into 'posts' table
INSERT INTO posts (user_id, title, content) VALUES
(1, 'Alice\'s First Post', 'This is the content of Alice\'s first post.'),
(1, 'Alice\'s Second Post', 'This is the content of Alice\'s second post.'),
(2, 'Bob\'s First Post', 'This is the content of Bob\'s first post.');
