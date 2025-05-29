import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function SalesChart({ salesData, timeRange, setTimeRange }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Re-check dark mode when theme changes
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
    // Simulate loading
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: salesData[timeRange].labels,
          datasets: [
            {
              label: "Sales",
              data: salesData[timeRange].data,
              fill: true,
              backgroundColor: isDarkMode
                ? "rgba(185, 65, 81, 0.35)" // Increased opacity for dark mode
                : "rgba(190, 72, 87, 0.1)",
              borderColor: isDarkMode
                ? "rgba(241, 82, 101, 1)" // Brighter accent color in dark mode
                : "var(--primary)",
              tension: 0.4,
              pointBackgroundColor: isDarkMode ? "#ffffff" : "var(--primary)", // White points in dark mode
              pointBorderColor: isDarkMode ? "rgba(241, 82, 101, 1)" : "#fff",
              pointHoverBackgroundColor: "#ffffff",
              pointHoverBorderColor: "var(--accent)",
              pointRadius: 5, // Larger points
              pointHoverRadius: 8,
              borderWidth: isDarkMode ? 2.5 : 2, // Thicker line for dark mode
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
                color: isDarkMode ? "#ffffff" : "rgba(9, 7, 8, 0.9)", // Brighter text in dark mode
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
                ? "rgba(255, 255, 255, 0.9)" // Light background in dark mode for contrast
                : "rgba(255, 255, 255, 0.9)",
              titleColor: isDarkMode ? "#000000" : "#333333", // Dark text for contrast
              bodyColor: isDarkMode ? "#333333" : "#666666",
              borderColor: isDarkMode
                ? "rgba(241, 82, 101, 0.7)" // Brighter border
                : "rgba(190, 72, 87, 0.2)",
              borderWidth: 2,
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
              displayColors: false, // Hide color boxes
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    }).format(context.parsed.y);
                  }
                  return label;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.08)" // Slightly more visible in dark mode
                  : "rgba(0, 0, 0, 0.05)",
                drawBorder: false,
              },
              ticks: {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.85)" // Brighter text in dark mode
                  : "rgba(9, 7, 8, 0.7)",
                callback: function (value) {
                  return "$" + value.toLocaleString();
                },
                font: {
                  family: '"Red Rose", serif',
                  size: isDarkMode ? 12 : 11, // Larger in dark mode
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
                  ? "rgba(255, 255, 255, 0.85)" // Brighter text in dark mode
                  : "rgba(9, 7, 8, 0.7)",
                font: {
                  family: '"Red Rose", serif',
                  size: isDarkMode ? 12 : 11, // Larger in dark mode
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
          elements: {
            point: {
              // Add a shadow to make points stand out more
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              shadowBlur: 10,
              shadowColor: isDarkMode
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(0, 0, 0, 0.2)",
            },
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

  return (
    <div className="bg-background p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-text">Sales Overview</h2>
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
        <canvas
          ref={chartRef}
          className={`
            ${
              isLoading
                ? "opacity-0"
                : "opacity-100 transition-opacity duration-500"
            }
          `}
        ></canvas>
      </div>
    </div>
  );
}

export default SalesChart;
