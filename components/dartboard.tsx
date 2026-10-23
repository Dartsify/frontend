type DartPoint = {
  x: number;
  y: number;
  color?: string;
};

type DartboardProps = {
  point?: DartPoint;
  points?: DartPoint[];
  size?: number;
  maxCoordinate?: number;
};

const REAL_BOARD = {
  boardOuterRadius: 225.5,
  doubleOuterRadius: 170,
  doubleInnerRadius: 162,
  tripleOuterRadius: 107,
  tripleInnerRadius: 99,
  bullOuterRadius: 15.9,
  bullInnerRadius: 6.35,
};

const SEGMENT_ORDER = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

export default function Dartboard({
  point,
  points,
  size = 320,
  maxCoordinate = REAL_BOARD.doubleOuterRadius,
}: DartboardProps) {
  const center = size / 2;
  const drawableRadius = size * 0.48;
  const pxPerMm = drawableRadius / REAL_BOARD.boardOuterRadius;

  const boardOuterR = REAL_BOARD.boardOuterRadius * pxPerMm;
  const doubleOuterR = REAL_BOARD.doubleOuterRadius * pxPerMm;
  const doubleInnerR = REAL_BOARD.doubleInnerRadius * pxPerMm;
  const tripleOuterR = REAL_BOARD.tripleOuterRadius * pxPerMm;
  const tripleInnerR = REAL_BOARD.tripleInnerRadius * pxPerMm;
  const bullOuterR = REAL_BOARD.bullOuterRadius * pxPerMm;
  const bullInnerR = REAL_BOARD.bullInnerRadius * pxPerMm;

  const sectors = 20;
  const step = (Math.PI * 2) / sectors;
  const firstBoundaryAngle = -Math.PI / 2 - step / 2;

  const scale = doubleOuterR / maxCoordinate;
  const pointsToRender = points ?? (point ? [point] : []);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-sm"
      role="img"
      aria-label="Cible de flechette"
    >
      <circle
        cx={center}
        cy={center}
        r={boardOuterR}
        fill="#f8f8f8"
        stroke="#1f2937"
        strokeWidth={1.3}
      />

      <circle
        cx={center}
        cy={center}
        r={doubleOuterR}
        fill="none"
        stroke="#374151"
        strokeWidth={1.1}
      />
      <circle
        cx={center}
        cy={center}
        r={doubleInnerR}
        fill="none"
        stroke="#6b7280"
        strokeWidth={1}
      />
      <circle
        cx={center}
        cy={center}
        r={tripleOuterR}
        fill="none"
        stroke="#374151"
        strokeWidth={1.1}
      />
      <circle
        cx={center}
        cy={center}
        r={tripleInnerR}
        fill="none"
        stroke="#6b7280"
        strokeWidth={1}
      />

      {Array.from({ length: sectors }).map((_, i) => {
        const a = firstBoundaryAngle + i * step;
        const x1 = center + Math.cos(a) * bullOuterR;
        const y1 = center + Math.sin(a) * bullOuterR;
        const x2 = center + Math.cos(a) * doubleOuterR;
        const y2 = center + Math.sin(a) * doubleOuterR;
        return (
          <line
            key={`line-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#4b5563"
            strokeWidth={0.9}
          />
        );
      })}

      <circle
        cx={center}
        cy={center}
        r={bullOuterR}
        fill="none"
        stroke="#374151"
        strokeWidth={1.2}
      />
      <circle
        cx={center}
        cy={center}
        r={bullInnerR}
        fill="none"
        stroke="#1f2937"
        strokeWidth={1.2}
      />

      {SEGMENT_ORDER.map((value, i) => {
        const a = -Math.PI / 2 + i * step;
        const numberR = (boardOuterR + doubleOuterR) / 2;
        const x = center + Math.cos(a) * numberR;
        const y = center + Math.sin(a) * numberR;

        return (
          <text
            key={`number-${value}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#111827"
            fontSize={Math.max(9, size * 0.035)}
            fontWeight={700}
          >
            {value}
          </text>
        );
      })}

      {pointsToRender.map((p, index) => {
        const markerX = center + p.x * scale;
        const markerY = center - p.y * scale;

        return (
          <g key={`marker-${index}-${p.x}-${p.y}`}>
            <circle
              cx={markerX}
              cy={markerY}
              r={3}
              fill={p.color || "#2454ffff"}
            />
          </g>
        );
      })}
    </svg>
  );
}
