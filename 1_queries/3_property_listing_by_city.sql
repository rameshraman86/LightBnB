SELECT
  properties.id,
  properties.title,
  properties.cost_per_night,
  avg(property_reviews.rating) as avg_rating
FROM
  properties
  join property_reviews on properties.id = property_reviews.property_id
WHERE
  city = 'Vancouver'
GROUP BY
  properties.id
HAVING
  avg(property_reviews.rating) >= 4
ORDER BY
  avg_rating
LIMIT
  10;