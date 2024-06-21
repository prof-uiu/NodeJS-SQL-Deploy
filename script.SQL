CREATE TABLE person(
  id serial PRIMARY KEY, -- id é uma chave primária
  name text NOT NULL, -- name é uma string obrigatória
  age integer,
  email text NOT NULL UNIQUE, -- email é uma string obrigatória e única
  actived boolean DEFAULT(true), -- padrão “true” para todos registros

  user_id integer REFERENCES user(id)

  CHECK(age > 18) -- confere se a idade é maior que 18 antes de inserir
);

CREATE TABLE stuff(
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

CREATE TABLE person_stuff(
  id serial PRIMARY KEY,
  person_id int REFERENCES person(id), -- referencia ao id da tabela person
  stuff_id int REFERENCES stuff -- referencia a chave primária da tabela stuff
);

CREATE TABLE user(
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  email text NOT NULL UNIQUE,
  actived boolean DEFAULT(true),
  
  created_at TIMESTAMP DEFAULT(now()),
  update_at TIMESTAMP default(now())
)

INSERT INTO person(name, age, email) VALUES('John Doe', 25, 'john.doe@mail.com');
INSERT INTO person(name, age, email) VALUES('Jane Doe', 20, 'jane.doe@mail.com');
INSERT INTO person(name, age, email) VALUES('Jack Foo', 30, 'jack.foo@mail.com');
INSERT INTO person(name, age, email) VALUES('Pedro Bar', 40, 'pedro.bar@mail.com');

INSERT INTO stuff(name, slug) VALUES('Bola', 'bola');
INSERT INTO stuff(name, slug) VALUES('Caderno', 'caderno');
INSERT INTO stuff(name, slug) VALUES('Caneta', 'caneta');
INSERT INTO stuff(name, slug) VALUES('Lápis', 'lapis');

INSERT INTO person_stuff(person_id, stuff_id) VALUES(1, 1);
INSERT INTO person_stuff(person_id, stuff_id) VALUES(1, 2);
INSERT INTO person_stuff(person_id, stuff_id) VALUES(2, 3);
INSERT INTO person_stuff(person_id, stuff_id) VALUES(2, 4);

--- Faz um join pra saber quais as stuffs de cada person
SELECT * 
FROM person 
INNER JOIN person_stuff ON person.id = person_stuff.person_id
INNER JOIN stuff ON stuff.id = person_stuff.stuff_id;
WHERE person.id = 1

--- Verifica as stuffs que não tem um dono ainda
SELECT *
  FROM stuff s
FULL JOIN person_stuff ps 
  ON s.id = ps.stuff_id
WHERE ps.id IS NULL


--- Conta quantas stuffs cada dono tem
SELECT person.id, person.name, COUNT(person_stuff.id) stuffs
FROM person
FULL JOIN  person_stuff
  ON person.id = person_stuff.person_id
GROUP BY person.id

--- Só retorna donos que não tem nenhum objeto
SELECT person.id, person.name, COUNT(person_stuff.id) stuffs
FROM person
FULL JOIN  person_stuff
  ON person.id = person_stuff.person_id
GROUP BY person.id
HAVING COUNT(person_stuff.id) = 0