//npms
const inquirer = require("inquirer");

//questions 
const mainMenu = require('./lib/question');

//conect database
const db = require('./db/connection');
db.connect((err) => {
    if (err) throw err;

    trackEmp()
})
//query functions 
const deparray = ['Store 192']
// const { } = require();

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
                    console.log('hi')
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


//! add demp role function 
function addEmpRole() {
    let activeDeps = []
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) throw err;
        for (i = 0; i < rows.length; i++) {
            activeDeps.push(rows[i].dep_name)
        }
    });

    // console.log(activeDeps);
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
                name: "salaryy",
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
            const sql = `SELECT id FROM department WHERE dep_name = ?;`
            param = answers.department;
            let deb_id = 1; //!this is a problem it is not asyc how do we fix it 
            db.query(sql, param, (err, rows) => {
                if (err) throw err;
                console.log(rows[0].id)
                deb_id = deb_id + rows[0].id;
            });


            const sql2 = `INSERT INTO emp_role (title, salary, department_id) VALUES (?,?,?);`
            const params = [answers.title, answers.salary, deb_id]

            db.query(sql2, params, (err, rows) => {
                if (err) throw err;
                console.log('Success');
                trackEmp();
            })
        });
}
