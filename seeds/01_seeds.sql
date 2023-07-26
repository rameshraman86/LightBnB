-- INSERT INTO
--   users (name, email, password)
-- VALUES
--   ('Eva Stanley', 'sebastianguerra@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
--   ('Raya Krishtoff', 'rayakrish@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
--   ('Luther Johnathan', 'jluththe3rd@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');
-- INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
-- VALUES
--     (1, 'Cozy Cottage', 'Description', 'https://example.com/thumbnail1.jpg', 'https://example.com/cover1.jpg', 100, 2, 2, 1, 'United States', '1234 Elm St', 'Smallville', 'California', '12345', true),
--     (2, 'Modern Apartment', 'Description', 'https://example.com/thumbnail2.jpg', 'https://example.com/cover2.jpg', 150, 1, 1.5, 1, 'United States', '5678 Oak St', 'Bigcity', 'New York', '67890', true),
--     (3, 'Seaside Villa', 'Description', 'https://example.com/thumbnail3.jpg', 'https://example.com/cover3.jpg', 300, 3, 3, 2, 'France', '10 Beach Rd', 'Niceville', 'Provence', '54321', true);
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
    ('2023-07-26', '2023-07-29', 1, 1),
    ('2023-08-05', '2023-08-10', 2, 2),
    ('2023-09-15', '2023-09-20', 1, 3);


INSERT INTO
  property_reviews (
    guest_id,
    property_id,
    reservation_id,
    rating,
    message
  )
VALUES
  (1, 1, 1, 5, 'Great place to stay!'),
  (2, 1, 2, 4, 'Had a nice experience.'),
  (3, 2, 3, 3, 'Average stay, could be improved.');