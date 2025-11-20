import { CustomCalendar } from './CustomCalendar';

interface CalendarEmbedProps {
  calendarUrl: string;
}

export function CalendarEmbed({ calendarUrl }: CalendarEmbedProps) {
  return (
    <div className="w-full">
      <CustomCalendar calendarUrl={calendarUrl} />
    </div>
  );
}

