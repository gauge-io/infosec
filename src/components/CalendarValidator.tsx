import { useEffect, useState } from 'react';
import { getAvailableSlots, type CalendarAvailability } from '@/lib/google-calendar';

interface CalendarValidatorProps {
  calendarUrl: string;
}

export function CalendarValidator({ calendarUrl }: CalendarValidatorProps) {
  const [availability, setAvailability] = useState<CalendarAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateCalendar() {
      setLoading(true);
      setError(null);
      try {
        const slots = await getAvailableSlots(calendarUrl, 30);
        setAvailability(slots);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to validate calendar');
        console.error('Calendar validation error:', err);
      } finally {
        setLoading(false);
      }
    }

    // Only validate if API key is configured
    if (import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY) {
      validateCalendar();
    }
  }, [calendarUrl]);

  // This component can be used to display validation status
  // For now, it runs silently in the background
  // You can add UI to show available slots if needed
  if (loading || error || !availability) {
    return null; // Silent validation
  }

  return null; // No UI needed for now, but can be extended
}

