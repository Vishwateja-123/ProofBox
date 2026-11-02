import React from 'react';

export function StatCard({ title, value, subtext, icon: Icon }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-label">{title}</span>
        {Icon && (
          <div className="metric-icon-box">
            <Icon size={16} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="metric-value">{value}</div>
      {subtext && <div className="metric-subtext">{subtext}</div>}
    </div>
  );
}
export default StatCard;
