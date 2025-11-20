/**
 * Google Calendar API integration
 * Fetches available appointment slots from a Google Calendar
 */

import { generateTimeSlots as generateSlotsFromRules } from './appointment-rules';

const GOOGLE_CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || '';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface CalendarAvailability {
  calendarId: string;
  timeSlots: TimeSlot[];
  nextAvailableDate?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  isAllDay?: boolean;
}

/**
 * Extract calendar ID or schedule ID from Google Calendar appointment link
 * Supports multiple formats:
 * - https://calendar.app.google/{CALENDAR_ID}
 * - https://calendar.google.com/calendar/u/0/appointments/schedules/{SCHEDULE_ID}
 * - https://calendar.google.com/calendar/embed?src={EMAIL}
 */
export function extractCalendarIdFromUrl(url: string): string | null {
  // Try embed format with email (most reliable for fetching events)
  const embedMatch = url.match(/[?&]src=([^&]+)/);
  if (embedMatch) {
    return decodeURIComponent(embedMatch[1]);
  }
  
  // For appointment scheduling URLs, we need to use the actual calendar email
  // Appointment scheduling links don't directly map to calendar IDs
  // We'll need to use the calendar owner's email instead
  const scheduleMatch = url.match(/appointments\/schedules\/([^\/\?]+)/);
  if (scheduleMatch) {
    // For appointment scheduling, return the calendar owner email
    // This should be 'nick@gauge.io' based on the setup
    return 'nick@gauge.io';
  }
  
  // Try calendar.app.google format
  const appMatch = url.match(/calendar\.app\.google\/([^\/\?]+)/);
  if (appMatch) {
    return appMatch[1];
  }
  
  return null;
}

/**
 * Extract schedule ID from appointment scheduling URL
 */
export function extractScheduleIdFromUrl(url: string): string | null {
  const match = url.match(/appointments\/schedules\/([^\/\?]+)/);
  return match ? match[1] : null;
}

/**
 * Convert appointment link calendar ID to Google Calendar API calendar ID
 * Appointment links use a different format than the API
 * Note: calendar.app.google links are for appointment scheduling and may not
 * directly map to Calendar API calendar IDs without additional configuration
 */
export async function getCalendarInfo(calendarId: string): Promise<{ id: string; summary?: string; error?: string } | null> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    console.warn('Google Calendar API key not configured');
    return { id: calendarId, error: 'API key not configured' };
  }

  try {
    // Try to get calendar info using the calendar ID
    // For appointment scheduling calendars, we might need to use a different approach
    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}?key=${GOOGLE_CALENDAR_API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Could not access calendar ${calendarId}: ${response.status} ${response.statusText}`, errorText);
      
      // Return the calendar ID anyway - the iframe embed should still work
      return { 
        id: calendarId, 
        error: `API access failed: ${response.status} ${response.statusText}. This is normal for appointment scheduling links - the iframe embed should still work.` 
      };
    }

    const data = await response.json();
    return {
      id: data.id,
      summary: data.summary,
    };
  } catch (error) {
    console.error('Error fetching calendar info:', error);
    return { 
      id: calendarId,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch free/busy information for a calendar
 * This helps determine available time slots
 */
export async function getFreeBusy(
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<{ busy: Array<{ start: string; end: string }> } | null> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    console.warn('Google Calendar API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${CALENDAR_API_BASE}/freeBusy?key=${GOOGLE_CALENDAR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: calendarId }],
        }),
      }
    );

    if (!response.ok) {
      console.warn(`Could not fetch free/busy for ${calendarId}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.calendars?.[calendarId] || { busy: [] };
  } catch (error) {
    console.error('Error fetching free/busy:', error);
    return null;
  }
}

/**
 * Get available appointment slots for the next N days
 * This is a simplified version - actual implementation would need
 * to know the appointment duration and available time windows
 */
export async function getAvailableSlots(
  calendarUrl: string,
  daysAhead: number = 30
): Promise<CalendarAvailability | null> {
  const calendarId = extractCalendarIdFromUrl(calendarUrl);
  if (!calendarId) {
    console.error('Could not extract calendar ID from URL:', calendarUrl);
    return null;
  }

  const now = new Date();
  const timeMin = now.toISOString();
  const timeMax = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString();

  // Get calendar info
  const calendarInfo = await getCalendarInfo(calendarId);
  if (!calendarInfo) {
    return null;
  }

  // Get free/busy information
  // Note: For appointment scheduling, we'd need to know:
  // - Appointment duration
  // - Available time windows (e.g., 9am-5pm)
  // - Buffer times between appointments
  const freeBusy = await getFreeBusy(calendarInfo.id, timeMin, timeMax);

  return {
    calendarId: calendarInfo.id,
    timeSlots: [], // Would be populated based on free/busy data and appointment rules
    nextAvailableDate: timeMin,
  };
}

/**
 * Fetch available appointment slots from a Google Calendar appointment schedule
 * Uses the freeBusy API to determine available times
 */
export async function fetchAppointmentSlots(
  scheduleId: string,
  date: Date
): Promise<{ time: string; available: boolean }[]> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    console.warn('Google Calendar API key not configured');
    return [];
  }

  try {
    // Get the start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Try to get free/busy information
    // For appointment schedules, we need to find the associated calendar
    // First, try using the schedule ID as a calendar ID
    const freeBusy = await getFreeBusy(
      scheduleId,
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );

    if (!freeBusy) {
      // If that fails, try alternative calendar ID formats
      const alternatives = [
        `${scheduleId}@group.calendar.google.com`,
        scheduleId,
      ];

      for (const altId of alternatives) {
        const altFreeBusy = await getFreeBusy(
          altId,
          startOfDay.toISOString(),
          endOfDay.toISOString()
        );
        if (altFreeBusy) {
          return formatTimeSlots(date, altFreeBusy.busy);
        }
      }

      // If we can't get free/busy, generate default slots (assume all available)
      return formatTimeSlots(date, []);
    }

    return formatTimeSlots(date, freeBusy.busy);
  } catch (error) {
    console.error('Error fetching appointment slots:', error);
    return [];
  }
}

/**
 * Format time slots for a date, excluding busy times
 * Uses appointment rules for constraints
 */
function formatTimeSlots(
  date: Date,
  busyTimes: Array<{ start: string; end: string }>
): { time: string; available: boolean }[] {
  const availableSlots = generateSlotsFromRules(date, busyTimes);
  
  return availableSlots.map(time => ({
    time,
    available: true,
  }));
}

/**
 * Fetch calendar events for a date range
 * This is used to determine which time slots are already booked
 */
export async function fetchCalendarEvents(
  calendarId: string,
  timeMin: Date,
  timeMax: Date
): Promise<CalendarEvent[]> {
  try {
    // Use backend API endpoint which has service account access
    // This allows access to private calendars shared with the service account
    const params = new URLSearchParams({
      calendarId: calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
    });

    console.log(`Fetching events via backend API for calendar: ${calendarId}`, { timeMin, timeMax });
    
    const response = await fetch(`/api/calendar/events?${params}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch events from backend: ${response.status} ${response.statusText}`, errorText);
      return [];
    }

    const data = await response.json();
    
    if (data.success && data.events) {
      console.log(`✓ Successfully fetched ${data.events.length} events from calendar: ${calendarId}`);
      if (data.events.length > 0) {
        console.log('Sample events:', data.events.slice(0, 3).map((e: CalendarEvent) => ({ summary: e.summary, start: e.start })));
      }
      return data.events;
    } else {
      console.warn('Backend returned unsuccessful response:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

/**
 * Create a calendar event (appointment booking)
 * Note: This requires server-side implementation with service account authentication
 * For now, this will call a backend API endpoint
 */
export interface CreateEventParams {
  summary: string;
  description: string;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
  notes?: string; // Coffee preference for email subject
}

export interface CreateEventResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

export async function createCalendarEvent(params: CreateEventParams): Promise<CreateEventResult> {
  try {
    // This should call a backend API endpoint that uses the service account
    // The backend endpoint should be at /api/calendar/create-event
    // See API_SETUP.md for implementation details
    const response = await fetch('/api/calendar/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        calendarId: 'nick@gauge.io', // Calendar email
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create calendar event';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
        console.error('Calendar API error:', error);
      } catch (parseError) {
        const errorText = await response.text().catch(() => 'Unknown error');
        errorMessage = errorText || errorMessage;
        console.error('Failed to parse error response:', errorText);
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();
    return {
      success: true,
      eventId: data.id,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    let errorMessage = 'Failed to create calendar event';
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 3001.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}

