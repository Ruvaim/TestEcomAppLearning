# Implementation Approach

I divided the assignment into **4 phases/modules** to manage my time effectively, as I had **2 days** to complete the task.

## 1. Project Setup, Architecture & UI — Saturday (First Half)

I started with the project setup, application architecture, folder structure, and the initial UI implementation.

The goal was to complete the foundation and major UI work by the **first half of Saturday**, so that I could use the remaining time for the more technically challenging requirements.

### Key work

- Set up the React Native CLI project with TypeScript.
- Defined the application architecture and folder structure.
- Set up navigation and screen structure.
- Implemented the core product listing and product details UI.
- Implemented category landing and filtering/search-related UI.
- Set up Redux Toolkit and RTK Query for state and API management.
- Added loading, error, and empty states.
- Implemented cart functionality and quantity management.
- Implemented checkout and order confirmation screens.

---

## 2. Deep Linking — Saturday (Second Half)

In the **second half of Saturday**, I started working on deep linking.

I implemented the deep-linking flow for **Android first**, followed by **iOS**.

### Key work

- Implemented custom `myapp://` deep links.
- Added routes for:
  - Product listing
  - Category landing
  - Product details
  - Cart
  - Checkout
  - Order confirmation
  - Login
- Handled authentication-based navigation for protected routes.
- Added an authentication flow for the checkout page.
- Ensured that users cannot proceed to checkout when the cart is empty.
- Added handling for redirecting users to the intended screen after login.
- Covered edge cases around navigation state and deep-link handling.

### iOS Deep Linking Challenge

One of the major challenges was handling deep links when the iOS application was already running in the **foreground or background**.

Some of the required native imports/handling were not directly supported in the project's **New Architecture** setup. To handle this, I created a **custom native bridge module**, connected it to the React Native project through Xcode, and used it to forward the deep-link events correctly to React Native.

This allowed me to handle deep links beyond just the cold-start scenario.

---

## 3. Manual App Icon Change — Sunday (First Half)

I kept the **full day on Sunday** primarily for the app icon change requirement because this was a new area for me and required additional time to understand the platform-specific implementation.

During the **first half of Sunday**, I completed the manual app icon switching functionality on both **Android and iOS**, controlled through JavaScript.

### Android

- Created separate launcher activity aliases for the default and promotional icons.
- Created a native Android module to switch between the launcher aliases.
- Connected the native module with React Native.

### iOS

- Configured alternate app icons using Xcode Asset Catalogs.
- Added the promotional icon as an alternate app icon.
- Created a native iOS bridge module to expose icon switching to JavaScript.

This gave me a common JavaScript-level API while keeping the platform-specific implementation native.

---

## 4. Scheduled Automatic App Icon Change — Sunday (Second Half)

After completing manual icon switching, I started working on the **scheduled automatic app icon change**.

The requirement was to automatically use the promotional icon during a configured start/end period and revert to the default icon after the period ends.

### Android Implementation

For Android, I implemented the scheduling using:

- `AlarmManager`
- `BroadcastReceiver`
- Android launcher activity aliases
- A native React Native module

The flow is:

```text
Configured Start Date/Time
        ↓
AlarmManager triggers
        ↓
BroadcastReceiver receives event
        ↓
Promotional launcher alias enabled
        ↓
Promotional icon is displayed
        ↓
Configured End Date/Time
        ↓
AlarmManager triggers again
        ↓
BroadcastReceiver receives event
        ↓
Default launcher alias restored
```

A platform-specific limitation was encountered when changing launcher aliases while the application was actively running. Android can close the current task when the launcher component representing the running task is disabled, even when `DONT_KILL_APP` is used.

To handle this, I added foreground-state tracking and deferred the icon change when the application is in the foreground. The scheduled change can then be performed when the app is no longer actively running.

### iOS Platform Limitation

For iOS, I implemented the alternate-icon functionality and verified manual icon switching.

However, **reliably scheduling an exact background icon change while the application is terminated is a platform limitation on iOS**. Unlike Android's `AlarmManager` + `BroadcastReceiver` approach, iOS does not provide an equivalent mechanism that allows an application to execute arbitrary code at an exact future time while it is terminated.

Because of this platform restriction, the Android implementation supports the full automatic scheduling flow, while the iOS implementation is limited by the background execution capabilities provided by the platform.

---

# Key Technical Decisions

### React Native + TypeScript

I used React Native with TypeScript to keep the implementation strongly typed and maintainable.

### Redux Toolkit + RTK Query

Redux Toolkit was used for application state such as the cart and authentication, while RTK Query was used for API data fetching and caching.

### Native Modules for Platform-Specific Features

For features that cannot be implemented reliably using JavaScript alone, I created native bridge modules for Android and iOS. This was particularly important for:

- App icon switching
- iOS deep-link event handling

### Platform-Specific Scheduling

The scheduled icon change was implemented differently on each platform because Android and iOS provide different background execution capabilities.

### Authentication-Aware Deep Linking

Deep links to protected screens, such as checkout, are handled through authentication-aware navigation. If the user is not authenticated, they are redirected to login and then returned to the requested destination after successful authentication.

### Empty Cart Protection

The checkout flow also validates the cart state so that a user cannot proceed to checkout with an empty cart.

---

# Assumptions

- The promotional icon schedule is configured using a start date/time and an end date/time.
- The default icon should be restored after the promotional period ends.
- Checkout is treated as an authenticated route.
- A user must have at least one item in the cart before accessing checkout.
- Platform-specific limitations are handled using the capabilities provided by Android and iOS rather than attempting to bypass OS restrictions.

---

# Overall Timeline

| Day          | Time        | Focus                                                              |
| ------------ | ----------- | ------------------------------------------------------------------ |
| **Saturday** | First Half  | Project setup, architecture, folder structure and UI               |
| **Saturday** | Second Half | Android and iOS deep linking                                       |
| **Sunday**   | First Half  | Manual app icon switching on Android and iOS                       |
| **Sunday**   | Second Half | Scheduled automatic app icon change and platform-specific handling |

This phased approach helped me prioritize the core application functionality first and then allocate dedicated time to the more challenging platform-specific requirements.
