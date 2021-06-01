INSERT INTO department (dep_name)
VALUES
  ('Store 192'),
  ('Store 195'),
  ('Store 153');

INSERT INTO emp_role (title, salary, department_id)
VALUES
  ('Store Manager', 100000, 2),
  ('3rd Manager', 50000, 1),
  ('Burger Flipper', 33000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Penn', 'Washinton', 1, NULL),
  ('Joseph', 'Bryant', 2, 1),
  ('Graden', 'George', 3, 2);