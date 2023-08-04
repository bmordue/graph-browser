-- Create 'nodes' table
CREATE TABLE nodes (
  id INTEGER PRIMARY KEY,
  city TEXT
);

-- Insert sample nodes
INSERT INTO nodes (id, city) VALUES
  (1, 'London'),
  (2, 'Paris'),
  (3, 'Berlin'),
  (4, 'Madrid'),
  (5, 'Rome'),
  (6, 'Vienna');

-- Create 'edges' table
CREATE TABLE edges (
  id INTEGER PRIMARY KEY,
  source INTEGER,
  target INTEGER,
  journeyTime INTEGER,
  FOREIGN KEY (source) REFERENCES nodes(id),
  FOREIGN KEY (target) REFERENCES nodes(id)
);

-- Insert sample edges
INSERT INTO edges (id, source, target, journeyTime) VALUES
  (1, 1, 2, 120),  -- London to Paris
  (2, 1, 3, 180),  -- London to Berlin
  (3, 2, 1, 120),  -- Paris to London
  (4, 2, 3, 120),  -- Paris to Berlin
  (5, 3, 4, 240),  -- Berlin to Madrid
  (6, 3, 5, 180),  -- Berlin to Rome
  (7, 4, 3, 240),  -- Madrid to Berlin
  (8, 4, 5, 180),  -- Madrid to Rome
  (9, 5, 1, 180),  -- Rome to London
  (10, 5, 6, 120), -- Rome to Vienna
  (11, 6, 4, 360), -- Vienna to Madrid
  (12, 6, 5, 120); -- Vienna to Rome
