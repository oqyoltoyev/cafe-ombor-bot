import { useEffect, useState } from 'react'

function App() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
    loadOrders()
  }, [])

  const loadOrders = () => {
    if (!window.Telegram?.WebApp?.Serverless) {
      setLoading(false)
      return
    }
    window.Telegram.WebApp.Serverless.call('getOrders', {}, (err, result) => {
      setLoading(false)
      if (!err && result) setOrders(result.orders || [])
    })
  }

  const approveOrder = (id) => {
    window.Telegram.WebApp.Serverless.call('approveOrder', { orderId: id }, (err) => {
      if (!err) loadOrders()
    })
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Ombor</h1>
        <p style={{color: 'var(--tg-theme-hint-color)', marginTop: 4}}>Admin Panel • Beta</p>
      </div>

      {tab === 'orders' && (
        <div className="card">
          <div className="card-header">Buyurtmalar</div>
          {loading ? (
            <div style={{padding: 20, textAlign: 'center'}}>Yuklanmoqda...</div>
          ) : orders.length === 0 ? (
            <div style={{padding: 20, textAlign: 'center', color: '#8e8e93'}}>Hozircha buyurtma yo‘q</div>
          ) : (
            orders.map(o => (
              <div key={o.id} className="list-item">
                <div>
                  <div style={{fontWeight: 600}}>{o.date}</div>
                  <div style={{fontSize: 13, color: '#8e8e93'}}>{o.branch} • {o.itemCount || 0} ta</div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <span className={`status-badge status-${o.status}`}>{o.status}</span>
                  {o.status === 'draft' && (
                    <button onClick={() => approveOrder(o.id)} style={{background: '#007aff', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 13}}>Tasdiqlash</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'products' && (
        <div className="card">
          <div className="card-header">Mahsulotlar</div>
          <div style={{padding: 20, textAlign: 'center', color: '#8e8e93'}}>Katalog keyinroq</div>
        </div>
      )}

      <div className="bottom-nav">
        <div className={`nav-item ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          <div style={{fontSize: 22}}>📦</div>
          Buyurtmalar
        </div>
        <div className={`nav-item ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
          <div style={{fontSize: 22}}>📋</div>
          Katalog
        </div>
      </div>
    </div>
  )
}

export default App
