import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, actionLabel, onAction }) => {
  const colorMap = {
    indigo: 'from-indigo-600/20 to-indigo-900/10 border-indigo-500/30 text-indigo-400',
    emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-600/20 to-amber-900/10 border-amber-500/30 text-amber-400',
    rose: 'from-rose-600/20 to-rose-900/10 border-rose-500/30 text-rose-400',
    purple: 'from-purple-600/20 to-purple-900/10 border-purple-500/30 text-purple-400',
  };

  const badgeColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition duration-200 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badgeColor} border flex items-center justify-center shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {actionLabel && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
          <button
            onClick={onAction}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
          >
            {actionLabel} &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default StatCard;
