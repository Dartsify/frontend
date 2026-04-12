"use client";

export default function LastThreeScores() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => {
        return (
          <p
            key={i}
            className="px-6 py-4 bg-foreground-light rounded-md text-2xl font-black border border-border text-center leading-7"
            onClick={() => alert("Edit point : not implemented yet")}
          >
            20
            <br />
            <span className="font-normal text-lg text-foreground-soft">
              D10
            </span>
          </p>
        );
      })}
    </div>
  );
}
