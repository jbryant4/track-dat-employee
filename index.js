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

//global variables
const dep = 'department';
const role = 'emp_role';
const emp = 'employee'



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
                    viewFunction(dep)
                    break;

                case 'View all roles':
                    viewFunction(role)
                    break;

                case 'View all employees':
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
                    let dataColum = 'role_id'
                    updateEmpData(role, dataColum);
                    break;

                case 'Update employee manager':
                    let dataColum2 = 'manager_id'
                    updateEmpData(emp, dataColum2);
                    break;

                case 'View employees by manager':
                    const manager = 'manager'
                    viewBy(manager);
                    break;

                case 'View employees by department':
                    viewBy(dep)
                    break;

                case 'Delete departments':
                    deleteData(dep);
                    break;

                case 'Delete roles':
                    deleteData(role);
                    break;

                case 'Delete employees':
                    deleteData(emp)
                    break;

                case 'View the total utilized budget':
                    totalBudget()
                    break;
            }
        });
};

//! view function 
function viewFunction(view) {
    let sql;
    if(view === 'employee'){
        sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, emp_role.title, emp_role.salary, department.dep_name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee
        LEFT JOIN emp_role 
        ON employee.role_id = emp_role.id
        LEFT JOIN department
        ON emp_role.department_id = department.id
        LEFT JOIN employee manager 
        ON manager.id = employee.manager_id;`
    } else {
        sql = `SELECT * FROM ${view};`;
    }
    
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
};

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
};

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
                const empRole = answers.role;
                let roleId;
                // FOR/OF LOOP: loops through the values of an iterable array 
                for (const row of rows) {
                    if (row.title === empRole) {
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
};

//! update function
function updateEmpData(dataType, dataColum) {
    db.query(`SELECT * FROM employee`, (err, rows) => {
        if (err) throw err;
        const activeEmps = rows.map(x => x.first_name);

        inquirer
            .prompt(
                {
                    type: "list",
                    message: "What employee would you like to update?",
                    name: "employee",
                    choices: activeEmps,
                }).then(answer => {

                    empName = answer.employee
                    let empId
                    for (const row of rows) {
                        if (row.first_name === empName) {
                            empId = row.id;
                        }
                    }

                    db.query(`SELECT * FROM ${dataType}`, (err2, rows2) => {
                        if (err2) throw err2;

                        let activeList;
                        if (dataType === 'emp_role') {
                            activeList = rows2.map(x => x.title);
                        } else if (dataType === 'employee') {
                            activeList = rows2.map(x => x.first_name);
                        }

                        inquirer
                            .prompt(
                                {
                                    type: "list",
                                    message: "What role/manager are we updating for this employee?",
                                    name: "newData",
                                    choices: activeList,
                                }).then(answer2 => {

                                    newData = answer2.newData
                                    let newDataId
                                    for (const row2 of rows2) {
                                        if (dataType === 'emp_role') {
                                            if (row2.title === newData) {
                                                newDataId = row2.id;
                                            }
                                        } else if (dataType === 'employee') {
                                            if (row2.first_name === newData) {
                                                newDataId = row2.id;
                                            }
                                        }
                                    }

                                    db.query(`UPDATE employee SET ${dataColum} = ${newDataId}  WHERE id = ${empId}`, (err3, rows3) => {
                                        if (err3) throw err3
                                        console.log('Success')
                                        trackEmp();
                                    });

                                })

                    });
                })
    });
};

//! view by function
function viewBy(data) {

    const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, emp_role.title, emp_role.salary, department.dep_name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee
    LEFT JOIN emp_role 
    ON employee.role_id = emp_role.id
    LEFT JOIN department
    ON emp_role.department_id = department.id
    LEFT JOIN employee manager 
    ON manager.id = employee.manager_id;`

    db.query(sql, (err, rows) => {
        if (err) throw err;

        let activeList;
        if (data === 'manager') {
            activeList = rows.map(x => x.employee);
        } else if (data === 'department') {
            activeList = rows.map(x => x.department);
        }

        inquirer
            .prompt(
                {
                    type: "list",
                    message: "What manager are you loooking for?",
                    name: "filter",
                    choices: activeList,
                }).then(answer => {

                    const cloneArray = rows
                    let dataList;
                    if (data === 'manager') {
                        dataList = cloneArray.filter(x => x.manager === answer.filter)
                    } else if (data === 'department') {
                        dataList = cloneArray.filter(x => x.department === answer.filter)
                    };
                    console.table(dataList);
                    trackEmp();
                })
    })
};


//! delete function 
function deleteData(data) {
    db.query(`SELECT * FROM ${data}`, (err, rows) => {
        if (err) throw err;

        let activeList;
        if (data === 'department') {
            activeList = rows.map(x => x.dep_name);
        } else if (data === 'emp_role') {
            activeList = rows.map(x => x.title);
        } else if (data === 'employee') {
            activeList = rows.map(x => x.first_name);
        }

        inquirer
            .prompt(
                {
                    type: "list",
                    message: `What ${data} are you trying to delete?`,
                    name: "delete",
                    choices: activeList,
                }).then(answer => {

                    let deleteDataId;
                    for (const row of rows) {
                        if (data === 'emp_role') {
                            if (row.title === answer.delete) {
                                deleteDataId = row.id;
                            }
                        } else if (data === 'employee') {
                            if (row.first_name === answer.delete) {
                                deleteDataId = row.id;
                            }
                        } else if (data === 'department') {
                            if (row.dep_name === answer.delete) {
                                deleteDataId = row.id;
                            }
                        }
                    }

                    sql = `DELETE FROM ${data} WHERE id = ${deleteDataId}`
                    db.query(sql, (err1, rows1) => {
                        if (err1) throw err1;

                        console.log('Success');
                        trackEmp();
                    })
                });
    })
};

//! total budget
function totalBudget() {
    const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, emp_role.title, emp_role.salary, department.dep_name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee
    LEFT JOIN emp_role 
    ON employee.role_id = emp_role.id
    LEFT JOIN department
    ON emp_role.department_id = department.id
    LEFT JOIN employee manager 
    ON manager.id = employee.manager_id;`

    db.query(sql, (err, rows) => {
        if (err) throw err;

        activeList = rows.map(x => parseInt(x.salary));

        let salary = 0;
        for (i = 0;i < activeList.length;i++){
            salary += activeList[i]
        }
        console.log(`
        ___________________________________

        Total Utilized Budget:   ${salary}
        
        +++++++++++++++++++++++++++++++++++`)
        
        trackEmp();
    });
}