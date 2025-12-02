// Utility function to generate time slots based on doctor's schedule
export const generateTimeSlots = (doctor, selectedDate) => {
    if (!doctor || !selectedDate) return [];

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[selectedDate.getDay()];

    // Find today's schedule
    const daySchedule = doctor.timings?.find(t => t.day === dayName || t.day === dayName.substring(0, 3));

    if (!daySchedule || !daySchedule.slots || daySchedule.slots.length === 0) {
        return [];
    }

    const slots = [];
    const slotDuration = doctor.slotDuration || 30; // Default to 30 minutes

    // Generate slots for each session
    daySchedule.slots.forEach(session => {
        const [startHour, startMinute] = session.startTime.split(':').map(Number);
        const [endHour, endMinute] = session.endTime.split(':').map(Number);

        const startTimeMinutes = startHour * 60 + startMinute;
        const endTimeMinutes = endHour * 60 + endMinute;

        // Generate slots with the specified duration
        for (let time = startTimeMinutes; time < endTimeMinutes; time += slotDuration) {
            const hour = Math.floor(time / 60);
            const minute = time % 60;

            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const period = hour < 12 ? 'AM' : 'PM';
            const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const displayTime = `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;

            slots.push({
                time: timeString,
                display: displayTime,
                available: true // Will be updated based on existing appointments
            });
        }
    });

    return slots;
};

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
