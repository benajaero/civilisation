import { notFound } from "next/navigation";
import { loadRoom, loadRooms, workHasText } from "@civilisation/content";
import { SiteFrame } from "../../../components/site-frame";
import { RoomFloorPlan } from "../../../components/room-floor-plan";
import { RoomIndex } from "../../../components/room-index";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const rooms = await loadRooms();
  return rooms.map((r) => ({ id: r.id }));
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let room;
  try {
    room = await loadRoom(id);
  } catch {
    notFound();
  }

  const availableSlugs = new Set<string>();
  await Promise.all(
    room.entries
      .filter((e) => e.slug)
      .map(async (e) => {
        if (e.slug && (await workHasText(e.slug))) {
          availableSlugs.add(e.slug);
        }
      }),
  );

  const availableCount = availableSlugs.size;
  const unavailableCount = room.entries.length - availableCount;

  return (
    <main>
      <SiteFrame>
        <section className="room">
          <p className="room__crumbs">
            <a href="/">Lobby</a> &nbsp;·&nbsp; {room.label}
          </p>
          <header className="room__header">
            <div>
              <p className="cv-meta">Room {room.order + 1}</p>
              <h1 className="room__title">{room.label}</h1>
            </div>
            <dl className="room__stats" aria-label="Room accession status">
              <div>
                <dt>Total</dt>
                <dd>{room.entries.length}</dd>
              </div>
              <div>
                <dt>Readable</dt>
                <dd>{availableCount}</dd>
              </div>
              <div>
                <dt>Unavailable</dt>
                <dd>{unavailableCount}</dd>
              </div>
            </dl>
          </header>
          <RoomFloorPlan room={room} availableSlugs={availableSlugs} />
          <RoomIndex room={room} availableSlugs={availableSlugs} />
        </section>
      </SiteFrame>
    </main>
  );
}
