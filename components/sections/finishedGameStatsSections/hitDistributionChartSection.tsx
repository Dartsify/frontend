"use client";

import { useEffect, useState } from "react";

import { HitDistributionChart } from "@/components/charts/charts";

import Selector from "@/components/selector";

import { useSelector } from "@/lib/hooks/useSelector";

import { GameDetail, GameStats, ZoneStat } from "@/utils/types";

export default function HitDistributionChartSection({
  chartData: data,
  gameData,
}: {
  chartData: GameStats;
  gameData: GameDetail;
}) {
  const [chartData, setChartData] = useState<{ zone: string; hits: number }[]>(
    data.zone_stats.map((i: any) => ({
      zone: i.zone.toString(),
      hits: i.total_hits,
    })),
  );

  const { participations } = gameData;
  const participationsName = participations.map((p) => p.player_name);

  const selectorControls = useSelector(0); // We set the default index to 0 -> by default, "Global" is selected and showed
  const { selectedIndex } = selectorControls;

  useEffect(() => {
    let nextChartData;

    if (selectedIndex == null) return;

    if (selectedIndex === 0) {
      nextChartData = data.zone_stats.map((i: ZoneStat) => ({
        zone: i.zone.toString(),
        hits: i.total_hits,
      }));
    } else {
      //   const selectedPlayerUsername =
      //     participations[selectedIndex - 1].player_username; // -1 because the first option is "Global" and then we have the players in order
      const selectedPlayerNamer = participationsName[selectedIndex - 1];

      nextChartData = data.zone_stats
        .map((i: ZoneStat) => ({
          zone: i.zone.toString(),
          hits: i.number[selectedPlayerNamer] || 0, // If the player didn't hit this zone at all, it won't be in the "number" object, so we return 0 in this case
        }))
        .sort((a, b) => b.hits - a.hits); // We sort the zones by number of hits for this player to have a more relevant chart (the most hit zones will be first)
    }

    setChartData(nextChartData);
  }, [selectedIndex]);

  return (
    <section className="default-section">
      <div className="card">
        <div className="flex flex-col w-full h-full">
          <div className="flex justify-between items-center">
            <h3>Distribution des zones touchées</h3>
            <Selector
              selectorControls={selectorControls}
              options={["Global", ...participationsName]}
            />
          </div>
          <div className="content">
            <HitDistributionChart data={chartData} />
          </div>
        </div>
      </div>
    </section>
  );
}
