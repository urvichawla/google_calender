# Google Calendar Clone

A full-featured calendar application built with React and Node.js that replicates core Google Calendar functionality. This project demonstrates modern web development practices including state management, responsive design, and integration with external calendar services.

## Features

- **Multiple Calendar Views**: Switch between day and month views with smooth navigation
- **Event Management**: Create, edit, and delete events with rich details including location, description, and color coding
- **Task Management**: Track tasks with completion status, separate from events
- **Multiple Calendars**: Create and manage multiple calendars, each with custom colors and settings
- **External Calendar Integration**: Import holidays and events from Google Calendar
- **Smart Overlap Handling**: Automatically arranges overlapping events side-by-side with proportional width allocation
- **Drag and Drop**: Intuitive drag-and-drop interface for scheduling events
- **Real-time Updates**: Current time indicator on day view
- **Theme Support**: Light and dark mode themes
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **User Authentication**: Secure Firebase authentication for user sessions

## Technology Stack

### Frontend
- **React 18** - UI framework with hooks and context API
- **TypeScript** - Type-safe development
- **SCSS** - Advanced styling with variables and mixins
- **Firebase** - Authentication and user management
- **Day.js** - Date manipulation and formatting
- **React Draggable** - Drag-and-drop functionality
- **Google Calendar API** - External calendar integration

### Backend
- **Node.js** - Server runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database with Mongoose ODM
- **Google Calendar API** - Calendar data synchronization

## Architecture

The application follows a clean separation between frontend and backend, communicating through RESTful APIs. The frontend uses React Context API for global state management, with separate contexts for calendars, schedules, app configuration, theme, and authentication.

### Frontend Structure

```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Calendar/      # Calendar display components
│   │   ├── Schedules/     # Event and task components
│   │   └── SettingsPanel/ # Settings and configuration
│   ├── contexts/          # React Context providers
│   │   ├── StoreContext/   # Global state for calendars and schedules
│   │   ├── FirebaseAuthContext/ # Authentication state
│   │   └── ThemeContext/  # Theme management
│   ├── api/               # API client functions
│   ├── hooks/             # Custom React hooks
│   └── util/              # Utility functions
```

### Backend Structure

```
server/
├── src/
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── middleware/        # Authentication middleware
│   └── config/            # Database configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database (local or cloud instance)
- Firebase project for authentication
- Google Calendar API credentials (for external calendar features)

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.development` file in the client directory:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Production Build

To create a production build of the frontend:

```bash
cd client
npm run build
```

The optimized build will be in the `client/build` directory.

## Business Logic and Edge Cases

### Recurring Events

The application supports recurring events through the `once` flag in the schedule data model. When `once` is set to `false`, the system treats the event as recurring. The current implementation stores individual event instances, but the architecture supports future expansion to recurrence rules (daily, weekly, monthly, yearly patterns).

### Overlapping Events

One of the more complex features is the automatic arrangement of overlapping events. The `useScheduleLayout` hook implements an algorithm that:

1. Sorts events by start time (and end time for ties)
2. Detects overlapping time ranges
3. Calculates proportional widths for overlapping events
4. Positions events side-by-side with appropriate spacing
5. Ensures minimum visibility (50px) for each event

The algorithm handles complex scenarios including:
- Multiple simultaneous events (3+ events at the same time)
- Events that start before others end
- Events with different durations
- Events spanning multiple days

### Multi-Day Events

Events that span past midnight are handled by checking if the event's start time is greater than its end time. These events are rendered across day boundaries, with the portion displayed on the correct day based on the date comparison logic in `TimeBlockCol`.

### Time Boundary Handling

The calendar supports events with negative time indices for all-day events or events without specific times. The slot calculation logic gracefully handles these edge cases by providing default heights and positions.

### External Calendar Sync

When integrating external calendars (Google Calendar, holidays), the system:
- Converts external event formats to internal schedule format
- Handles timezone conversions
- Marks events as external to prevent direct editing
- Maintains calendar groupings for easy toggling

### Data Persistence

All calendar and schedule data is stored in MongoDB with:
- User-based isolation (userId indexing)
- Unique constraints on user-id combinations
- Automatic timestamps for created/updated tracking
- Efficient querying with compound indexes

## Animations and Interactions

### Dialog Transitions

The custom Dialog component implements smooth enter/exit animations using CSS transitions. When dialogs appear, they fade in and slide slightly for a polished feel. The `hasInitTransition` prop enables initial entrance animations.

### Hover Effects

Interactive elements throughout the application respond to hover states:
- Calendar items show action buttons on hover
- Event slots highlight with darker borders
- Date numbers in month view show background changes

### Portal-Based Modals

All dialogs and alerts use React portals to render outside the component tree, ensuring proper z-index stacking and preventing overflow issues. This is particularly important for nested dialogs and complex layouts.

### Drag and Drop

The react-draggable library enables smooth event repositioning. The implementation includes boundary detection to prevent dragging events outside valid areas and maintains visual feedback during drag operations.

### Real-Time Indicators

The current time indicator in day view updates every minute, providing users with a clear reference point for the current moment. The indicator is positioned absolutely based on the current time relative to the visible time range.

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the Root Directory to `client` in project settings
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on git push

### Backend (Render)

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Set Root Directory to `server`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add environment variables
7. Deploy

Make sure to update `FRONTEND_URL` in backend environment variables to your Vercel deployment URL.

## Future Enhancements

### Core Features
- **Full Recurrence Support**: Implement comprehensive recurrence patterns (daily, weekly, monthly, yearly) with custom rules
- **Event Reminders**: Add notification system for upcoming events with configurable reminder times
- **Event Invitations**: Enable sharing events with other users and RSVP functionality
- **Calendar Sharing**: Allow users to share entire calendars with read/write permissions
- **Search Functionality**: Implement full-text search across events, tasks, and descriptions
- **Export/Import**: Add ability to export calendars as ICS files and import external calendar files

### User Experience
- **Week View**: Add a week view option alongside day and month views
- **Agenda View**: List view showing upcoming events in chronological order
- **Keyboard Shortcuts**: Implement comprehensive keyboard navigation (arrow keys, shortcuts for common actions)
- **Undo/Redo**: Add action history with undo/redo capability
- **Bulk Operations**: Allow selecting multiple events for bulk delete, move, or edit
- **Event Templates**: Save and reuse event templates for recurring meeting types

### Technical Improvements
- **Real-Time Sync**: Implement WebSocket connections for live updates across devices
- **Offline Support**: Add service worker for offline functionality with sync on reconnect
- **Performance Optimization**: Virtualize long event lists, implement code splitting
- **Advanced Filtering**: Filter events by calendar, type, date range, or custom tags
- **Analytics Dashboard**: Add calendar usage statistics and insights

### Integration Enhancements
- **Multiple Calendar Providers**: Support Microsoft Outlook, Apple iCloud calendars
- **Email Integration**: Send event invitations via email
- **Weather Integration**: Show weather forecasts for events with locations
- **Map Integration**: Display event locations on interactive maps

### Mobile Experience
- **Progressive Web App**: Convert to PWA with installable app capability
- **Touch Gestures**: Enhanced swipe and pinch gestures for mobile devices
- **Mobile-Optimized Views**: Specialized layouts for smaller screens

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open source and available under the MIT License.

