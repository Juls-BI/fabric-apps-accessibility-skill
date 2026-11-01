import { useState } from 'react';
import { useSalesQuery } from './data/useSalesQuery';
import { formatValue } from './data/format';
import './dashboard.css';

const REGION_COLORS: Record<string, string> = {
  North: '#4caf50',
  South: '#f44336',
  East: '#2196f3',
  West: '#ffeb3b',
};

export function SalesDashboard() {
  const [region, setRegion] = useState<string | null>(null);
  const [columns, setColumns] = useState(['Product', 'Region', 'Sales', 'Margin']);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { rows, status } = useSalesQuery({ region, search });

  const byRegion = Object.keys(REGION_COLORS).map(r => ({
    region: r,
    sales: rows.filter(x => x.region === r).reduce((s, x) => s + x.sales, 0),
  }));
  const max = Math.max(1, ...byRegion.map(r => r.sales));

  const onDragColumn = (from: number, to: number) => {
    const next = [...columns];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setColumns(next);
  };

  return (
    <div className="dashboard">
      <div className="header sticky">
        <div className="title">Sales dashboard</div>
        <input placeholder="Search products" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="icon-btn" onClick={() => { setRegion(null); setSearch(''); }}>
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" /></svg>
        </div>
      </div>

      {status === 'loading' && <div className="spinner" />}
      {status === 'error' && <div className="error-banner">Something went wrong</div>}

      <div className="chart" role="img" aria-label="Sales by region chart">
        {byRegion.map(r => (
          <div
            key={r.region}
            className={region === r.region ? 'bar selected' : 'bar'}
            style={{ height: `${(r.sales / max) * 200}px`, background: REGION_COLORS[r.region] }}
            onClick={() => setRegion(region === r.region ? null : r.region)}
            onMouseOver={() => setTooltip(`${r.region}: ${formatValue(r.sales, '$#,0')}`)}
            onMouseOut={() => setTooltip(null)}
          />
        ))}
        {tooltip && <div className="tooltip">{tooltip}</div>}
      </div>

      <div className="legend">
        {Object.entries(REGION_COLORS).map(([name, color]) => (
          <span key={name} className="swatch" style={{ background: color }} />
        ))}
      </div>

      <div className="grid">
        <div className="grid-row grid-head">
          {columns.map((c, i) => (
            <div
              key={c}
              className="grid-cell"
              draggable
              onDragStart={e => e.dataTransfer.setData('from', String(i))}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDragColumn(Number(e.dataTransfer.getData('from')), i)}
            >
              {c}
            </div>
          ))}
        </div>
        {rows.map(row => (
          <div className="grid-row" key={row.id}>
            {columns.map(c => (
              <div className="grid-cell" key={c}>{String(row[c.toLowerCase() as keyof typeof row])}</div>
            ))}
          </div>
        ))}
        {status === 'success' && rows.length === 0 && <div className="empty" />}
      </div>
    </div>
  );
}
