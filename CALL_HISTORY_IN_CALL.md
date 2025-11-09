# Call History During Active Call (Like Messenger)

## Feature Overview

When you're on a video/audio call, you can now view your previous call history with that person - just like Facebook Messenger!

## How It Works

### 1. **History Button** 📜
- Located at the top-right of the call screen
- Only appears if you have previous calls with this person
- Click to open/close the history sidebar

### 2. **History Sidebar** 📊
- Slides in from the right side
- Shows all previous calls with this person
- Displays:
  - Call type (Video/Audio)
  - Call direction (Incoming ↙ / Outgoing ↗)
  - Call status (Completed, Missed, Declined, Cancelled)
  - Call duration (for completed calls)
  - Time of call (e.g., "2m ago", "Yesterday", "Jan 15")

### 3. **Visual Indicators** 🎨

#### Status Colors:
- 🟢 **Green**: Completed calls
- 🔴 **Red**: Missed or Declined calls
- 🟡 **Yellow**: Cancelled calls

#### Call Types:
- 📹 **Video icon**: Video calls
- 📞 **Phone icon**: Voice calls

#### Direction:
- **↗ Outgoing**: You called them
- **↙ Incoming**: They called you

## UI Layout

```
┌─────────────────────────────────────────┐
│  ← Back          📹 Video Call    📜    │ ← History button
│                                          │
│                                          │
│         [Video Call Interface]           │
│                                          │
│                                          │
└─────────────────────────────────────────┘
```

When history is open:

```
┌──────────────────────────┬──────────────┐
│  ← Back    📹 Video Call  │ Call History │
│                           │      ✕       │
│   [Video Interface]       │──────────────│
│                           │ 📹 Video     │
│                           │ ↗ Outgoing   │
│                           │ ⏱ 2m 30s    │
│                           │ 5m ago       │
│                           │──────────────│
│                           │ 📞 Voice     │
│                           │ ↙ Incoming   │
│                           │ Missed       │
│                           │ Yesterday    │
└──────────────────────────┴──────────────┘
```

## Example History Items

### Completed Call:
```
┌─────────────────────────────┐
│ 📹  Video                    │
│     ↗ Outgoing               │
│     ⏱ 2m 30s                │
│     5 minutes ago            │
└─────────────────────────────┘
```

### Missed Call:
```
┌─────────────────────────────┐
│ 📞  Voice                    │
│     ↙ Incoming               │
│     Missed                   │
│     Yesterday                │
└─────────────────────────────┘
```

### Declined Call:
```
┌─────────────────────────────┐
│ 📹  Video                    │
│     ↗ Outgoing               │
│     Declined                 │
│     Jan 15                   │
└─────────────────────────────┘
```

## Features

✅ **Real-time Updates**: New calls appear immediately
✅ **Smooth Animation**: Sidebar slides in/out smoothly
✅ **Responsive Design**: Works on all screen sizes
✅ **Color-coded Status**: Easy to identify call outcomes
✅ **Time Formatting**: Smart time display (Just now, 5m ago, Yesterday, etc.)
✅ **Scrollable**: Can view long call history
✅ **Non-intrusive**: Doesn't interfere with the call

## Technical Details

### Data Source:
- Fetches messages from the chat with the current call participant
- Filters only call messages (`isCallMessage: true`)
- Displays in reverse chronological order (newest first)

### Performance:
- History loads in background while call is connecting
- No impact on call quality
- Minimal memory usage

### Privacy:
- Only shows calls between you and the current participant
- No other users' call history is visible

## Usage Tips

1. **During a call**: Click the history icon (📜) at top-right
2. **View details**: Scroll through previous calls
3. **Close sidebar**: Click the ✕ button or history icon again
4. **Continue call**: History sidebar doesn't affect the ongoing call

## Comparison with Messenger

| Feature | Messenger | Your App |
|---------|-----------|----------|
| History during call | ✅ | ✅ |
| Call duration | ✅ | ✅ |
| Call status | ✅ | ✅ |
| Time formatting | ✅ | ✅ |
| Color coding | ✅ | ✅ |
| Incoming/Outgoing | ✅ | ✅ |
| Sidebar design | ✅ | ✅ |

## Future Enhancements (Optional)

- 🔄 Click on history item to view more details
- 📊 Call statistics (total calls, total duration)
- 🔍 Search in call history
- 📅 Filter by date range
- 📥 Export call history
