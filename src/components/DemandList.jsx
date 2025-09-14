import React from "react";

export default function DemandList({ demands, selectedId, onSelectDemand }) {
  return (
    <div className="demand-list">
      {demands.map((d) => (
        <div
          key={d.id}
          className={`demand-card ${selectedId === d.id ? "selected" : ""}`}
          onClick={() => onSelectDemand(d)}
        >
          <div className="demand-header">
            <strong>{d.type}</strong>
            <span className="demand-author">by {d.author || "匿名用户"}</span>
          </div>
          <div className="demand-details">
            {d.time} | {d.location}
          </div>
          {d.desc && <div className="demand-desc">{d.desc}</div>}
        </div>
      ))}
    </div>
  );
}