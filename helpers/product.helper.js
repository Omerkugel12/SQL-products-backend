function criteria(query) {
  const { product_name, category, min_price, max_price } = query;
  let conditions = [];
  let params = [];

  if (product_name) {
    conditions.push(`product_name LIKE ?`);
    params.push(`%${product_name}%`);
  }

  if (category) {
    conditions.push(`category LIKE ?`);
    params.push(`%${category}%`);
  }

  if (min_price && max_price) {
    if (max_price <= 0 || max_price <= min_price) {
      return res.status(400).json({ message: "Invalid price range" });
    }
    conditions.push(`product_price BETWEEN ? AND ?`);
    params.push(min_price, max_price);
  }

  if (min_price) {
    conditions.push(`product_price >= ?`);
    params.push(min_price);
  }

  if (max_price) {
    conditions.push(`product_price <= ?`);
    params.push(max_price);
  }

  return { conditions, params };
}

module.exports = { criteria };
