import { useEffect, useState } from 'react'

function App() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      tg.setHeaderColor('#f2f2f7')
    }
    loadData()
  }, [])

  const call = (name, data = {}) => new Promise((resolve, reject) => {
    if (!window.Telegram?.WebApp?.Serverless) {
      reject(new Error('Serverless mavjud emas'))
      return
    }
    window.Telegram.WebApp.Serverless.call(name, data, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const o = await call('getOrders')
      setOrders(o.orders || [])
      const s = await call('getSettings')
      setSettings(s.settings || {})
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const approve = async (id) => {
    try {
      await call('approveOrder', { orderId: id })
      alert('Ombor guruhiga yuborildi')
      loadData()
    } catch (e) {
      alert(e.message || 'Xato')
    }
  }

  const sendShort = async (id) => {
    try {
      const r = await call('sendShortages', { orderId: id })
      alert(r.shortages ? `${r.shortages} ta kamchilik yuborildi` : 'Kamchilik yo\u2018q')
      loadData()
    } catch (e) {
      alert(e.message || 'Xato')
    }
  }

  const saveSetting = async (key, value) => {
    try {
      await call('updateSetting', { key, value })
      setSettings(prev => ({ ...prev, [key]: value }))
      alert('Saqlandi')
    } catch (e) {
      alert(e.message || 'Xato')
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Ombor</h1>
        <p style={{ color: 'var(--tg-theme-hint-color)', marginTop: 2, fontSize: 15 }}>
          Admin \u2022 {settings.branch_name || 'ESKI SHAHAR'}
        </p>
      </div>

      {tab === 'orders' && (
        <div>
          <div className="card">
            <div className="card-header">Buyurtmalar</div>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center' }}>Yuklanmoqda...</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#8e8e93' }}>Hozircha yo\u2018q</div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="list-item" onClick={() => setSelectedOrder(o)}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{o.date}</div>
                    <div style={{ fontSize: 13, color: '#8e8e93' }}>#{o.id} \u2022 {o.itemCount || 0} ta</div>
                  </div>
                  <span className={`status-badge status-${o.status}`}>{o.status}</span>
                </div>
              ))
            )}
          </div>

          {selectedOrder && (
            <div className="card">
              <div className="card-header">Buyurtma #{selectedOrder.id}</div>
              <div style={{ padding: 16 }}>
                <div>Sana: {selectedOrder.date}</div>
                <div>Status: {selectedOrder.status}</div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedOrder.status === 'draft' && (
                    <button className="btn" style={{ width: 'auto', margin: 0 }} onClick={() => approve(selectedOrder.id)}>
                      Ombor ga yuborish
                    </button>
                  )}
                  {(selectedOrder.status === 'sent' || selectedOrder.status === 'receiving') && (
                    <button className="btn btn-secondary" style={{ width: 'auto', margin: 0 }} onClick={() => sendShort(selectedOrder.id)}>
                      Kamchilikni yuborish
                    </button>
                  )}
                  <button className="btn btn-secondary" style={{ width: 'auto', margin: 0 }} onClick={() => setSelectedOrder(null)}>
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="card">
          <div className="card-header">Sozlamalar</div>
          <SettingRow label="Admin ID lar (vergul bilan)" value={settings.admin_ids || ''} onSave={v => saveSetting('admin_ids', v)} />
          <SettingRow label="Ombor guruh ID" value={settings.warehouse_group_id || ''} onSave={v => saveSetting('warehouse_group_id', v)} />
          <SettingRow label="Bo\u2018lim guruhlari ID" value={settings.department_groups || ''} onSave={v => saveSetting('department_groups', v)} />
          <SettingRow label="Filial nomi" value={settings.branch_name || ''} onSave={v => saveSetting('branch_name', v)} />
          <div style={{ padding: 16, fontSize: 13, color: '#8e8e93' }}>
            Birinchi marta: terminalda `tgcloud/lib/seed.js` ichidagi default qiymatlarni o\u2018zgartiring yoki shu yerdan kiriting.
          </div>
        </div>
      )}

      <div className="bottom-nav">
        <div className={`nav-item ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          <div style={{ fontSize: 24 }}>\ud83d\udce6</div>
          Buyurtmalar
        </div>
        <div className={`nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
          <div style={{ fontSize: 24 }}>\u2699\ufe0f</div>
          Sozlamalar
        </div>
      </div>
    </div>
  )
}

function SettingRow({ label, value, onSave }) {
  const [val, setVal] = useState(value)
  useEffect(() => setVal(value), [value])

  return (
    <div style={{ padding: '12px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: 13, color: '#8e8e93', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
        />
        <button onClick={() => onSave(val)} style={{ background: '#007aff', color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 600 }}>
          Saqlash
        </button>
      </div>
    </div>
  )
}

export default App
