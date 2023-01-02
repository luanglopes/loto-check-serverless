CREATE TABLE IF NOT EXISTS bets (
  id uuid DEFAULT uuid_generate_v4(),
  numbers jsonb NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp DEFAULT NOW(),

  primary key (id),
  CONSTRAINT fk_users
    FOREIGN KEY(user_id)
      REFERENCES users(id)
);
