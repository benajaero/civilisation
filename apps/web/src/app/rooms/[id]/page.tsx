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

  return (
    <main>
      <SiteFrame>
        <section className="room">
          <p className="room__crumbs">
            <a href="/">Lobby</a> &nbsp;·&nbsp; {room.label}
          </p>
          <RoomFloorPlan room={room} availableSlugs={availableSlugs} />
          <RoomIndex room={room} availableSlugs={availableSlugs} />
        </section>
      </SiteFrame>
    </main>
  );
}
