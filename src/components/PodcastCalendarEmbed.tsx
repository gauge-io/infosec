import { PodcastCalendar } from './PodcastCalendar';

interface PodcastCalendarEmbedProps {
  calendarUrl: string;
}

export function PodcastCalendarEmbed({ calendarUrl }: PodcastCalendarEmbedProps) {
  return (
    <div className="w-full">
      <PodcastCalendar calendarUrl={calendarUrl} />
    </div>
  );
}


