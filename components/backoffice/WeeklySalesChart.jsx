"use client";
import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

// ✅ Register ChartJS ONCE (outside component)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeeklySalesChart() {
  const labels = useMemo(
    () => ["January", "February", "March", "April", "May", "June", "July"],
    []
  );

  const tabs = useMemo(() => {
    return [
      {
        title: "Sales",
        type: "sales",
        data: {
          labels,
          datasets: [
            {
              label: "Sales",
              data: labels.map(() =>
                faker.datatype.number({ min: -1000, max: 1000 })
              ),
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        },
      },
      {
        title: "Orders",
        type: "orders",
        data: {
          labels,
          datasets: [
            {
              label: "Orders",
              data: labels.map(() =>
                faker.datatype.number({ min: -1000, max: 1000 })
              ),
              borderColor: "rgb(0, 137, 132)",
              backgroundColor: "rgba(0, 137, 132, 0.5)",
            },
          ],
        },
      },
    ];
  }, [labels]);

  const [chartToDisplay, setChartToDisplay] = useState(tabs[0].type);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
        },
      },
    }),
    []
  );

  return (
    <div className="dark:bg-slate-700 bg-slate-50 p-8 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        Weekly Sales
      </h2>

      <div className="p-4">
        {/* Tabs */}
        <div className="text-sm font-medium text-center text-gray-200 border-b border-gray-400 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {tabs.map((tab, i) => (
              <li className="me-2" key={i}>
                <button
                  onClick={() => setChartToDisplay(tab.type)}
                  className={
                    chartToDisplay === tab.type
                      ? "inline-block p-4 text-orange-600 border-b-2 border-orange-600 rounded-t-lg active dark:text-orange-500 dark:border-orange-500"
                      : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-slate-500 hover:text-orange-600 hover:border-gray-100 dark:hover:text-gray-100"
                  }
                >
                  {tab.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chart Display */}
        <div className="mt-4">
          {tabs.map((tab) =>
            chartToDisplay === tab.type ? (
              <Line key={tab.type} options={options} data={tab.data} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}