import React from "react";

// Simple Line Chart Component
export const LineChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }

  const maxValue = Math.max(...data.map((d) => d.sales || d.revenue || 0));
  const minValue = 0;
  const range = maxValue - minValue;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64 flex items-flex-end justify-around space-x-2">
        {data.slice(-30).map((point, idx) => {
          const height = ((point.sales || point.revenue || 0) - minValue) / range * 100;
          return (
            <div
              key={idx}
              className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition"
              style={{ height: `${height || 5}%`, minHeight: "4px" }}
              title={`${point.date}: ${point.sales || point.revenue}`}
            ></div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
};

// Simple Bar Chart Component
export const BarChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }

  const maxValue = Math.max(...data.map((d) => d.revenue || d.sales || 0));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-600">${item.revenue || item.sales}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition"
                style={{ width: `${((item.revenue || item.sales) / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};