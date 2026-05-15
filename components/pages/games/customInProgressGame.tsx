import { GameDetail } from "@/utils/types";

export default function CustomInProgressGame({
  currentPlayerIndex,
  actualPlayerIndex,
  displayedData,
  transitionPhase,
  isRoundTransition,
  transitionMessage,
  animateTurnTransition,
  transitionDuration,
  freezeBoardDuration,
}: {
  currentPlayerIndex: number;
  actualPlayerIndex: number;
  displayedData: GameDetail;
  transitionPhase: "none" | "showing-board" | "showing-text" | "game-finished";
  isRoundTransition: boolean;
  transitionMessage: string;
  animateTurnTransition: boolean;
  transitionDuration: number;
  freezeBoardDuration: number;
}) {
  return <></>;
}
