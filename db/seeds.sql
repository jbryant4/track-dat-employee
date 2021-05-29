INSERT INTO department (dep_name)
VALUES
  ('Store 192');

  INSERT INTO emp_role (title, salary, department_id)
VALUES
  ('3rd Manager', 50000, 1),
  ('Burger Flipper', 15.00, 1);


  INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Joseph', 'Bryant', 1, NULL),
  ('bob', 'bee', 2, 1);