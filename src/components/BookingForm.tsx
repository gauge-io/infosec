import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Mail, User, CheckCircle, FileText } from 'lucide-react';
import { createCalendarEvent } from '@/lib/google-calendar';

interface BookingFormProps {
  date: Date;
  time: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingForm({ date, time, onClose, onSuccess }: BookingFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-focus name field when modal opens
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form
      if (!formData.name.trim() || !formData.email.trim()) {
        setError('Name and email are required');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Create calendar event
      const eventDate = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      // Build description with notes if provided
      let description = `Meeting with ${formData.name} (${formData.email})\n\nLocation: Under the clocktower of the Ferry Building, there are a set of stairs – go up these and take a left, all the way to the end, where there's a co-working spot called Shack 15. Ask for me at the desk.\n\nAddress: 1 Ferry Plaza, San Francisco, CA 94111, USA`;
      if (formData.notes.trim()) {
        description += `\n\nNotes from ${formData.name}:\n${formData.notes}`;
      }

      // Format event summary: "[coffee type] w/ [attendee full name] and Nick Cawthon"
      const coffeeType = formData.notes.trim() || 'Coffee';
      const eventSummary = `${coffeeType} w/ ${formData.name} and Nick Cawthon`;

      const result = await createCalendarEvent({
        summary: eventSummary,
        description,
        start: eventDate.toISOString(),
        end: endDate.toISOString(),
        location: '1 Ferry Plaza, San Francisco, CA 94111, USA',
        attendees: [formData.email],
        notes: formData.notes ? formData.notes.trim() : '', // Pass coffee preference for email subject
      });

      if (result.success) {
        setSuccess(true);
        setError(null);
        // Show success message briefly before closing
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        const errorMsg = result.error || 'Failed to create appointment.';
        console.error('Booking error:', errorMsg);
        setError(errorMsg + (errorMsg.includes('server') ? '' : ' Please make sure the backend server is running.'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-serif font-semibold text-white">Book Appointment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 text-white">
            <Calendar className="w-5 h-5 text-gauge-coral-2" />
            <div>
              <p className="font-semibold">{dateStr}</p>
              <p className="text-sm text-gray-400">{time}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-sans font-medium text-gray-300 mb-2">
              Full name <span className="text-gauge-coral-2">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gauge-coral-2 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-sans font-medium text-gray-300 mb-2">
              Email address <span className="text-gauge-coral-2">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gauge-coral-2 transition-colors"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-sans font-medium text-gray-300 mb-2">
              How do you take your coffee? <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gauge-coral-2 transition-colors"
                placeholder="e.g., Iced Cafe Latte, Black Coffee, Cappuccino..."
              />
            </div>
          </div>

          {success && (
            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-400 font-semibold">Appointment booked successfully!</p>
                  <p className="text-xs text-green-300 mt-1">A calendar invite has been sent to your email.</p>
                </div>
              </div>
            </div>
          )}

          {error && !success && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
              {error.includes('backend server') && (
                <p className="text-xs text-red-300 mt-2">
                  Run <code className="bg-gray-800 px-1 rounded">npm run dev:all</code> to start both frontend and backend servers.
                </p>
              )}
            </div>
          )}

          {loading && !error && !success && (
            <div className="p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg">
              <p className="text-sm text-blue-400">Creating calendar event and sending invites...</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-sans font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gauge-coral-2 hover:bg-gauge-coral-2/90 text-white font-sans font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

