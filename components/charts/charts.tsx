"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Hook to detect an md screen (vs large screen) and adapt the chart heights accordingly.
function useMdScreenChartLayout(
  size = 1000,
  mdChartHeight = 220,
  largeChartHeight = 250,
) {
  const [isMdScreen, setIsMdScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMdScreen(window.innerWidth < size);

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [size]);

  return {
    isMdScreen,
    chartHeight: isMdScreen ? mdChartHeight : largeChartHeight,
  };
}

// Returns the circle radius based on screen size
function getChartRadii(isMdScreen: boolean) {
  if (isMdScreen) {
    return { innerRadius: 45, outerRadius: 70 }; // Thickness: 25px (thinner)
  }
  return { innerRadius: 45, outerRadius: 80 }; // Thickness: 35px (normal)
}

export function GamesPlayedDistributionChart({
  data,
}: {
  data: { name: string; games: number; wins: number }[];
}) {
  const chartData = data.slice(0, 15);
  // State to track which bar the user clicked on -> defaults to the first zone.
  const [selectedZone, setSelectedZone] = useState<string | null>(
    chartData.length > 0 ? chartData[0].name : null,
  );

  const selectedData = chartData.find((d) => d.name === selectedZone);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Dynamic textual summary above the chart showing the currently selected zone */}
      <div className="mb-4 text-center min-h-6">
        {selectedData ? (
          <p className="text-sm-2 font-bold">
            Zone sélectionnée :{" "}
            <span className="text-[#2454ff]">{selectedData.name}</span> —{" "}
            {selectedData.wins} victoires sur {selectedData.games} parties
            jouées
          </p>
        ) : (
          <p className="text-sm font-medium text-foreground-soft italic">
            Cliquez sur un bâtonnet pour afficher les détails
          </p>
        )}
      </div>

      {/* ResponsiveContainer makes the chart adapt to its parent div's width */}
      <ResponsiveContainer width="100%" height={300}>
        {/* Main wrapper for the bar chart */}
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
          onClick={(state: any) => {
            // Update selected zone when clicking on a bar or its axis area
            if (
              state &&
              state.activePayload &&
              state.activePayload.length > 0
            ) {
              setSelectedZone(state.activePayload[0].payload.name);
            }
          }}
        >
          {/* Light dashed lines in the background for visual reference */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

          {/* Horizontal axis representing the zones (e.g. "20", "19") */}
          <XAxis
            dataKey="name"
            name="Nom"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            dy={10}
          />

          {/* Vertical axis representing the number of hits */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            dx={-10}
          />

          {/* The tooltip that appears when hovering over a bar */}
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Bar
            dataKey="games"
            name="Parties jouées" // We change the en name "games" to "Parties jouées"
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
            onClick={(data: any) => {
              setSelectedZone(data.name);
            }}
          >
            {/* Map over each element to give it a specific color. Selected bar is blue, others are gray */}
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === selectedZone ? "#2454ff" : "#9ca3af"}
                className="cursor-pointer transition-colors duration-200"
              />
            ))}
          </Bar>
          <Bar
            dataKey="wins"
            name="Parties gagnées" // We change the en name "wins" to "Parties gagnées"
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
            onClick={(data: any) => {
              setSelectedZone(data.name);
            }}
          >
            {/* Map over each element to give it a specific color. Selected bar is blue, others are gray */}
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === selectedZone ? "#2454ff" : "#9ca3af"}
                className="cursor-pointer transition-colors duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HitDistributionChart({
  data,
}: {
  data: { zone: string; hits: number }[];
}) {
  const chartData = data.slice(0, 15);
  // State to track which bar the user clicked on -> defaults to the first zone.
  const [selectedZone, setSelectedZone] = useState<string | null>(
    chartData.length > 0 ? chartData[0].zone : null,
  );

  const selectedData = chartData.find((d) => d.zone === selectedZone);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Dynamic textual summary above the chart showing the currently selected zone */}
      <div className="mb-4 text-center min-h-6">
        {selectedData ? (
          <p className="text-sm-2 font-bold">
            Zone sélectionnée :{" "}
            <span className="text-[#2454ff]">{selectedData.zone}</span> —{" "}
            {selectedData.hits} fois touchée
          </p>
        ) : (
          <p className="text-sm font-medium text-foreground-soft italic">
            Cliquez sur un bâtonnet pour afficher les détails
          </p>
        )}
      </div>

      {/* ResponsiveContainer makes the chart adapt to its parent div's width */}
      <ResponsiveContainer width="100%" height={300}>
        {/* Main wrapper for the bar chart */}
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
          onClick={(state: any) => {
            // Update selected zone when clicking on a bar or its axis area
            if (
              state &&
              state.activePayload &&
              state.activePayload.length > 0
            ) {
              setSelectedZone(state.activePayload[0].payload.zone);
            }
          }}
        >
          {/* Light dashed lines in the background for visual reference */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

          {/* Horizontal axis representing the zones (e.g. "20", "19") */}
          <XAxis
            dataKey="zone"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            dy={10}
          />

          {/* Vertical axis representing the number of hits */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            dx={-10}
          />

          {/* The tooltip that appears when hovering over a bar */}
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Bar
            dataKey="hits"
            name="Touches" // We change the en name "hits" to "Touches"
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
            onClick={(data: any) => {
              setSelectedZone(data.zone);
            }}
          >
            {/* Map over each element to give it a specific color. Selected bar is blue, others are gray */}
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.zone === selectedZone ? "#2454ff" : "#9ca3af"}
                className="cursor-pointer transition-colors duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WinRateChart({ wins, games }: { wins: number; games: number }) {
  const { isMdScreen, chartHeight } = useMdScreenChartLayout();
  const radii = getChartRadii(isMdScreen);

  const winPercent = games > 0 ? Math.round((wins / games) * 100) : 0;
  const losses = Math.max(0, games - wins);
  const lossPercent = games > 0 ? 100 - winPercent : 0;

  const data = [
    { name: `Victoires (${winPercent}%)`, value: wins },
    { name: `Défaites (${lossPercent}%)`, value: losses },
  ];

  if (games === 0)
    return (
      <p className="text-foreground-soft italic text-center">
        Aucune partie jouée
      </p>
    );

  return (
    <ResponsiveContainer
      // className="relative"
      width="100%"
      height={chartHeight}
    >
      {/* <p className="absolute text-center top-0 left-0 right-0 subtitle">
        Wins vs Losses
      </p> */}
      {/* PieChart behaves as a wrapper for circular charts  */}
      <PieChart>
        {/* Pie draws the actual slices based on the 'value' dataKey */}
        <Pie
          data={data}
          cx="50%" // Center X of the pie
          cy="50%" // Center Y of the pie
          innerRadius={radii.innerRadius} // Creates a donut shape instead of a solid pie
          outerRadius={radii.outerRadius}
          paddingAngle={3} // Small gap between each slice
          dataKey="value" // Value used to calculate the proportion of each slice
          stroke="none"
          labelLine={false}
        >
          {/* Each Cell corresponds to a slice. They are mapped in order of our 'data' array */}
          <Cell fill="#2454ff" /> {/* Wins */}
          <Cell fill="#4b5563" /> {/* Losses */}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        {/* Legend automatically detects data names (e.g. "Victoires (XX%)") and adds colored dots below */}
        <Legend
          verticalAlign="bottom"
          height={40}
          iconType="circle"
          wrapperStyle={{ fontSize: "13px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HitMissChart({
  thrown,
  misses,
}: {
  thrown: number;
  misses: number;
}) {
  const { isMdScreen, chartHeight } = useMdScreenChartLayout();
  const radii = getChartRadii(isMdScreen);

  const hits = Math.max(0, thrown - misses);
  const hitPercent = thrown > 0 ? Math.round((hits / thrown) * 100) : 0;
  const missPercent = thrown > 0 ? 100 - hitPercent : 0;

  const data = [
    { name: `Dans la cible (${hitPercent}%)`, value: hits },
    { name: `Ratés (${missPercent}%)`, value: misses },
  ];

  if (thrown === 0)
    return (
      <p className="text-foreground-soft italic text-center">
        Aucune fléchette lancée
      </p>
    );

  return (
    <ResponsiveContainer
      // className="relative"
      width="100%"
      height={chartHeight}
    >
      {/* <p className="absolute text-center top-0 left-0 right-0 subtitle">
        Précision globale
      </p> */}
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={radii.innerRadius}
          outerRadius={radii.outerRadius}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
          labelLine={false}
        >
          <Cell fill="#0dd951" />
          <Cell fill="#ff4040" />
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={40}
          iconType="circle"
          wrapperStyle={{ fontSize: "13px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Podium({ targets }: { targets: string[] }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Small delay to start the animation after component mounts
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!targets || targets.length === 0) return null;

  return (
    <div className="flex items-end justify-center h-48 gap-2 xs:gap-4 mt-6">
      {/* 2ND PLACE */}
      {targets.length > 1 && (
        <div className="flex flex-col items-center justify-end h-full">
          <div
            className="text-sm font-bold text-gray-600 mb-1 transition-opacity duration-700 delay-300"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            {targets[1]}
          </div>
          <div
            className="w-16 sm:w-20 bg-gray-300 rounded-t-lg flex flex-col justify-end text-center pb-2 font-black text-gray-50/80 shadow-inner transition-all duration-1000 ease-out"
            style={{ height: loaded ? "60%" : "0%" }}
          >
            {loaded && <span>2</span>}
          </div>
        </div>
      )}

      {/* 1ST PLACE */}
      {targets.length > 0 && (
        <div className="flex flex-col items-center justify-end h-full">
          <div
            className="text-xl sm:text-2xl font-black text-yellow-500 mb-2 drop-shadow-sm transition-opacity duration-700 delay-500"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            {targets[0]}
          </div>
          <div
            className="w-20 sm:w-24 bg-yellow-400 rounded-t-lg flex flex-col justify-end text-center pb-4 font-black text-yellow-50/80 text-xl shadow-inner transition-all duration-[1200ms] ease-out delay-150"
            style={{ height: loaded ? "85%" : "0%" }}
          >
            {loaded && <span>1</span>}
          </div>
        </div>
      )}

      {/* 3RD PLACE */}
      {targets.length > 2 && (
        <div className="flex flex-col items-center justify-end h-full">
          <div
            className="text-sm font-bold text-amber-700 mb-1 transition-opacity duration-700 delay-100"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            {targets[2]}
          </div>
          <div
            className="w-16 sm:w-20 bg-amber-600/80 rounded-t-lg flex flex-col justify-end text-center pb-2 font-black text-amber-50/80 shadow-inner transition-all duration-700 ease-out"
            style={{ height: loaded ? "45%" : "0%" }}
          >
            {loaded && <span>3</span>}
          </div>
        </div>
      )}
    </div>
  );
}
