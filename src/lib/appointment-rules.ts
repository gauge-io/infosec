/**
 * Appointment scheduling rules and constraints
 * Based on Google Calendar Appointment Scheduler configuration
 */

export interface AppointmentRules {
  duration: number; // in minutes
  availableDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  startHour: number; // 24-hour format
  endHour: number; // 24-hour format
  maxDaysInAdvance: number;
  minHoursBefore: number;
}

export const APPOINTMENT_RULES: AppointmentRules = {
  duration: 60, // 1 hour
  availableDays: [1, 2, 3, 4, 5], // Monday through Friday
  startHour: 9, // 9 AM
  endHour: 17, // 5 PM
  maxDaysInAdvance: 60,
  minHoursBefore: 72,
};

/**
 * Check if a date is within the valid booking window
 */
export function isDateValid(date: Date): { valid: boolean; reason?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Check if date is in the past
  if (selectedDate < today) {
    return { valid: false, reason: 'Date is in the past' };
  }
  
  // Check maximum days in advance
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + APPOINTMENT_RULES.maxDaysInAdvance);
  if (selectedDate > maxDate) {
    return { valid: false, reason: `Cannot book more than ${APPOINTMENT_RULES.maxDaysInAdvance} days in advance` };
  }
  
  // Check minimum hours before
  const minDateTime = new Date(now.getTime() + APPOINTMENT_RULES.minHoursBefore * 60 * 60 * 1000);
  if (date < minDateTime) {
    return { valid: false, reason: `Must book at least ${APPOINTMENT_RULES.minHoursBefore} hours in advance` };
  }
  
  // Check if day is available (Monday-Friday)
  const dayOfWeek = date.getDay();
  if (!APPOINTMENT_RULES.availableDays.includes(dayOfWeek)) {
    return { valid: false, reason: 'Only available Monday through Friday' };
  }
  
  return { valid: true };
}

/**
 * Generate available time slots for a given date
 * Excludes times that don't meet the minimum hours before requirement
 * @param duration - Duration in minutes (defaults to APPOINTMENT_RULES.duration)
 */
export function generateTimeSlots(date: Date, busyTimes: Array<{ start: string; end: string; isAllDay?: boolean }>, duration?: number): string[] {
  const validation = isDateValid(date);
  if (!validation.valid) {
    return [];
  }
  
  // Check if there's an all-day event - if so, block the entire day
  const hasAllDayEvent = busyTimes.some(busy => {
    if (busy.isAllDay) return true;
    // Check if event is all-day (no time component, just date)
    if (busy.start && !busy.start.includes('T')) return true;
    if (busy.end && !busy.end.includes('T')) return true;
    return false;
  });
  
  if (hasAllDayEvent) {
    console.log(`Date ${date.toISOString().split('T')[0]} has an all-day event - blocking entire day`);
    return [];
  }
  
  const slots: string[] = [];
  const now = new Date();
  const minDateTime = new Date(now.getTime() + APPOINTMENT_RULES.minHoursBefore * 60 * 60 * 1000);
  const appointmentDuration = duration || APPOINTMENT_RULES.duration;
  
  // For shorter durations (like 20 minutes), generate slots every 20 minutes
  const slotInterval = appointmentDuration <= 30 ? appointmentDuration : 60;
  
  for (let hour = APPOINTMENT_RULES.startHour; hour < APPOINTMENT_RULES.endHour; hour++) {
    // Generate slots based on interval
    const intervalsPerHour = 60 / slotInterval;
    for (let i = 0; i < intervalsPerHour; i++) {
      const minutes = i * slotInterval;
      const slotTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const slotDateTime = new Date(date);
      slotDateTime.setHours(hour, minutes, 0, 0);
      
      // Check minimum hours before requirement
      if (slotDateTime < minDateTime) {
        continue;
      }
      
      // Check if slot conflicts with busy times
      // Use local time for slot to match calendar timezone
      const slotStart = new Date(slotDateTime);
      const slotEnd = new Date(slotDateTime.getTime() + appointmentDuration * 60 * 1000);
    
    const hasConflict = busyTimes.some(busy => {
      if (!busy.start || !busy.end) return false;
      
      // Skip all-day events (already handled above)
      if (busy.isAllDay || !busy.start.includes('T') || !busy.end.includes('T')) return false;
      
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      
      // Check for overlap: slot overlaps if it starts before busy ends AND ends after busy starts
      const overlaps = slotStart < busyEnd && slotEnd > busyStart;
      
      if (overlaps) {
        console.log(`Slot ${slotTime} conflicts with busy time: ${busyStart.toLocaleTimeString()} - ${busyEnd.toLocaleTimeString()}`);
      }
      
      return overlaps;
    });
    
      if (!hasConflict) {
        slots.push(slotTime);
      }
    }
  }
  
  return slots;
}

