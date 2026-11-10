---
title: From a QR scan to a live dashboard
description: How the ProfScan attendance system works end to end, from an ESP32 scanner in a classroom to Laravel, a scheduler and a Socket.IO relay.
pubDate: 2026-11-03
tags: [esp32, laravel, socket.io, iot]
---

For my capstone project, [ProfScan](/projects/profscan), I built a system that records whether instructors show up to their classes. An instructor scans a QR code at the classroom door, and the admin and staff dashboards update right away, with no refresh. Fifteen minutes into a class with no scan, the system marks the instructor absent by itself.

It touches almost every layer of a stack: hardware, firmware, an API, a scheduler and real-time web clients. Here's how a single scan travels through it.

## The device

Each scanner is built from three parts:

- an **ESP32** microcontroller, for Wi-Fi and the logic
- a **serial QR scanner module**, wired to the ESP32's second hardware UART
- a **128×64 OLED screen**, showing a clock, "processing", and the scan result

The scanner module behaves like a keyboard on a serial line: it sends the decoded text followed by a line break. So the firmware's main loop just collects characters until it sees one:

```cpp
while (scannerSerial.available()) {
  char c = scannerSerial.read();

  if (c == '\r' || c == '\n') {
    buffer.trim();
    if (buffer.length() > 0) {
      if (!cfg.paired) {
        handlePairingQR(buffer);
      } else {
        String employeeId = extractEmployeeId(buffer);
        if (employeeId.length() > 0) sendScan(employeeId);
        lastScanTime = millis();
      }
      buffer = "";
    }
  } else {
    buffer += c;
  }
}
```

Notice the `if (!cfg.paired)` branch. The same scanner that reads instructor IDs is also how the device gets set up.

## Pairing by scanning a QR code

A classroom device has no keyboard, so typing Wi-Fi passwords into it isn't an option. Instead:

1. An admin adds a device in the web app. The server creates a record with a random pairing token (`tok_` plus 32 characters).
2. The admin panel shows a QR code for that device.
3. An unpaired scanner reads that QR code, registers itself with the server, and receives its configuration: server URL, device name and scan cooldown.
4. The firmware saves everything to the ESP32's flash with the `Preferences` library, so it survives power cuts.

If a device ever needs to be reassigned, holding its button for five seconds wipes the stored config and puts it back into pairing mode.

## Sending a scan

When an ID is read, the device posts a small JSON payload:

```cpp
scanDoc["employee_id"]   = employeeId;
scanDoc["pairing_token"] = cfg.pairing_token;
scanDoc["device_time"]   = (long)deviceTime;  // Unix timestamp from the ESP32
```

The `device_time` field was a deliberate choice. Requests can be delayed by a slow network or a retry, and attendance depends on the minute someone arrived. So the server uses the **device's own timestamp**, converted to Asia/Manila time, and only falls back to server time when the device doesn't send one.

On the Laravel side, the scan endpoint:

1. finds the device by its pairing token and rejects any device that isn't paired
2. finds the instructor by their ID
3. works out the day and time of the scan, and matches it against that instructor's schedule. Schedules use day codes like `MWF` and `TTH`, so a Wednesday scan has to match a `MWF` class.
4. records the attendance, then broadcasts the update

## Why a separate Socket.IO server

PHP handles a request and exits. That's great for an API, but it can't hold open thousands of long-lived connections to browsers. So real-time updates go through a small, separate **Node.js + Socket.IO relay**.

When Laravel needs to announce something, a scan or a schedule change, a `SocketService` class makes a plain HTTP POST to the relay (`/emit/scan`, `/emit/schedule-update` and so on). The relay pushes the event to the right **rooms**: admins join an `admin` room and staff join a `staff` room, so each dashboard receives only what it shows.

Laravel stays a normal request/response app, and the relay does the one thing Node is good at here.

## Knowing a device is alive

A scanner that silently dies is worse than one that loudly fails, because instructors would scan and nothing would be recorded. So every paired device sends a **heartbeat every second**. The server marks it online and broadcasts its status. A scheduled task runs every five seconds and flags any device that hasn't been heard from in 35 seconds as offline, which shows up on the admin dashboard right away.

## The rules that run without anyone

The attendance logic itself lives in Laravel's scheduler, which runs in its own Docker container:

- **Every minute:** classes whose start time has passed move from *Upcoming* to *Ongoing*, and any class still without a scan **15 minutes after its start** is marked *Absent*. Both changes are broadcast so dashboards update.
- **At midnight:** every schedule resets for the next day.

Staff can still step in. They can excuse every class on a given day, for example a holiday or a campus event, or mark an absence by hand.

## What I'd do differently

- **Authenticate devices more strongly.** Right now a device proves who it is with its pairing token alone. If I rebuilt it, I'd sign each request and rate-limit the scan endpoint.
- **Test the scheduler.** Its timing rules decide whether someone is marked absent, so they deserve automated tests with a fake clock. That would be easy with Carbon's test helpers, and I didn't write them.
- **Plan for offline scans.** If Wi-Fi drops, a scan fails. Since the device already records its own timestamp, the next step would be to queue failed scans in flash and send them when the connection returns.

Building ProfScan taught me that the hard parts of an IoT system aren't the individual pieces. They're the seams between them: whose clock to trust, how to know a device is alive, and how to get an event from a PHP request into a browser that's been open all day.
