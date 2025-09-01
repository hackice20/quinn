# Technical Architecture & Logic

### Core Technologies

*   **Vite**: I utilized Vite for its rapid development server, Hot Module Replacement (HMR), and optimized build process.
*   **React**: I employed React for its component-based architecture and declarative UI paradigm, which facilitated a predictable and maintainable state-driven application.
*   **Tailwind CSS**: I chose Tailwind CSS for its utility-first methodology, enabling direct and responsive styling within the component markup.

### Application Architecture

*   **Component Hierarchy**: The application follows a clear hierarchical structure:
    *   `App.jsx`: The root component, responsible for managing the global state of the dynamic navigation bar.
    *   `Calendar.jsx`: A container component encapsulating all calendar logic, including the infinite scroll mechanism, date rendering, and modal state management.
    *   `JournalModal.jsx`: A presentational component designed specifically for displaying individual journal entries in a detailed view.
*   **State Management**: My state management strategy was to lift state only when absolutely necessary.
    *   **Lifted State**: The `currentDate` state, which controls the dynamic text in the navigation header, is managed in the `App.jsx` component. A callback function is passed down to the `Calendar` component to allow it to communicate scroll-based date changes back up to this shared ancestor.
    *   **Localized State**: All state internal to the calendar's functionality, such as the array of rendered months (`monthsToDisplay`) and the index of the selected journal entry (`selectedEntryIndex`), is localized within the `Calendar` component to ensure proper encapsulation and prevent unnecessary re-renders of parent components.

### Key Feature Implementation

*   **Dynamic Header & Infinite Scroll**: I implemented a dual `IntersectionObserver` strategy to achieve these core features with high performance.
    *   **Infinite Scroll Observer**: This observer is attached to the last rendered month element. It is configured with a `200px` root margin to trigger its callback just before the user reaches the end of the content, creating a seamless loading experience by appending the next month to the DOM.
    *   **Dynamic Header Observer**: A second, more complex observer is attached to every month container. I used a negative top `rootMargin` (`0px 0px -90% 0px`) to create a trigger line near the top of the viewport. When any month crosses this line, it fires a callback to update the `App` component's state, keeping the navigation bar's text synchronized with the topmost visible month.
*   **Data Handling & Performance**: I processed the journal entry data for efficient, constant-time retrieval.
    *   I transformed the raw array of journal entries from `data.js` into a `Map` object using the `useMemo` hook.
    *   This provides a memoized, O(1) lookup structure where a `DateString` key can directly retrieve the corresponding journal entry, which is essential for maintaining performance as the list of rendered dates grows.
*   **Journal Entry Modal**: I built a fully interactive modal for viewing journal entry details.
    *   The modal's visibility and content are controlled by the `selectedEntryIndex` state in the `Calendar` component.
    *   Navigation between entries is handled by incrementing or decrementing this index, with the navigation arrows being conditionally rendered and disabled when the user is at the first or last entry.
*   **Responsive Design**: I adopted a mobile-first approach to ensure a consistent and optimal user experience across all devices.
    *   The calendar date cells use responsive height classes (`h-24 md:h-40`) to ensure they are appropriately sized on both mobile and desktop screens.
    *   The modal's navigation arrows use responsive `translate` utilities to change their position based on the viewport width, ensuring they are always visible and accessible.
*   **Mobile Development & Testing**: I configured the development environment for streamlined testing on physical mobile devices.
    *   The `dev` script in `package.json` was modified to include the `--host` flag. This exposes the Vite development server to the local network, allowing any device on the same Wi-Fi to access the application for testing.
