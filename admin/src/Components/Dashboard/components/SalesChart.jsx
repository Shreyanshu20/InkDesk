import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function SalesChart({ salesData, timeRange, setTimeRange }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount}`;
  };

  const formatFullCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      const hasData = salesData[timeRange].data.some((value) => value > 0);

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: salesData[timeRange].labels,
          datasets: [
            {
              label: "Sales Revenue",
              data: salesData[timeRange].data,
              fill: true,
              backgroundColor: isDarkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)",
              borderColor: isDarkMode
                ? "rgba(59, 130, 246, 1)"
                : "rgb(59, 130, 246)",
              tension: 0.4,
              pointBackgroundColor: isDarkMode
                ? "#ffffff"
                : "rgb(59, 130, 246)",
              pointBorderColor: isDarkMode ? "rgba(59, 130, 246, 1)" : "#fff",
              pointHoverBackgroundColor: "#ffffff",
              pointHoverBorderColor: "rgb(59, 130, 246)",
              pointRadius: hasData ? 6 : 4,
              pointHoverRadius: hasData ? 8 : 6,
              borderWidth: isDarkMode ? 3 : 2.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: isDarkMode ? "#ffffff" : "rgba(9, 7, 8, 0.9)",
                usePointStyle: true,
                boxWidth: 6,
                font: {
                  family: '"Red Rose", serif',
                },
              },
            },
            tooltip: {
              enabled: true,
              backgroundColor: isDarkMode
                ? "rgba(17, 24, 39, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              titleColor: isDarkMode ? "#ffffff" : "#1f2937",
              bodyColor: isDarkMode ? "#e5e7eb" : "#374151",
              borderColor: isDarkMode
                ? "rgba(59, 130, 246, 0.5)"
                : "rgba(59, 130, 246, 0.3)",
              borderWidth: 1,
              cornerRadius: 8,
              usePointStyle: true,
              padding: 12,
              titleFont: {
                size: 14,
                weight: "bold",
                family: '"Red Rose", serif',
              },
              bodyFont: {
                size: 13,
                family: '"Red Rose", serif',
              },
              displayColors: false,
              callbacks: {
                label: function (context) {
                  return `Revenue: ${formatFullCurrency(context.parsed.y)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: hasData ? undefined : 1000,
              grid: {
                display: true,
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                drawBorder: false,
              },
              ticks: {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.85)"
                  : "rgba(9, 7, 8, 0.7)",
                callback: function (value) {
                  return formatCurrency(value);
                },
                font: {
                  family: '"Red Rose", serif',
                  size: isDarkMode ? 12 : 11,
                },
                padding: 10,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.85)"
                  : "rgba(9, 7, 8, 0.7)",
                font: {
                  family: '"Red Rose", serif',
                  size: isDarkMode ? 12 : 11,
                },
                padding: 10,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          animation: {
            duration: 1000,
            easing: "easeOutQuart",
          },
        },
      });

      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [timeRange, salesData, isDarkMode]);

  const currentData = salesData[timeRange].data;
  const totalSales = currentData.reduce((sum, value) => sum + value, 0);
  const averageSales =
    currentData.length > 0 ? Math.round(totalSales / currentData.length) : 0;
  const highestSales = currentData.length > 0 ? Math.max(...currentData) : 0;
  const lowestSales = currentData.length > 0 ? Math.min(...currentData) : 0;
  const hasAnySales = totalSales > 0;

  return (
    <div className="bg-background p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-text mb-1">Sales Overview</h2>
          <p className="text-sm text-text/70">
            Total:{" "}
            <span className="font-semibold text-primary">
              {formatFullCurrency(totalSales)}
            </span>
            {!hasAnySales && (
              <span className="ml-2 text-orange-600 dark:text-orange-400">
                • No sales data yet
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              timeRange === "daily"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-text hover:bg-primary/20 dark:hover:bg-primary/30"
            }`}
            onClick={() => setTimeRange("daily")}
            aria-label="View daily sales data"
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              timeRange === "weekly"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-text hover:bg-primary/20 dark:hover:bg-primary/30"
            }`}
            onClick={() => setTimeRange("weekly")}
            aria-label="View weekly sales data"
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              timeRange === "monthly"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-text hover:bg-primary/20 dark:hover:bg-primary/30"
            }`}
            onClick={() => setTimeRange("monthly")}
            aria-label="View monthly sales data"
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-80 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : null}

        {!hasAnySales && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <i className="fas fa-chart-line text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              No Sales Data Available
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Sales data will appear here once you have orders with revenue.
            </p>
          </div>
        )}

        <canvas
          ref={chartRef}
          className={`
            ${
              isLoading
                ? "opacity-0"
                : hasAnySales
                ? "opacity-100 transition-opacity duration-500"
                : "opacity-20 transition-opacity duration-500"
            }
          `}
        ></canvas>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-text/70 uppercase tracking-wide font-medium">
            Highest
          </p>
          <p className="text-sm font-bold text-text mt-1">
            {formatCurrency(highestSales)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text/70 uppercase tracking-wide font-medium">
            Average
          </p>
          <p className="text-sm font-bold text-text mt-1">
            {formatCurrency(averageSales)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text/70 uppercase tracking-wide font-medium">
            Lowest
          </p>
          <p className="text-sm font-bold text-text mt-1">
            {formatCurrency(lowestSales)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SalesChart;
