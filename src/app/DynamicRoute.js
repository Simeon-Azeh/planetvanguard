import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import EventDetails from './components/EventDetails';
import { pastEvents } from './components/PastEvents';

export default function EventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (id) {
      const foundEvent = pastEvents.find(e => e.id === parseInt(id));
      setEvent(foundEvent);
    }
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return <EventDetails event={event} />;
}