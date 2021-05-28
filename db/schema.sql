USE election;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS emp_role;
DROP TABLE IF EXISTS department;


CREATE TABLE department(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);


CREATE TABLE emp_role(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,   
    title VARCHAR(30) NOT NULL,
    salary decimal(10.2) ,
    department_id INTEGER ,
    FOREIGN KEY (department_id) REFERENCES department(id)
);


CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL
    FOREIGN KEY (role_id) REFERENCES emp_role(id),
    manager_id INTEGER,
    FOREIGN KEY (manager_id) REFERENCES employee(first_name);
);