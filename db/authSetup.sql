DROP DATABASE IF EXISTS login_nc_knews;
CREATE DATABASE login_nc_knews;

\c login_nc_knews;

create table users (user_id serial primary key, username varchar(50), password);

create table secrets (secret_id serial primary key, secret_text varchar, user_id int references users(user_id));

insert into users (username, password) values
('tommy', '$2b$04$DnU9PTUqLn7ruW9nJhSYA.ZkWzge7hy7Rx2Ws6JdjtneVmDWhEpzy'),
('jimmy', '$2b$04$oDKM555suWRvRDv10u6ZKOkNmeLsvEHW8Fdvgd1bUZn1ru5wHwboC'),
('pete', '$2b$04$tznr4IppXieCd8u3DFonI.r8vvp1o5DSPhWE35vGWslIwfafnR.dG');


insert into secrets (user_id, secret_text) values
(1, 'some very secrety things'),
(2, 'i have no secrets'),
(3, 'i only have secrets');
