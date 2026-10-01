import { useMemo, useState } from 'react';

const categories = [
  { label: '奶茶', icon: '☕' },
  { label: '咖啡', icon: '◉' },
  { label: '果茶', icon: '◌' },
  { label: '小料', icon: '♧' },
  { label: '优惠券', icon: '▣' },
];

const products = [
  { id: 1, name: '粉云莓莓拿铁', note: '草莓奶盖 · 低因', price: 18, emoji: '☕', tone: 'pink', category: '咖啡' },
  { id: 2, name: '桂花乌龙奶茶', note: '轻乳茶 · 少糖推荐', price: 16, emoji: '🥤', tone: 'peach', category: '奶茶' },
  { id: 3, name: '青提茉莉轻茶', note: '清爽 · 0 脂', price: 15, emoji: '🍵', tone: 'mint', category: '果茶' },
];

const aiRecommendations = [
  {
    productId: 2,
    title: '今天，试试桂花乌龙奶茶',
    reason: '上海 28℃，而且你偏好少糖轻乳茶；它清爽不腻，适合下午开会前来一杯。',
    tags: ['少糖', '轻乳茶', '下午提神'],
  },
  {
    productId: 1,
    title: '今天，试试粉云莓莓拿铁',
    reason: '你近两次选择了低因咖啡，今天有第二杯半价，和同事拼单更划算。',
    tags: ['低因', '第二杯半价', '拼单友好'],
  },
  {
    productId: 3,
    title: '今天，试试青提茉莉轻茶',
    reason: '天气偏热，按你的“清爽、少负担”偏好，推荐这杯冰饮。',
    tags: ['清爽', '冰饮', '0 脂'],
  },
];

const money = (value) => `¥${value}`;

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className={`product-visual ${product.tone}`} aria-label={`${product.name} 示意图`}>
        <span>{product.emoji}</span>
      </div>
      <div className="product-copy">
        <h3>{product.name}</h3>
        <p>{product.note}</p>
        <div className="product-footer">
          <strong>{money(product.price)}</strong>
          <button className="round-add" onClick={() => onAdd(product)} aria-label={`加入 ${product.name}`}>+</button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [activeTab, setActiveTab] = useState('首页');
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [notice, setNotice] = useState('');

  const recommendation = aiRecommendations[recommendationIndex];
  const recommendedProduct = products.find((product) => product.id === recommendation.productId);
  const visibleProducts = useMemo(() => products.filter((product) => {
    const categoryMatch = selectedCategory === '全部' || product.category === selectedCategory;
    const searchMatch = `${product.name}${product.note}`.includes(search.trim());
    return categoryMatch && searchMatch;
  }), [selectedCategory, search]);

  function addToCart(product) {
    setCart((items) => [...items, product]);
    setNotice(`${product.name} 已加入购物车`);
    window.setTimeout(() => setNotice(''), 1800);
  }

  function refreshRecommendation() {
    setRecommendationIndex((index) => (index + 1) % aiRecommendations.length);
    setNotice('已按模拟偏好更新推荐');
    window.setTimeout(() => setNotice(''), 1800);
  }

  return (
    <main className="page-shell">
      <section className="phone" aria-label="茶时光奶茶外卖首页原型">
        <header className="topbar">
          <div className="location-row">
            <button className="location" aria-label="选择配送地址"><span>⌖</span>浦东新区 · 世纪大道 <b>⌄</b></button>
            <button className="icon-button" aria-label="通知">♧</button>
          </div>
          <label className="search-box">
            <span>⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索奶茶、咖啡或门店" />
          </label>
        </header>

        <section className="promo-banner">
          <div>
            <span className="eyebrow">午后轻松喝</span>
            <h1>第二杯半价</h1>
            <button onClick={() => setNotice('优惠已领取，快邀请同事拼单吧！')}>马上领取</button>
          </div>
          <div className="drink-orb" aria-hidden="true">🧋</div>
        </section>

        <section className="ai-card" aria-live="polite">
          <div className="ai-heading">
            <span className="ai-sparkle">✦</span>
            <div><small>AI 今日推荐 · 模拟数据</small><h2>{recommendation.title}</h2></div>
            <button className="refresh" onClick={refreshRecommendation} aria-label="换一换推荐">↻</button>
          </div>
          <p>{recommendation.reason}</p>
          <div className="tags">{recommendation.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <button className="ai-add" onClick={() => addToCart(recommendedProduct)}>加入推荐饮品 · {money(recommendedProduct.price)}</button>
        </section>

        <nav className="category-list" aria-label="饮品分类">
          <button className={selectedCategory === '全部' ? 'category active' : 'category'} onClick={() => setSelectedCategory('全部')}><i>✦</i><span>全部</span></button>
          {categories.map((category) => (
            <button key={category.label} className={selectedCategory === category.label ? 'category active' : 'category'} onClick={() => setSelectedCategory(category.label)}>
              <i>{category.icon}</i><span>{category.label}</span>
            </button>
          ))}
        </nav>

        <section className="recommendations">
          <div className="section-title"><h2>推荐咖啡</h2><button onClick={() => setSelectedCategory('全部')}>查看全部 ›</button></div>
          <div className="product-grid">
            {visibleProducts.length ? visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />) : <p className="empty">没有匹配的饮品，换个关键词试试。</p>}
          </div>
        </section>

        <nav className="bottom-nav" aria-label="主导航">
          {['首页', '点单', '订单', '我的'].map((tab, index) => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              <i>{['⌂', '▣', '▤', '♙'][index]}</i><span>{tab}</span>
            </button>
          ))}
        </nav>
      </section>
      <aside className="prototype-note">
        <span>React 可运行原型</span>
        <h2>AI 推荐可交互</h2>
        <p>点击“换一换”、分类、搜索或加号，体验模拟的推荐与加购流程。</p>
        <strong>购物车 {cart.length} 件</strong>
      </aside>
      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}
