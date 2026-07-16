import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { TrendingUp, ShoppingBag, Clock, Users, Package } from 'lucide-react';
import { revenueChartData, adminStatsData } from '../data/mockData';

const STATUS_LABELS = {
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

const StatusBadge = ({ status }) => {
  const statusClasses = {
    DELIVERED: 'adm-badge-delivered',
    PROCESSING: 'adm-badge-processing',
    SHIPPED: 'adm-badge-shipped',
    CANCELLED: 'adm-badge-cancelled'
  };
  return <span className={`adm-badge ${statusClasses[status] || ''}`}>{STATUS_LABELS[status] || status}</span>;
};

const MonthlyRevenueChart = () => {
  const maxRevenue = Math.max(...revenueChartData.map(d => d.revenue));
  const spacing = 660 / (revenueChartData.length - 1);
  
  const points = revenueChartData.map((d, idx) => ({
    x: 20 + idx * spacing,
    y: 140 - (d.revenue / maxRevenue) * 120,
    ...d
  }));
  
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M${points[0].x},140 ` + points.map(p => `L${p.x},${p.y}`).join(' ') + ` L${points[points.length - 1].x},140 Z`;

  return (
    <div className="adm-chart-wrap">
      <svg viewBox="0 0 700 160" preserveAspectRatio="none" className="adm-svg">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a6b5e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1a6b5e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGrad)" />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#1a6b5e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="4" fill="#1a6b5e" />
            <text x={p.x} y="156" textAnchor="middle" fontSize="9" fill="#718096">
              {p.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const SalesByCategoryChart = () => {
  const totalCircumference = 2 * Math.PI * 52;
  let runningPercent = 0;

  const sectors = adminStatsData.map(sector => {
    const strokeDasharray = `${(sector.pct / 100) * totalCircumference} ${totalCircumference - (sector.pct / 100) * totalCircumference}`;
    const strokeDashoffset = -(runningPercent * totalCircumference) / 100;
    runningPercent += sector.pct;
    return { ...sector, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="adm-donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {sectors.map((sector, idx) => (
          <circle
            key={idx}
            cx="70"
            cy="70"
            r="52"
            fill="none"
            stroke={sector.color}
            strokeWidth="22"
            strokeDasharray={sector.strokeDasharray}
            strokeDashoffset={sector.strokeDashoffset}
            transform="rotate(-90 70 70)"
          />
        ))}
        <text x="70" y="64" textAnchor="middle" fontSize="11" fill="#4a5568" fontWeight="600">
          Sales
        </text>
        <text x="70" y="80" textAnchor="middle" fontSize="11" fill="#4a5568" fontWeight="600">
          Mix
        </text>
      </svg>
      <div className="adm-donut-legend">
        {adminStatsData.map((sector, idx) => (
          <div className="adm-legend-row" key={idx}>
            <span className="adm-legend-dot" style={{ background: sector.color }} />
            <span className="adm-legend-label">{sector.label}</span>
            <span className="adm-legend-pct">{sector.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminOverview = () => {
  const { stats, orders } = useAdmin();

  const statCards = [
    {
      label: 'Total Revenue',
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: <TrendingUp size={22} />,
      cls: 'adm-sc-green'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingBag size={22} />,
      cls: 'adm-sc-blue'
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <Clock size={22} />,
      cls: 'adm-sc-yellow'
    },
    {
      label: 'Customers',
      value: stats.totalUsers,
      icon: <Users size={22} />,
      cls: 'adm-sc-purple'
    },
    {
      label: 'Products',
      value: stats.totalProducts,
      icon: <Package size={22} />,
      cls: 'adm-sc-teal'
    }
  ];

  return (
    <div className="adm-section">
      <div className="adm-stat-grid">
        {statCards.map((card, idx) => (
          <div className="adm-stat-card" key={idx}>
            <div className={`adm-stat-icon ${card.cls}`}>{card.icon}</div>
            <div>
              <div className="adm-stat-val">{card.value}</div>
              <div className="adm-stat-lbl">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-grid-2">
        <div className="adm-panel">
          <div className="adm-panel-hd">
            <h3>Monthly Revenue</h3>
          </div>
          <MonthlyRevenueChart />
        </div>
        <div className="adm-panel">
          <div className="adm-panel-hd">
            <h3>Sales by Category</h3>
          </div>
          <SalesByCategoryChart />
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-panel-hd">
          <h3>Recent Orders</h3>
        </div>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map(order => (
              <tr key={order.id}>
                <td className="adm-mono">{order.orderNo}</td>
                <td>{order.user?.name}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td className="adm-bold">KSh {Number(order.total).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminOverview;
