import type { Room } from "@civilisation/content";

interface RoomIndexProps {
  room: Room;
  availableSlugs: Set<string>;
}

export function RoomIndex({ room, availableSlugs }: RoomIndexProps) {
  return (
    <ol className="entries" aria-label={`Entries in ${room.label}`}>
      {room.entries.map((entry, i) => {
        const available = entry.slug ? availableSlugs.has(entry.slug) : false;
        const titleNode = (
          <>
            <em>{entry.title}</em>
            {entry.native ? (
              <span className="entry__native" lang="auto">
                {" "}&nbsp;·&nbsp; {entry.native}
              </span>
            ) : null}
          </>
        );

        return (
          <li key={`${room.id}-${i}`} className="entry">
            <span className="entry__year cv-mono">{entry.year}</span>
            <span className="entry__author">{entry.author}</span>
            <span className="entry__title">
              {available && entry.slug ? (
                <a href={`/works/${entry.slug}`} className="entry__link">
                  {titleNode}
                </a>
              ) : (
                titleNode
              )}
            </span>
            <span className="entry__discipline cv-meta">{entry.discipline}</span>
            <span className="entry__origin cv-meta cv-mono">{entry.language}</span>
          </li>
        );
      })}
    </ol>
  );
}
