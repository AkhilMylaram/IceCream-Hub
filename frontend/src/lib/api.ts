const getBase = () => '';

export const fetchProducts = async () => {
  const res = await fetch(`${getBase()}/api/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
};

export const fetchProduct = async (id: string) => {
  const res = await fetch(`${getBase()}/api/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
  return res.json();
};

export const fetchRecommendations = async () => {
  const res = await fetch(`${getBase()}/api/recommendations/popular`);
  if (!res.ok) return [];
  return res.json();
};

export const fetchCart = async (userId: string) => {
  const res = await fetch(`${getBase()}/api/cart/${userId}`);
  if (!res.ok) return { items: [] };
  return res.json();
};

export const addToCart = async (userId: string, item: any) => {
  const res = await fetch(`${getBase()}/api/cart/${userId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const createOrder = async (userId: string) => {
  const res = await fetch(`${getBase()}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: parseInt(userId) }),
  });
  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${getBase()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed. Please check your credentials.');
  }
  return data;
};

export const fetchOrders = async (userId: string) => {
  const res = await fetch(`${getBase()}/api/orders/user/${userId}`);
  if (!res.ok) return [];
  return res.json();
};

export const registerUser = async (userData: any) => {
  const res = await fetch(`${getBase()}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed. Please try again.');
  }
  return data;
};
