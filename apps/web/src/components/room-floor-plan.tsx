import type { Room } from "@civilisation/content";

interface RoomFloorPlanProps {
  room: Room;
  availableSlugs: Set<string>;
}

export function RoomFloorPlan({ room, availableSlugs }: RoomFloorPlanProps) {
  return (
    <figure className="floor-plan" aria-label={`Floor plan of the ${room.label} room`}>
      <div className="floor-plan__box">
        <div className="floor-plan__header">
          <span className="cv-mono floor-plan__header-label">
            {room.label.toUpperCase()}
          </span>
          <span className="cv-mono floor-plan__header-span">{room.span}</span>
        </div>
        <div className="floor-plan__grid">
          {room.entries.map((entry, i) => {
            const available = entry.slug ? availableSlugs.has(entry.slug) : false;
            return (
              <div
                key={`${room.id}-${i}`}
                className={
                  available
                    ? "floor-plan__cell floor-plan__cell--available"
                    : "floor-plan__cell"
                }
              >
                <span className="floor-plan__author">{entry.author}</span>
                <span className="floor-plan__rule" aria-hidden="true">&mdash;</span>
                <span className="floor-plan__title">{entry.title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="floor-plan__note">{room.note}</figcaption>
    </figure>
  );
}
