CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT uuid_generate_v4(),
  phone VARCHAR (11) NOT NULL,

  primary key (id)
);
