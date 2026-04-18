import type { Room } from "@civilisation/content";

interface LobbyDoorsProps {
  rooms: Room[];
}

export function LobbyDoors({ rooms }: LobbyDoorsProps) {
  return (
    <ol className="lobby" aria-label="Rooms of the library">
      {rooms.map((room) => (
        <li key={room.id} className="lobby__door">
          <a href={`/rooms/${room.id}`} className="lobby__door-link">
            <div className="lobby__door-head">
              <h3 className="lobby__door-label">{room.label}</h3>
              <span className="cv-meta cv-mono">{room.span}</span>
            </div>
            <p className="lobby__door-note">{room.note}</p>
            <span className="lobby__door-enter">Enter &rarr;</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
