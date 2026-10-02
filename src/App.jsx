import { useEffect, useMemo, useState } from 'react';
import promoStrawberryMilkTea from '../assets/promo-strawberry-milk-tea.png';

const categories = [
  { label: '奶茶', icon: '🧋' },
  { label: '咖啡', icon: '☕' },
  { label: '果茶', icon: '🍋' },
  { label: '轻饮', icon: '🍃' },
];

const products = [
  { id: 1, name: '粉云莓莓拿铁', note: '草莓奶盖 · 低因咖啡', price: 18, emoji: '🍓', tone: 'pink', category: '咖啡', badge: '人气 TOP 1', desc: '草莓果茸与低因咖啡轻轻融合，顶部是绵密的云朵奶盖。', calories: '约 248 kcal', caffeine: '低因', temperatures: ['热饮', '少冰', '正常冰'], taste: ['莓果香', '奶香', '轻咖啡感'] },
  { id: 2, name: '桂花乌龙奶茶', note: '轻乳茶 · 少糖推荐', price: 16, emoji: '🧋', tone: 'peach', category: '奶茶', badge: 'AI 推荐', desc: '烘焙乌龙的茶香里藏着桂花蜜韵，轻乳口感清爽不腻。', calories: '约 196 kcal', caffeine: '中等', temperatures: ['热饮', '去冰', '少冰', '正常冰'], taste: ['桂花香', '乌龙茶韵', '轻盈'] },
  { id: 3, name: '青提茉莉轻茶', note: '清爽 · 0 脂', price: 15, emoji: '🍵', tone: 'mint', category: '果茶', badge: '0 脂轻负担', desc: '鲜榨青提碰上窨制茉莉，入口清甜，收尾是轻柔花香。', calories: '约 102 kcal', caffeine: '低', temperatures: ['去冰', '少冰', '正常冰'], taste: ['青提清甜', '茉莉花香', '清爽'] },
  { id: 4, name: '生椰茉莉拿铁', note: '椰香奶盖 · 鲜萃', price: 20, emoji: '🥥', tone: 'cream', category: '咖啡', badge: '新品尝鲜', desc: '鲜萃茉莉茶底加入椰乳，香气饱满，口感顺滑有层次。', calories: '约 222 kcal', caffeine: '中等', temperatures: ['热饮', '少冰', '正常冰'], taste: ['椰乳香', '茉莉香', '丝滑'] },
  { id: 5, name: '葡萄冰茶', note: '真果汁 · 清甜冰爽', price: 17, emoji: '🍇', tone: 'purple', category: '果茶', badge: '今日鲜果', desc: '阳光玫瑰葡萄果汁配清香绿茶，一口喝到明亮果香。', calories: '约 126 kcal', caffeine: '无', temperatures: ['去冰', '少冰', '正常冰'], taste: ['葡萄爆汁', '清甜', '冰爽'] },
  { id: 6, name: '抹茶轻乳', note: '低糖 · 细腻回甘', price: 17, emoji: '🍃', tone: 'green', category: '轻饮', badge: '低糖优选', desc: '石磨抹茶与轻乳打出细腻泡沫，回甘清晰、负担更轻。', calories: '约 164 kcal', caffeine: '低', temperatures: ['热饮', '去冰', '少冰', '正常冰'], taste: ['抹茶回甘', '轻乳', '低糖'] },
];

const aiRecommendations = [
  { productId: 2, title: '今天，试试桂花乌龙奶茶', reason: '上海 28℃，而且你偏好少糖轻乳茶；它清爽不腻，适合下午开会前来一杯。', tags: ['少糖', '轻乳茶', '下午提神'] },
  { productId: 1, title: '今天，试试粉云莓莓拿铁', reason: '你近两次选择了低因咖啡，今天有第二杯半价，和同事拼单更划算。', tags: ['低因', '第二杯半价', '拼单友好'] },
  { productId: 3, title: '今天，试试青提茉莉轻茶', reason: '天气偏热，按你的“清爽、少负担”偏好，推荐这杯冰饮。', tags: ['清爽', '冰饮', '0 脂'] },
];

const toppings = [
  { id: 'boba', name: '黑糖波波', price: 2, icon: '●' },
  { id: 'pudding', name: '布丁', price: 2, icon: '◇' },
  { id: 'coconut', name: '椰果', price: 2, icon: '◌' },
  { id: 'oat', name: '燕麦奶', price: 3, icon: '◒' },
];

const money = (value) => `¥${value.toFixed(0)}`;
const defaultConfig = (product) => ({ temperature: product.temperatures.includes('少冰') ? '少冰' : product.temperatures[0], sugar: '标准糖', toppings: [] });
const toppingTotal = (items) => items.reduce((sum, id) => sum + (toppings.find((item) => item.id === id)?.price || 0), 0);
const linePrice = (item) => item.product.price + toppingTotal(item.config.toppings);
const configKey = (product, config) => `${product.id}-${config.temperature}-${config.sugar}-${[...config.toppings].sort().join('-')}`;

function ProductCard({ product, quantity, onView, onQuickAdd }) {
  return (
    <article className="product-card">
      <button className="product-preview" onClick={() => onView(product)} aria-label={`查看 ${product.name} 详情`}>
        <div className={`product-visual ${product.tone}`}><span>{product.emoji}</span><em>{product.badge}</em></div>
        <div className="product-copy"><h3>{product.name}</h3><p>{product.note}</p></div>
      </button>
      <div className="product-footer"><strong>{money(product.price)}</strong><button className={quantity ? 'round-add added' : 'round-add'} onClick={() => onQuickAdd(product)} aria-label={`加入 ${product.name}`}>{quantity ? quantity : '+'}</button></div>
    </article>
  );
}

function Stepper({ value, onDecrease, onIncrease, compact = false }) {
  return <div className={`stepper ${compact ? 'compact' : ''}`}><button onClick={onDecrease} aria-label="减少数量">−</button><span>{value}</span><button onClick={onIncrease} aria-label="增加数量">+</button></div>;
}

function Header({ onBack, title, right }) {
  return <header className="sub-header"><button className="back-button" onClick={onBack} aria-label="返回">‹</button><h1>{title}</h1><div>{right}</div></header>;
}

function ProductDetail({ product, cartQuantity, onBack, onAdd, onCart }) {
  const [config, setConfig] = useState(() => defaultConfig(product));
  const [quantity, setQuantity] = useState(1);
  const price = product.price + toppingTotal(config.toppings);
  const updateTopping = (id) => setConfig((current) => ({ ...current, toppings: current.toppings.includes(id) ? current.toppings.filter((item) => item !== id) : [...current.toppings, id] }));

  return <section className="screen detail-screen">
    <Header onBack={onBack} title="饮品详情" right={<button className="header-cart" onClick={onCart}>购物袋{cartQuantity ? <b>{cartQuantity}</b> : ''}</button>} />
    <div className={`detail-hero ${product.tone}`}><span>{product.emoji}</span><div className="hero-bubbles">✦　·　✦</div></div>
    <div className="detail-content">
      <div className="detail-title"><div><span className="product-badge">{product.badge}</span><h2>{product.name}</h2><p>{product.note}</p></div><strong>{money(product.price)}</strong></div>
      <p className="description">{product.desc}</p>
      <div className="taste-row">{product.taste.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="nutrition"><span>⚡ {product.calories}</span><span>☕ {product.caffeine}咖啡因</span><span>✓ 可自定义</span></div>
      <div className="ai-detail-tip"><i>✦</i><div><small>AI 搭配建议</small><b>{product.id === 2 ? '少糖 + 少冰，最能喝出桂花乌龙的回甘。' : '少糖更能突出这杯饮品的自然风味。'}</b></div></div>
      <OptionGroup title="温度" options={product.temperatures} selected={config.temperature} onSelect={(temperature) => setConfig((current) => ({ ...current, temperature }))} />
      <OptionGroup title="甜度" options={['无糖', '三分糖', '半糖', '标准糖']} selected={config.sugar} onSelect={(sugar) => setConfig((current) => ({ ...current, sugar }))} />
      <section className="option-section"><div className="option-heading"><h3>加料</h3><span>最多任选 3 项</span></div><div className="topping-grid">{toppings.map((item) => { const selected = config.toppings.includes(item.id); const disabled = !selected && config.toppings.length >= 3; return <button disabled={disabled} onClick={() => updateTopping(item.id)} className={selected ? 'topping selected' : 'topping'} key={item.id}><i>{item.icon}</i><span>{item.name}</span><small>+{money(item.price)}</small>{selected && <b>✓</b>}</button>; })}</div></section>
    </div>
    <div className="detail-actions"><Stepper value={quantity} onDecrease={() => setQuantity((value) => Math.max(1, value - 1))} onIncrease={() => setQuantity((value) => value + 1)} /><button className="add-main" onClick={() => onAdd(product, config, quantity)}>加入购物袋 <strong>{money(price * quantity)}</strong></button></div>
  </section>;
}

function OptionGroup({ title, options, selected, onSelect }) {
  return <section className="option-section"><div className="option-heading"><h3>{title}</h3><span>必选</span></div><div className="choice-row">{options.map((option) => <button key={option} className={option === selected ? 'choice selected' : 'choice'} onClick={() => onSelect(option)}>{option === selected && <i>✓</i>}{option}</button>)}</div></section>;
}

function CartScreen({ cart, onBack, onUpdateQuantity, onRemove, onCheckout }) {
  const [selected, setSelected] = useState(() => new Set(cart.map((item) => item.key)));
  useEffect(() => setSelected((current) => new Set(cart.filter((item) => current.has(item.key)).map((item) => item.key))), [cart]);
  const selectedItems = cart.filter((item) => selected.has(item.key));
  const total = selectedItems.reduce((sum, item) => sum + linePrice(item) * item.quantity, 0);
  const allSelected = cart.length > 0 && selected.size === cart.length;
  const toggle = (key) => setSelected((current) => { const next = new Set(current); next.has(key) ? next.delete(key) : next.add(key); return next; });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(cart.map((item) => item.key)));
  return <section className="screen cart-screen"><Header onBack={onBack} title="购物袋" right={cart.length ? <span className="cart-count">共 {cart.reduce((sum, item) => sum + item.quantity, 0)} 件</span> : null} />
    {cart.length === 0 ? <div className="empty-cart"><div>🧋</div><h2>购物袋还是空的</h2><p>去挑一杯适合现在的好心情吧。</p><button onClick={onBack}>去点单</button></div> : <><div className="delivery-tip"><i>⌖</i><div><b>浦东新区 · 世纪大道</b><span>预计 25 分钟送达</span></div><em>›</em></div><div className="cart-list">{cart.map((item) => <article className="cart-item" key={item.key}><button className={selected.has(item.key) ? 'check selected' : 'check'} onClick={() => toggle(item.key)} aria-label="选择商品">{selected.has(item.key) ? '✓' : ''}</button><div className={`cart-visual ${item.product.tone}`}>{item.product.emoji}</div><div className="cart-copy"><h3>{item.product.name}</h3><p>{item.config.temperature} · {item.config.sugar}{item.config.toppings.length ? ` · ${item.config.toppings.map((id) => toppings.find((top) => top.id === id)?.name).join('、')}` : ''}</p><div><strong>{money(linePrice(item))}</strong><Stepper compact value={item.quantity} onDecrease={() => item.quantity === 1 ? onRemove(item.key) : onUpdateQuantity(item.key, -1)} onIncrease={() => onUpdateQuantity(item.key, 1)} /></div></div><button className="remove" onClick={() => onRemove(item.key)} aria-label={`移除 ${item.product.name}`}>×</button></article>)}</div><div className="cart-summary"><button className={allSelected ? 'check selected' : 'check'} onClick={toggleAll}>{allSelected ? '✓' : ''}</button><button className="select-all" onClick={toggleAll}>全选</button><div className="cart-total"><small>合计</small><strong>{money(total)}</strong><span>已优惠 ¥0</span></div><button className="checkout" disabled={!selectedItems.length} onClick={() => onCheckout(selectedItems)}>去结算</button></div></>}</section>;
}

function CartSheet({ cart, onClose, onCart }) {
  const total = cart.reduce((sum, item) => sum + linePrice(item) * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (!cart.length) return null;
  return <div className="cart-sheet-mask" role="presentation" onClick={onClose}>
    <section className="cart-sheet" role="dialog" aria-modal="true" aria-label="已加入购物袋" onClick={(event) => event.stopPropagation()}>
      <div className="sheet-handle" />
      <div className="sheet-title"><div><small>已加入购物袋</small><h2>要现在结算吗？</h2></div><button onClick={onClose} aria-label="关闭购物袋提示">×</button></div>
      <div className="sheet-items">{cart.slice(0, 3).map((item) => <div className="sheet-item" key={item.key}><span className={`sheet-visual ${item.product.tone}`}>{item.product.emoji}</span><div><b>{item.product.name}</b><small>{item.config.temperature} · {item.config.sugar}</small></div><strong>×{item.quantity}</strong></div>)}{cart.length > 3 && <p className="sheet-more">还有 {cart.length - 3} 种饮品已加入购物袋</p>}</div>
      <div className="sheet-footer"><div><small>共 {count} 件，合计</small><strong>{money(total)}</strong></div><button onClick={onCart}>去结算</button></div>
      <button className="continue-shopping" onClick={onClose}>继续加购</button>
    </section>
  </div>;
}

function Home({ selectedCategory, setSelectedCategory, search, setSearch, recommendation, onRefresh, cartQuantity, itemCount, onView, onQuickAdd, onCart, couponClaimed }) {
  const visibleProducts = useMemo(() => products.filter((product) => (selectedCategory === '全部' || product.category === selectedCategory) && `${product.name}${product.note}${product.category}`.includes(search.trim())), [selectedCategory, search]);
  const productQty = (id) => itemCount(id);
  const recommendedProduct = products.find((product) => product.id === recommendation.productId);
  return <section className="screen home-screen"><header className="topbar"><div className="location-row"><button className="location"><span>⌖</span>浦东新区 · 世纪大道 <b>⌄</b></button><button className="icon-button" aria-label="通知">♧</button></div><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索奶茶、咖啡或门店" /><button onClick={() => setSearch('')} className={search ? 'clear-search show' : 'clear-search'}>×</button></label></header>
    <section className="promo-banner" style={{ backgroundImage: `linear-gradient(90deg, rgba(255, 226, 235, .95) 0%, rgba(255, 219, 230, .68) 48%, rgba(255, 207, 220, .08) 100%), url(${promoStrawberryMilkTea})` }}><div><span className="eyebrow">午后轻松喝</span><h1>第二杯半价</h1><button onClick={couponClaimed}>立即{couponClaimed ? '使用' : '领取'}</button></div></section>
    <section className="ai-card"><div className="ai-heading"><span className="ai-sparkle">✦</span><div><small>AI 今日推荐 · 基于你的口味偏好</small><h2>{recommendation.title}</h2></div><button className="refresh" onClick={onRefresh} aria-label="换一换推荐">↻</button></div><p>{recommendation.reason}</p><div className="tags">{recommendation.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="ai-add" onClick={() => onView(recommendedProduct)}>查看推荐饮品 <strong>{money(recommendedProduct.price)}</strong><i>›</i></button></section>
    <nav className="category-list" aria-label="饮品分类"><button className={selectedCategory === '全部' ? 'category active' : 'category'} onClick={() => setSelectedCategory('全部')}><i>✦</i><span>全部</span></button>{categories.map((category) => <button key={category.label} className={selectedCategory === category.label ? 'category active' : 'category'} onClick={() => setSelectedCategory(category.label)}><i>{category.icon}</i><span>{category.label}</span></button>)}</nav>
    <section className="recommendations"><div className="section-title"><div><small>{selectedCategory === '全部' ? '为你精选' : selectedCategory}</small><h2>{selectedCategory === '全部' ? '现在喝什么？' : `${selectedCategory}饮品`}</h2></div><button onClick={() => { setSelectedCategory('全部'); setSearch(''); }}>查看全部 ›</button></div><div className="product-grid">{visibleProducts.length ? visibleProducts.map((product) => <ProductCard key={product.id} product={product} quantity={productQty(product.id)} onView={onView} onQuickAdd={onQuickAdd} />) : <div className="empty"><span>⌕</span><b>没有找到相关饮品</b><p>试试“奶茶”或“果茶”</p><button onClick={() => setSearch('')}>清除搜索</button></div>}</div></section>
    {cartQuantity > 0 && <button className="floating-cart" onClick={onCart}><span className="floating-cart-icon">🧋<b>{cartQuantity}</b></span><div><small>已选 {cartQuantity} 件</small><strong>去购物袋</strong></div><em>›</em></button>}</section>;
}

function MenuScreen({ selectedCategory, setSelectedCategory, search, setSearch, itemCount, onView, onQuickAdd }) {
  const visibleProducts = useMemo(() => products.filter((product) => (selectedCategory === '全部' || product.category === selectedCategory) && `${product.name}${product.note}${product.category}`.includes(search.trim())), [selectedCategory, search]);
  return <section className="screen menu-screen"><header className="menu-header"><small>茶时光点单</small><h1>选择你的这一杯</h1><p>支持个性化定制，点加号可快速加入购物袋。</p><label className="menu-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索饮品" /><button onClick={() => setSearch('')} className={search ? 'clear-search show' : 'clear-search'}>×</button></label></header><nav className="category-list menu-categories" aria-label="点单分类"><button className={selectedCategory === '全部' ? 'category active' : 'category'} onClick={() => setSelectedCategory('全部')}><i>✦</i><span>全部</span></button>{categories.map((category) => <button key={category.label} className={selectedCategory === category.label ? 'category active' : 'category'} onClick={() => setSelectedCategory(category.label)}><i>{category.icon}</i><span>{category.label}</span></button>)}</nav><section className="menu-products"><div className="section-title"><div><small>{selectedCategory === '全部' ? '全部饮品' : selectedCategory}</small><h2>{visibleProducts.length} 款可选</h2></div></div><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} quantity={itemCount(product.id)} onView={onView} onQuickAdd={onQuickAdd} />)}</div></section></section>;
}

function StatusScreen({ type, orders, onHome, onCart, onMenu }) {
  if (type === 'orders' && orders.length) return <section className="screen status-screen orders-screen"><Header onBack={onHome} title="订单" /><div className="order-list"><p className="order-caption">最近订单</p>{orders.map((order) => <article className="order-card" key={order.id}><div><span>制作中</span><small>{order.time}</small></div><h2>茶时光 · 世纪大道店</h2><p>{order.count} 杯饮品 · 预计 {order.eta} 分钟送达</p><strong>{money(order.total)}</strong><button onClick={onCart}>查看购物袋</button></article>)}</div></section>;
  const content = type === 'orders' ? { emoji: '📦', title: '还没有订单', text: '每一杯好喝，都从现在下单开始。', action: '去点单', onClick: onMenu } : { emoji: '🌷', title: '下午好，茶友', text: '已为你保存 3 个口味偏好，AI 会越懂你。', action: '查看购物袋', onClick: onCart };
  return <section className="screen status-screen"><Header onBack={onHome} title={type === 'orders' ? '订单' : '我的'} /><div className="status-content"><div>{content.emoji}</div><h2>{content.title}</h2><p>{content.text}</p><button onClick={content.onClick}>{content.action}</button></div></section>;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [search, setSearch] = useState('');
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [detailProduct, setDetailProduct] = useState(null);
  const [cart, setCart] = useState(() => { try { return JSON.parse(window.localStorage.getItem('tea-cart')) || []; } catch { return []; } });
  const [orders, setOrders] = useState(() => { try { return JSON.parse(window.localStorage.getItem('tea-orders')) || []; } catch { return []; } });
  const [notice, setNotice] = useState(null);
  const [coupon, setCoupon] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);

  useEffect(() => window.localStorage.setItem('tea-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => window.localStorage.setItem('tea-orders', JSON.stringify(orders)), [orders]);
  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const showNotice = (message, action) => { setNotice({ message, action }); window.setTimeout(() => setNotice(null), 2600); };
  const openDetail = (product) => { setDetailProduct(product); setScreen('detail'); };
  const addToCart = (product, config = defaultConfig(product), quantity = 1, showSheet = false) => { const key = configKey(product, config); setCart((items) => { const existing = items.find((item) => item.key === key); return existing ? items.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { key, product, config, quantity }]; }); if (showSheet) setCartSheetOpen(true); showNotice(`${product.name} 已加入购物袋`, { label: '查看', onClick: () => setScreen('cart') }); };
  const updateQuantity = (key, change) => setCart((items) => items.map((item) => item.key === key ? { ...item, quantity: item.quantity + change } : item));
  const removeItem = (key) => { const item = cart.find((cartItem) => cartItem.key === key); setCart((items) => items.filter((cartItem) => cartItem.key !== key)); if (item) showNotice(`已移除 ${item.product.name}`, { label: '撤销', onClick: () => setCart((items) => [...items, item]) }); };
  const handleCheckout = (items) => { const count = items.reduce((sum, item) => sum + item.quantity, 0); const total = items.reduce((sum, item) => sum + linePrice(item) * item.quantity, 0); const keys = new Set(items.map((item) => item.key)); setCart((current) => current.filter((item) => !keys.has(item.key))); setOrders((current) => [{ id: `order-${Date.now()}`, count, total, time: '刚刚下单', eta: 25 }, ...current]); setScreen('orders'); showNotice(`已提交 ${count} 杯饮品，预计 25 分钟送达`); };
  const itemCount = (productId) => cart.filter((item) => item.product.id === productId).reduce((sum, item) => sum + item.quantity, 0);
  const goHome = () => { setScreen('home'); setDetailProduct(null); };
  const nav = (next) => { setCartSheetOpen(false); if (next === 'home') goHome(); else setScreen(next); };

  return <main className="page-shell"><section className="phone" aria-label="茶时光奶茶外卖应用原型">
    {screen === 'home' && <Home selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} search={search} setSearch={setSearch} recommendation={aiRecommendations[recommendationIndex]} onRefresh={() => { setRecommendationIndex((index) => (index + 1) % aiRecommendations.length); showNotice('已按你的口味偏好更新推荐'); }} cartQuantity={cartQuantity} itemCount={itemCount} onView={openDetail} onQuickAdd={(product) => addToCart(product, defaultConfig(product), 1, true)} onCart={() => setScreen('cart')} couponClaimed={() => { setCoupon((value) => !value); showNotice(coupon ? '已切换至优惠使用说明' : '优惠券已放入卡包'); }} />}
    {screen === 'menu' && <MenuScreen selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} search={search} setSearch={setSearch} itemCount={itemCount} onView={openDetail} onQuickAdd={(product) => addToCart(product, defaultConfig(product), 1, true)} />}
    {screen === 'detail' && <ProductDetail product={detailProduct} cartQuantity={cartQuantity} onBack={goHome} onAdd={(product, config, quantity) => { addToCart(product, config, quantity, true); setScreen('home'); }} onCart={() => setScreen('cart')} />}
    {screen === 'cart' && <CartScreen cart={cart} onBack={goHome} onUpdateQuantity={updateQuantity} onRemove={removeItem} onCheckout={handleCheckout} />}
    {screen === 'orders' && <StatusScreen type="orders" orders={orders} onHome={goHome} onCart={() => setScreen('cart')} onMenu={() => setScreen('menu')} />}
    {screen === 'profile' && <StatusScreen type="profile" orders={orders} onHome={goHome} onCart={() => setScreen('cart')} onMenu={() => setScreen('menu')} />}
    <nav className="bottom-nav" aria-label="主导航"><button className={screen === 'home' || screen === 'detail' ? 'active' : ''} onClick={() => nav('home')}><i>⌂</i><span>首页</span></button><button className={screen === 'menu' ? 'active' : ''} onClick={() => nav('menu')}><i>▣</i><span>点单</span></button><button className={screen === 'orders' ? 'active' : ''} onClick={() => nav('orders')}><i>▤</i><span>订单</span></button><button className={screen === 'profile' ? 'active' : ''} onClick={() => nav('profile')}><i>♙</i><span>我的</span></button></nav>
  </section><aside className="prototype-note"><span>交互升级版</span><h2>从种草到下单</h2><p>支持定制温度、甜度和加料；购物袋能编辑、选择、撤销删除，并保留加购状态。</p><div className="state-list"><span>✓ 商品详情</span><span>✓ 个性化加购</span><span>✓ 购物袋结算</span></div><strong>购物袋 {cartQuantity} 件</strong></aside>
  {cartSheetOpen && <CartSheet cart={cart} onClose={() => setCartSheetOpen(false)} onCart={() => { setCartSheetOpen(false); setScreen('cart'); }} />}
  {notice && <div className="toast"><span>✓</span><p>{notice.message}</p>{notice.action && <button onClick={() => { notice.action.onClick(); setNotice(null); }}>{notice.action.label}</button>}</div>}</main>;
}
