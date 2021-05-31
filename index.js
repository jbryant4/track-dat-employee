//npms
const inquirer = require("inquirer");

//questions 
const mainMenu = require('./lib/question');

//conect database
const db = require('./db/connection');
db.connect((err) => {
    if (err) throw err;

    //after connection run your main funtion 
    trackEmp()
})
//query functions 



function trackEmp() {
    console.log(`
        ===============
        Find a employee
        ===============
    
    
    `);

    inquirer
        .prompt(mainMenu).then(answer => {
            switch (answer.userChoice) {
                case 'View all departments':
                    const dep = 'department'
                    viewFunction(dep)
                    break;

                case 'View all roles':
                    let role = 'emp_role'
                    viewFunction(role)
                    break;

                case 'View all employees':
                    const emp = 'employee'
                    viewFunction(emp)
                    break;

                case 'Add a department':
                    addDep()
                    break;

                case 'Add a role':
                    addEmpRole()
                    break;

                case 'Add an employee':
                    addEmp()
                    break;

                case 'Update an employee role':
                    console.log('hi')
                    break;

                case 'Update employee manager':
                    console.log('hi')
                    break;

                case 'View employees by manager':
                    console.log('hi')
                    break;

                case 'View employees by department':
                    console.log('hi')
                    break;

                case 'Delete departments':
                    console.log('hi')
                    break;

                case 'Delete roles':
                    console.log('hi')
                    break;

                case 'Delete employees':
                    console.log('hi')
                    break;
            }
        });
};

//! view function 
function viewFunction(view) {
    const sql = `SELECT * FROM ${view};`;
    // console.log(sql)
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows)
        trackEmp();
    });
};

//! add department function 
function addDep() {
    inquirer
        .prompt({
            type: "input",
            message: "What is the department name you want to add?",
            name: "department",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('You must Answer!!!');
                    return false;
                }
            }
        })
        .then(answer => {
            const sql = `INSERT INTO department (dep_name) VALUES (?);`
            const param = answer.department;

            db.query(sql, param, (err, rows) => {
                if (err) throw err;
                console.log('Success');
                trackEmp();
            })
        })
}


//! add emp role function 
function addEmpRole() {
    db.query(`SELECT * FROM department`, (err, rows) => {
        // we want access to the information in this table so we will run inquirer in this call back function 
        if (err) throw err;
        const activeDeps = rows.map(x => x.dep_name)
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the title of the role you want to add?",
                    name: "title",
                    validate: nameInput => {
                        if (nameInput) {
                            return true;
                        } else {
                            console.log('You must Answer!!!');
                            return false;
                        }
                    }
                },
                {
                    type: "input",
                    message: "What is the salary of this role?",
                    name: "salary",
                    validate: nameInput => {
                        if (nameInput) {
                            return true;
                        } else {
                            console.log('You must Answer!!!');
                            return false;
                        }
                    }
                },
                {
                    type: "list",
                    message: "What depatment is your role in?",
                    name: "department",
                    choices: activeDeps
                }
            ])
            .then(answers => {
                // grab department and us that to return the id in the same row
                const department = answers.department;
                let depId;
                // FOR/OF LOOP: loops through the values of an iterable array 
                for (const row of rows) {
                    if (row.dep_name === department) {
                        depId = row.id;
                    }
                }

                //answers.salary is a sting we need to turn it into a number
                const salary = parseInt(answers.salary)

                const sql = `INSERT INTO emp_role (title, salary, department_id) VALUES (?,?,?);`
                const params = [answers.title, salary, depId]

                db.query(sql, params, (err, rows) => {
                    if (err) throw err;
                    console.log('Success');
                    trackEmp();
                })
            });
    });
}


//! add an emp
function addEmp() {
    db.query(`SELECT * FROM emp_role`, (err, rows) => {
        if (err) throw err;
        const activeRoles = rows.map(x => x.title);

        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName",
                    validate: nameInput => {
                        if (nameInput) {
                            return true;
                        } else {
                            console.log('You must Answer!!!');
                            return false;
                        }
                    }
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName",
                    validate: nameInput => {
                        if (nameInput) {
                            return true;
                        } else {
                            console.log('You must Answer!!!');
                            return false;
                        }
                    }
                },
                {
                    type: "list",
                    message: "What is the employees role?",
                    name: "role",
                    choices: activeRoles
                }
            ]).then(answers => {
                const role = answers.role;
                let roleId;
                // FOR/OF LOOP: loops through the values of an iterable array 
                for (const row of rows) {
                    if (row.title === role) {
                        roleId = row.id;
                    }
                }

                //another query call to get active employee list 
                db.query(`SELECT * FROM employee`, (err2, rows2) => {
                    if (err2) throw err2;
                    const activeEmps = rows2.map(x => x.first_name);
                    activeEmps.push("No");

                    inquirer
                        .prompt(
                            {
                                type: "list",
                                message: "Does this employee's have a manager?",
                                name: "manager",
                                choices: activeEmps,
                            }).then(answer => {
                                const manager = answer.manager;

                                let managerID;
                                if (manager === 'No') {
                                    managerID = 'NULL';
                                }

                                for (const row2 of rows2) {
                                    if (row2.first_name === manager) {
                                        managerID = row2.id;
                                    }
                                }

                                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`
                                const params = [answers.firstName, answers.lastName, roleId, managerID]
                                
                                db.query(sql, params, (err3, rows3) => {
                                    if (err3) throw err3;
                                    console.log('Success');
                                    trackEmp();
                                });
                            });
                });
            });
    });
}
