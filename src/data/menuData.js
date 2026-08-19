export const PIZZAS = [
  { id: "pz-1", name: "Tok's Signature", category: "pizza", tag: "Chicken, Beef, Sausage, Veggies, Cheese", sizes: { Medium: 10500, "X-Large": 15500 }, img: "https://i.pinimg.com/736x/32/6c/66/326c66aa5435c93eca82fc52b1e41680.jpg" },
  { id: "pz-2", name: "Naija Heat", category: "pizza", tag: "Spicy Chicken, Beef, Veggies, Cheese", sizes: { Medium: 11500, "X-Large": 16000 }, img: "https://i.pinimg.com/736x/21/42/4b/21424b594af9cfe006ed580a40a5bbfb.jpg" },
  { id: "pz-3", name: "Tok's Suya Melt", category: "pizza", tag: "Suya Beef, Veggies, Cheese", sizes: { Medium: 12000, "X-Large": 16500 }, img: "https://i.pinimg.com/736x/06/79/7d/06797df109db433315575226ecd2ccea.jpg" },
  { id: "pz-4", name: "Smokey BBQ", category: "pizza", tag: "BBQ Chicken, Beef, Veggies, Cheese", sizes: { Medium: 12000, "X-Large": 16500 }, img: "https://i.pinimg.com/1200x/f0/8e/25/f08e25106dfcf7a52f893343d9549d25.jpg" },
  { id: "pz-5", name: "Tok's Royale", category: "pizza", tag: "Chicken, Beef, Sausage, Veggies, Cheese", sizes: { Medium: 12500, "X-Large": 17000 }, img: "https://i.pinimg.com/736x/0e/14/6f/0e146f697104766fdb71cc3a8d78ce2a.jpg" },
  { id: "pz-6", name: "Tok's Loaded", category: "pizza", tag: "Chicken, Beef, Sausage, Veggies, Cheese", sizes: { Medium: 14500, "X-Large": 18500 }, img: "https://i.pinimg.com/736x/36/99/53/3699539621206f0921d2a924c6c1ee0a.jpg" },
];

const SOUP_IMAGES = [
  "https://i.pinimg.com/736x/1b/e1/f6/1be1f6e2489d51c40cad877d48ba086a.jpg",
  "https://i.pinimg.com/736x/71/c7/32/71c73298611ef7142c3d5bd5b425ee24.jpg",
  "https://i.pinimg.com/736x/c5/a7/09/c5a709617c374aa8348f8e90596cb051.jpg",
 "https://i.pinimg.com/1200x/6c/70/fc/6c70fc21a0d9e08509b9e397546585c4.jpg",
  "https://i.pinimg.com/736x/75/d4/4f/75d44f6287264b8861bfdbd54a803dcf.jpg",
  "https://i.pinimg.com/736x/bf/2f/4c/bf2f4c842cd6ed0c637739e8037a8517.jpg",
  "https://i.pinimg.com/736x/42/04/5e/42045ef71395f272ffa6dad89de51d52.jpg",
  "https://i.pinimg.com/736x/2c/95/c3/2c95c3ff22f08013bbda49cc41722b36.jpg",
  "https://i.pinimg.com/736x/92/8b/63/928b630e79b57e50f6dc2c3bcfbd3c10.jpg",
  "https://i.pinimg.com/1200x/5e/23/f8/5e23f8c1e1cc4e47db530c5ebf2fffe8.jpg",
  "https://i.pinimg.com/736x/2e/09/66/2e0966875960999ae83e41504b32e4b0.jpg",
  "https://i.pinimg.com/736x/53/f5/07/53f50771ebde1a9e51ad5125f6b505ec.jpg",
];

const STEW_IMAGES = [
  "https://i.pinimg.com/1200x/d2/82/04/d28204c8cfc3d06f9dd39c267190aeec.jpg",
  "https://i.pinimg.com/736x/08/74/96/0874963f1e8c49c59e9109fb0e599a3d.jpg",
  "https://i.pinimg.com/736x/2e/f7/c2/2ef7c21f85e4557d9231c5730f822f1d.jpg",
  "https://i.pinimg.com/736x/2e/f7/c2/2ef7c21f85e4557d9231c5730f822f1d.jpg",
  "https://i.pinimg.com/736x/85/70/a7/8570a79c2fe95344366cf5ea76044f6e.jpg",
  "https://i.pinimg.com/1200x/ab/81/b2/ab81b2230d635c8fb5ed3b88e157a0c6.jpg",
  "https://i.pinimg.com/1200x/98/67/71/98677135a0b3a834aae39f0913b502d2.jpg",
  "https://i.pinimg.com/736x/fe/cd/58/fecd5887e2026210b503d9c8a0ed0c48.jpg",
  "https://i.pinimg.com/736x/78/04/c7/7804c746f38b8289a9fdc6494086478a.jpg",
  "https://i.pinimg.com/1200x/f0/d6/be/f0d6befdd53169eba496279c545917ee.jpg",
];

function soup(id, name, sizes, i) {
  return { id, name, category: "soup", tag: "Slow-simmered, traditional recipe", sizes, img: SOUP_IMAGES[i % SOUP_IMAGES.length] };
}
function stew(id, name, sizes, i) {
  return { id, name, category: "stew", tag: "Rich, homemade sauce base", sizes, img: STEW_IMAGES[i % STEW_IMAGES.length] };
}

export const SOUPS = [
  soup("sp-1", "Egusi Soup", { "1.5L": 25000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 0),
  soup("sp-2", "Ogbono Soup", { "1.5L": 25000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 1),
  soup("sp-3", "Okro Soup", { "1.5L": 25000, "2.5L": 40000, "3.5L": 60000, "5L": 85000 }, 2),
  soup("sp-4", "Efo Riro", { "1.5L": 25000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 3),
  soup("sp-5", "Fisherman Soup", { "1.5L": 35000, "2.5L": 65000, "3.5L": 90000, "5L": 120000 }, 4),
  soup("sp-6", "Seafood Okro", { "1.5L": 35000, "2.5L": 55000, "3.5L": 75000, "5L": 100000 }, 5),
  soup("sp-7", "Banga Soup", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 6),
  soup("sp-8", "Afang Soup", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 7),
  soup("sp-9", "Bitterleaf Soup", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 8),
  soup("sp-10", "Oha Soup", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 9),
  soup("sp-11", "Vegetable Soup", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 10),
  soup("sp-12", "Edikaikong Soup", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 90000 }, 11),
];

export const STEWS = [
  stew("st-1", "Buka Stew", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 85000 }, 0),
  stew("st-2", "Turkey Stew", { "1.5L": 40000, "2.5L": 55000, "3.5L": 75000, "5L": 95000 }, 1),
  stew("st-3", "Chicken Stew", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 85000 }, 2),
  stew("st-4", "Pepper Sauce", { "1.5L": 25000, "2.5L": 40000, "3.5L": 60000, "5L": 80000 }, 3),
  stew("st-5", "Ofada Sauce", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 85000 }, 4),
  stew("st-6", "Croaker Stew", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 85000 }, 5),
  stew("st-7", "Goat Meat Stew", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 85000 }, 6),
  stew("st-8", "Beef Stew", { "1.5L": 25000, "2.5L": 40000, "3.5L": 60000, "5L": 80000 }, 7),
  stew("st-9", "Assorted Stew", { "1.5L": 25000, "2.5L": 40000, "3.5L": 60000, "5L": 80000 }, 8),
  stew("st-10", "Fish Stew", { "1.5L": 30000, "2.5L": 45000, "3.5L": 65000, "5L": 85000 }, 9),
];

export const ALL_ITEMS = [...PIZZAS, ...SOUPS, ...STEWS];

export const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "pizza", label: "Pizza" },
  { key: "soup", label: "Soup Bowls" },
  { key: "stew", label: "Stew Collection" },
];

export const TESTIMONIALS = [
  { name: "Amaka O.", quote: "Every tray tastes like a Sunday afternoon at my mother's table. The Egusi is unmatched.", city: "Lekki, Lagos" },
  { name: "Chidera E.", quote: "Ordered the Loaded pizza for a small gathering and it disappeared in minutes. Restaurant quality, home warmth.", city: "Ikeja, Lagos" },
  { name: "Femi A.", quote: "The packaging alone feels premium. You can tell every tray is made with real care, not mass produced.", city: "Ajah, Lagos" },
];

export function naira(n) {
  return "₦" + (Number(n) || 0).toLocaleString("en-NG");
}

export function minPrice(sizes) {
  return Math.min(...Object.values(sizes));
}