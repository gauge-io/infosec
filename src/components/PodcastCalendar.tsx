import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { fetchCalendarEvents, extractCalendarIdFromUrl } from '@/lib/google-calendar';
import { generateTimeSlots, isDateValid } from '@/lib/appointment-rules';
import { PodcastBookingForm } from './PodcastBookingForm';

interface PodcastCalendarProps {
  calendarUrl: string;
}

export function PodcastCalendar({ calendarUrl }: PodcastCalendarProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [events, setEvents] = useState<Array<{ start: string; end: string; isAllDay?: boolean }>>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Function to load events for a month and calculate available slots
  async function loadMonthEvents(calId: string, monthDate: Date) {
    try {
      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      console.log(`Fetching events for month: ${monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, { start: startOfMonth, end: endOfMonth });
      const fetchedEvents = await fetchCalendarEvents(calId, startOfMonth, endOfMonth);
      console.log(`Fetched ${fetchedEvents.length} events from calendar API`);
      
      const busyTimes = fetchedEvents.map(event => {
        const isAllDay = !event.start.includes('T') || !event.end.includes('T');
        return {
          start: event.start,
          end: event.end,
          isAllDay,
        };
      });
      setEvents(busyTimes);
      console.log(`Loaded ${busyTimes.length} existing events into calendar view`);
    } catch (fetchError) {
      console.error('Could not fetch events for month:', fetchError);
      // Don't fail if month fetch fails
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        setError(null);
        
        const id = extractCalendarIdFromUrl(calendarUrl);
        if (!id) {
          setError('Invalid calendar URL');
          setLoading(false);
          return;
        }

        setCalendarId(id);
        
        // Pre-fetch events for the current month to populate the calendar view
        await loadMonthEvents(id, currentDate);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize calendar');
        console.error('Calendar init error:', err);
        setLoading(false);
      }
    }

    initialize();
  }, [calendarUrl]);

  // Reload events when month changes
  useEffect(() => {
    if (calendarId) {
      loadMonthEvents(calendarId, currentDate);
    }
  }, [currentDate, calendarId]);

  // Load available slots when a date is selected
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate || !calendarId) return;

      try {
        setLoadingSlots(true);
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const fetchedEvents = await fetchCalendarEvents(calendarId, startOfDay, endOfDay);
        
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        const busyTimes = fetchedEvents
          .filter(event => {
            if (!event.start) return false;
            const eventDate = event.start.split('T')[0];
            return eventDate === selectedDateStr;
          })
          .map(event => {
            const isAllDay = !event.start.includes('T') || !event.end.includes('T');
            return {
              start: event.start,
              end: event.end,
              isAllDay,
            };
          });
        
        // Update events state
        setEvents(prev => {
          const otherDates = prev.filter(e => !e.start.startsWith(selectedDateStr));
          return [...otherDates, ...busyTimes];
        });
        
        // Generate available slots based on busy times - 20 minutes duration
        const slots = generateTimeSlots(selectedDate, busyTimes, 20);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error loading slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedDate, calendarId]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    
    // Only allow selecting future dates
    if (dateStr >= todayStr) {
      setSelectedDate(date);
    }
  };

  const handleSlotClick = (slot: string) => {
    if (!selectedDate) return;
    
    // Validate the date and time
    const slotDateTime = new Date(selectedDate);
    const [hours, minutes] = slot.split(':').map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    const validation = isDateValid(slotDateTime);
    if (!validation.valid) {
      alert(validation.reason || 'This time slot is not available');
      return;
    }
    
    setSelectedTime(slot);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = async () => {
    setShowBookingForm(false);
    setSelectedTime(null);
    
    // Reload events for the current month to reflect the new booking
    if (calendarId) {
      await loadMonthEvents(calendarId, currentDate);
    }
    
    // If a date was selected, reload slots for that date to update availability
    if (selectedDate && calendarId) {
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Reload events for the selected date
        const fetchedEvents = await fetchCalendarEvents(calendarId, startOfDay, endOfDay);
        
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        const busyTimes = fetchedEvents
          .filter(event => {
            if (!event.start) return false;
            const eventDate = event.start.split('T')[0];
            return eventDate === selectedDateStr;
          })
          .map(event => {
            const isAllDay = !event.start.includes('T') || !event.end.includes('T');
            return {
              start: event.start,
              end: event.end,
              isAllDay,
            };
          });
        
        // Update events state
        setEvents(prev => {
          const otherDates = prev.filter(e => !e.start.startsWith(selectedDateStr));
          return [...otherDates, ...busyTimes];
        });
        
        // Regenerate available slots - 20 minutes duration
        const slots = generateTimeSlots(selectedDate, busyTimes, 20);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error reloading events after booking:', err);
        // Still reload month events even if date-specific reload fails
        if (calendarId) {
          await loadMonthEvents(calendarId, currentDate);
        }
      }
    }
  };

  // Estimate available slots for a date (for display in calendar)
  const estimateSlotsForDate = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => {
      const eventDate = event.start.split('T')[0];
      return eventDate === dateStr;
    });
    
    // Check for all-day events first - if found, return 0
    const hasAllDay = dayEvents.some(e => {
      if (e.isAllDay === true) return true;
      if (!e.start.includes('T') || !e.end.includes('T')) return true;
      return false;
    });
    
    if (hasAllDay) {
      return 0;
    }
    
    const estimatedSlots = generateTimeSlots(date, dayEvents.map(e => ({ 
      start: e.start, 
      end: e.end,
      isAllDay: e.isAllDay 
    })), 20);
    return estimatedSlots.length;
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center h-[600px] bg-gray-900 rounded-lg">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-mango mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Loading calendar...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-6">
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-gray-400 mt-2">
            Make sure the calendar is public or the API key has proper permissions.
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-gray-900 rounded-lg p-6 lg:p-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h3 className="text-xl font-serif font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-sans font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="aspect-square" />;
                  }

                  const dateStr = day.toISOString().split('T')[0];
                  const todayStr = today.toISOString().split('T')[0];
                  const isPast = dateStr < todayStr;
                  const isToday = dateStr === todayStr;
                  const isSelected = selectedDate && dateStr === selectedDate.toISOString().split('T')[0];
                  const slotsCount = estimateSlotsForDate(day);

                  return (
                    <button
                      key={index}
                      onClick={() => !isPast && handleDateClick(day)}
                      disabled={isPast}
                      className={`
                        aspect-square rounded-lg border-2 transition-all
                        ${isPast 
                          ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed' 
                          : isSelected
                          ? 'bg-mango border-mango text-white'
                          : 'bg-gray-800 border-gray-700 text-white hover:border-mango/50'
                        }
                        ${isToday && !isSelected ? 'ring-2 ring-mango/50' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-sm font-sans font-semibold">{day.getDate()}</span>
                        {!isPast && (
                          slotsCount > 0 ? (
                            <span className="text-xs text-mango mt-1" title={`${slotsCount} available slot${slotsCount !== 1 ? 's' : ''}`}>
                              {slotsCount}
                            </span>
                          ) : (
                            <span className="text-xs text-red-400 mt-1" title="No available slots">
                              ●
                            </span>
                          )
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 h-full">
                {selectedDate ? (
                  <>
                    <div className="mb-4">
                      <h4 className="text-lg font-serif font-semibold text-white mb-2">
                        Available Times
                      </h4>
                      <p className="text-sm text-gray-400">
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">20-minute sessions</p>
                    </div>

                    {loadingSlots ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">Loading available times...</p>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => handleSlotClick(slot)}
                            className="w-full p-3 bg-gray-900 hover:bg-mango hover:text-white rounded-lg transition-colors text-left flex items-center gap-3 group"
                          >
                            <Clock className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            <span className="font-sans font-medium">{slot}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">
                          No available slots for this date
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">
                      Select a date to view available times
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-mango bg-mango" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 ring-2 ring-mango/50 border-gray-700 bg-gray-800" />
              <span>Today</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedDate && selectedTime && (
        <PodcastBookingForm
          date={selectedDate}
          time={selectedTime}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedTime(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}


