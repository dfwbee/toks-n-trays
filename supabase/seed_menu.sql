-- Seed menu_items from existing menuData.js
-- Run this in Supabase SQL Editor AFTER schema.sql

insert into menu_items (id, name, category, tag, sizes, img) values
('pz-1', 'Tok''s Signature', 'pizza', 'Chicken, Beef, Sausage, Veggies, Cheese', '{"Medium":10500,"X-Large":15500}'::jsonb, 'https://i.pinimg.com/736x/32/6c/66/326c66aa5435c93eca82fc52b1e41680.jpg'),
('pz-2', 'Naija Heat', 'pizza', 'Spicy Chicken, Beef, Veggies, Cheese', '{"Medium":11500,"X-Large":16000}'::jsonb, 'https://i.pinimg.com/736x/21/42/4b/21424b594af9cfe006ed580a40a5bbfb.jpg'),
('pz-3', 'Tok''s Suya Melt', 'pizza', 'Suya Beef, Veggies, Cheese', '{"Medium":12000,"X-Large":16500}'::jsonb, 'https://i.pinimg.com/736x/06/79/7d/06797df109db433315575226ecd2ccea.jpg'),
('pz-4', 'Smokey BBQ', 'pizza', 'BBQ Chicken, Beef, Veggies, Cheese', '{"Medium":12000,"X-Large":16500}'::jsonb, 'https://i.pinimg.com/1200x/f0/8e/25/f08e25106dfcf7a52f893343d9549d25.jpg'),
('pz-5', 'Tok''s Royale', 'pizza', 'Chicken, Beef, Sausage, Veggies, Cheese', '{"Medium":12500,"X-Large":17000}'::jsonb, 'https://i.pinimg.com/736x/0e/14/6f/0e146f697104766fdb71cc3a8d78ce2a.jpg'),
('pz-6', 'Tok''s Loaded', 'pizza', 'Chicken, Beef, Sausage, Veggies, Cheese', '{"Medium":14500,"X-Large":18500}'::jsonb, 'https://i.pinimg.com/736x/36/99/53/3699539621206f0921d2a924c6c1ee0a.jpg'),
('sp-1', 'Egusi Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":25000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/736x/1b/e1/f6/1be1f6e2489d51c40cad877d48ba086a.jpg'),
('sp-2', 'Ogbono Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":25000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/736x/71/c7/32/71c73298611ef7142c3d5bd5b425ee24.jpg'),
('sp-3', 'Okro Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":25000,"2.5L":40000,"3.5L":60000,"5L":85000}'::jsonb, 'https://i.pinimg.com/736x/c5/a7/09/c5a709617c374aa8348f8e90596cb051.jpg'),
('sp-4', 'Efo Riro', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":25000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/1200x/6c/70/fc/6c70fc21a0d9e08509b9e397546585c4.jpg'),
('sp-5', 'Fisherman Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":35000,"2.5L":65000,"3.5L":90000,"5L":120000}'::jsonb, 'https://i.pinimg.com/736x/75/d4/4f/75d44f6287264b8861bfdbd54a803dcf.jpg'),
('sp-6', 'Seafood Okro', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":35000,"2.5L":55000,"3.5L":75000,"5L":100000}'::jsonb, 'https://i.pinimg.com/736x/bf/2f/4c/bf2f4c842cd6ed0c637739e8037a8517.jpg'),
('sp-7', 'Banga Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/736x/42/04/5e/42045ef71395f272ffa6dad89de51d52.jpg'),
('sp-8', 'Afang Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/736x/2c/95/c3/2c95c3ff22f08013bbda49cc41722b36.jpg'),
('sp-9', 'Bitterleaf Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/736x/92/8b/63/928b630e79b57e50f6dc2c3bcfbd3c10.jpg'),
('sp-10', 'Oha Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/1200x/5e/23/f8/5e23f8c1e1cc4e47db530c5ebf2fffe8.jpg'),
('sp-11', 'Vegetable Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/736x/2e/09/66/2e0966875960999ae83e41504b32e4b0.jpg'),
('sp-12', 'Edikaikong Soup', 'soup', 'Slow-simmered, traditional recipe', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":90000}'::jsonb, 'https://i.pinimg.com/736x/53/f5/07/53f50771ebde1a9e51ad5125f6b505ec.jpg'),
('st-1', 'Buka Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":85000}'::jsonb, 'https://i.pinimg.com/1200x/d2/82/04/d28204c8cfc3d06f9dd39c267190aeec.jpg'),
('st-2', 'Turkey Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":40000,"2.5L":55000,"3.5L":75000,"5L":95000}'::jsonb, 'https://i.pinimg.com/736x/08/74/96/0874963f1e8c49c59e9109fb0e599a3d.jpg'),
('st-3', 'Chicken Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":85000}'::jsonb, 'https://i.pinimg.com/736x/2e/f7/c2/2ef7c21f85e4557d9231c5730f822f1d.jpg'),
('st-4', 'Pepper Sauce', 'stew', 'Rich, homemade sauce base', '{"1.5L":25000,"2.5L":40000,"3.5L":60000,"5L":80000}'::jsonb, 'https://i.pinimg.com/736x/2e/f7/c2/2ef7c21f85e4557d9231c5730f822f1d.jpg'),
('st-5', 'Ofada Sauce', 'stew', 'Rich, homemade sauce base', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":85000}'::jsonb, 'https://i.pinimg.com/736x/85/70/a7/8570a79c2fe95344366cf5ea76044f6e.jpg'),
('st-6', 'Croaker Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":85000}'::jsonb, 'https://i.pinimg.com/1200x/ab/81/b2/ab81b2230d635c8fb5ed3b88e157a0c6.jpg'),
('st-7', 'Goat Meat Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":85000}'::jsonb, 'https://i.pinimg.com/1200x/98/67/71/98677135a0b3a834aae39f0913b502d2.jpg'),
('st-8', 'Beef Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":25000,"2.5L":40000,"3.5L":60000,"5L":80000}'::jsonb, 'https://i.pinimg.com/736x/fe/cd/58/fecd5887e2026210b503d9c8a0ed0c48.jpg'),
('st-9', 'Assorted Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":25000,"2.5L":40000,"3.5L":60000,"5L":80000}'::jsonb, 'https://i.pinimg.com/736x/78/04/c7/7804c746f38b8289a9fdc6494086478a.jpg'),
('st-10', 'Fish Stew', 'stew', 'Rich, homemade sauce base', '{"1.5L":30000,"2.5L":45000,"3.5L":65000,"5L":85000}'::jsonb, 'https://i.pinimg.com/1200x/f0/d6/be/f0d6befdd53169eba496279c545917ee.jpg')
on conflict (id) do update set name = excluded.name, category = excluded.category, tag = excluded.tag, sizes = excluded.sizes, img = excluded.img;
