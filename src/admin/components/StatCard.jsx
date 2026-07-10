import React from "react";

export default function StatCard({
  icon: Icon,
  title,
  value,
  change,
  isPositive = true,
  color = "blue",
}) {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-50",
    green: "bg-green-500 text-green-50",
    purple: "bg-purple-500 text-purple-50",
    orange: "bg-orange-500 text-orange-50",
    red: "bg-red-500 text-red-50",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : "-"}
              {change}% from last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  );
}