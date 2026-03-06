export const fetchProducts = async () => {
  const res = await fetch('/api/products');
  return res.json();
}

export const fetchProduct = async (id: string) => {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}

export const fetchRecommendations = async () => {
  const res = await fetch('/api/recommendations/popular');
  return res.json();
}

export const fetchCart = async (userId: string) => {
  const res = await fetch(`/api/cart/${userId}`);
  return res.json();
}

export const addToCart = async (userId: string, item: any) => {
  const res = await fetch(`/api/cart/${userId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
}

export const createOrder = async (userId: string) => {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: parseInt(userId) }),
  });
  return res.json();
}

export const loginUser = async (email: string, password: string) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export const fetchOrders = async (userId: string) => {
  const res = await fetch(`/api/orders/user/${userId}`);
  return res.json();
}

export const registerUser = async (userData: any) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}
