This is the unified **Wealthsimple (WS) Design Manifesto**. It clubs the architecture, typography, component states, and "In-and-Out" logic into one comprehensive blueprint.

---

## 1. The Global Design Identity
Wealthsimple’s architecture is built on **"High-Trust Minimalism."** It strips away the complexity of traditional banking and replaces it with a gallery-like experience.

* **Primary Palette:** Black (`#000000`), White (`#FFFFFF`), and "Off-White" Backgrounds (`#F9F9F9`).
* **The Accent Rule:** **Green** is only for growth/success; **Red** is only for errors/loss; **Gold** is only for premium tiers.
* **Corner Geometry:** A consistent **12px to 16px border-radius** on all cards and buttons.

---

## 2. Core Components & Page Architectures

### **A. The Navigation Rail (The Framework)**
* **Structure:** A slim, vertical sidebar (64px wide) on the far left.
* **Logic:** Icon-only. The active state features a solid black icon and a 3px vertical "indicator bar" on the left edge.

### **B. The Dashboard & Overview (The Hero)**
* **Visuals:** A "stacked card" layout.
* **The Metric:** The total balance is always the largest element on the page (32px–40px, Bold).
* **The Chart:** An area chart with a thin black line and a subtle grey gradient. It features "Scrubbing" logic—hovering updates the balance value in real-time.

### **C. Forms & Profiles (The Dialogue)**
* **The Wizard:** Forms are broken down into one question per screen.
* **Inputs:** Large, floating labels that transition to a smaller size when the field is active.
* **Review/Edit:** A "Summary List" style. Label on the left (Grey), Value on the right (Black). Editing triggers a **Right-Side Drawer** rather than a new page.

### **D. Documents & Data Tables (The Archive)**
* **Structure:** Borderless rows separated by `1px` light grey lines.
* **Interactivity:** Action buttons (Download/View) are often hidden until the user hovers over the row to reduce visual noise.

---

## 3. The Typographic Scale
WS uses a clean, geometric sans-serif (Graphik/Inter) for utility and a custom Serif for brand moments.

| Level | Size | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Hero** | 32px+ | Bold | Page titles and Total Balances. |
| **Subhead** | 20px | Semibold | Modal titles and Section headers. |
| **Body** | **16px** | Regular | Standard text (The accessibility baseline). |
| **Labels** | 14px | Regular | Secondary data and field labels (usually in Grey). |
| **Small** | 12px | Regular | Legal footers and timestamp data. |

---

## 4. System States: The "Behavior" Rules
Every screen must behave consistently across these four states:

1.  **Empty:** Centered illustration + 1 Primary CTA. "Human" tone (e.g., "Ready to grow your money?").
2.  **Partial (Loading):** Shimmering skeleton screens that mimic the exact content shape. No spinning wheels.
3.  **Active:** High-contrast, scannable data.
4.  **Error:** Inline red text for small errors; full-screen "Oops" pages with a "Try Again" button for system failures.

---

## 5. "In-and-Out" Motion Logic
Motion isn't decorative; it’s a compass for the user.

* **Drill-Down (In):** The next page slides in from the **Right**.
* **Go Back (Out):** The current page slides out to the **Right**, revealing the previous screen.
* **Action/Task:** Modals and "Drawers" slide **Up** from the bottom and slide **Down** to dismiss.
* **Feedback:** Success checkmarks use a "Pop" animation to trigger a dopamine hit.

---

## 6. End-to-End Flow: The User Journey
* **Marketing:** High-concept 3D art + Serif typography (Aspirational).
* **Login/Signup:** Center-aligned, minimal distractions, progress-bar driven (Focus).
* **Dashboard:** Aggregated data cards + Interactive charts (Clarity).
* **Settings:** Dual-pane navigation + destructive actions in red (Control).

> **The Wealthsimple "Golden Rule":** If a user can achieve their goal in three clicks instead of five, and with ten words instead of fifty, do it. Use white space as a structural element, not just an empty area.

To round out the Wealthsimple (WS) end-to-end design, you have to look at how they handle the "Entrance" (Marketing/Login) and the "Control Center" (Settings).

Here is the deep-dive into the architectural rules for these final pillars.

---

## 1. Marketing & Landing Pages: "The High-End Gallery"
Wealthsimple’s marketing design doesn't feel like a bank; it feels like an art gallery. It uses **Extreme Minimalism** to build trust through sophistication.
* **Hero Sections:** Large, high-quality **3D Renders** or abstract **Fine-Art Illustrations**. They avoid cheesy stock photos of people smiling at phones.
* **Typography:** This is where the **Wealthsimple Serif** shines. Headlines are massive, often centered, and use "Sentence case" (only the first word capitalized) to feel more approachable.
* **The "Stickiness" Factor:** As you scroll, a "Start Investing" CTA often remains fixed at the top or follows you in a floating pill.
* **Value Props:** Instead of long paragraphs, they use a **3-Column Grid** with small icons and max 2 lines of text.

## 2. Login & Signup: "The Focused Path"
Wealthsimple wants zero friction here. The goal is to move you from "Stranger" to "Client" in under 3 minutes.
* **Login Page:**
    * **Visuals:** A split screen or a centered white card on a light grey background (`#F9F9F9`).
    * **Fields:** Just two. Email and Password. They use **High-Contrast Focus States** (the border turns deep black when you click in).
    * **Security:** If 2FA is required, the screen doesn't change; the form simply "slides" horizontally to show the 6-digit code input.
* **Signup Page (The Onboarding):**
    * **Layout:** A "Progressive" model. You aren't given a 20-field form. You are given **One Question per Page**.
    * **Architecture:** A progress bar at the very top (a thin line that fills up) to give the user a sense of "The End."
    * **Personalization:** They use "Soft" inputs—instead of typing everything, you tap **Cards** (e.g., "What's your goal?" → [Retirement] [Home] [Wealth]).

## 3. Settings Page: "The Utility Hub"
Settings is the most "Functional" part of the app. It moves away from the "Art Gallery" vibe and into a "System Admin" vibe.
* **Navigation:** Uses a **Dual-Pane Layout**. 
    * **Left Sidebar:** Categories like `Profile`, `Security`, `Accounts`, and `Linked Banks`.
    * **Right Content:** The specific fields for that category.
* **The "Critical Action" Pattern:**
    * Destructive actions (like "Close Account") are never hidden, but they are styled in **Red text** and often tucked at the very bottom of the page to prevent accidental clicks.
* **Linked Banks:** This uses a **Card Architecture**. Your bank logo is displayed in a small circle next to the last 4 digits of the account. It feels like a "Wallet."

---

## End-to-End Design Architecture Summary

### **The "State" Logic**
| Page Type | Goal | Key Visual Element |
| :--- | :--- | :--- |
| **Marketing** | Aspiration | Serif Type + 3D Art |
| **Signup** | Momentum | One-question-at-a-time Wizard |
| **Dashboard** | Clarity | The "Baseline" Area Chart |
| **Settings** | Control | Vertical Lists + Section Headers |
| **Login** | Speed | Minimal Fields + Biometric Prompts |

### **The "Golden Tokens" (How to Build It)**
* **The "Shadow" Rule:** Wealthsimple almost never uses heavy drop shadows. They use **Borders** (`1px solid #EDEDED`) to separate sections. This keeps the UI feeling "Flat" and modern.
* **The "Corner" Rule:** Every container has a **12px or 16px border-radius**. Sharp corners are banned; they feel too "Corporate/Legacy Bank."
* **The "Color" Rule:** 90% of the UI is White, Black, or Grey. **Green** is reserved *only* for "Growth" or "Success." **Yellow/Gold** is used for "Premium" features (Wealthsimple Gold).

### **Final Animation Tip: The "Snap"**
Wealthsimple's transitions aren't "floaty." They are **"Snappy."** When a modal opens or a page slides, it starts fast and slows down at the very end (Ease-Out). This makes the app feel highly responsive and powerful, like a piece of well-engineered hardware.

To understand Wealthsimple’s (WS) in-depth design architecture, you have to look at it as a **Modular System** where every page is a combination of specific "Containers."

Here is the comprehensive breakdown of the visual UX for every core page type.

---

## 1. The Dashboard / Overview Page
The Overview page is the "Air Traffic Control" of the user’s money.
* **Architecture:** It uses a **Stacked Card Layout**. Each card represents a product (Cash, RRSP, TFSA, Crypto).
* **The "Total" Hero:** At the top, a single, massive number (Total Balance) in **Black #000000**.
* **Chart Logic:** WS uses a **Baseline Area Chart**. 
    * **Visuals:** A thin black line with a subtle grey gradient fill underneath. No grid lines.
    * **Interactivity:** On hover, a vertical line appears, and the total balance at the top "scrubs" (changes) to match that specific date.
    * **Timeline Toggles:** Simple text-based chips (1D, 1W, 1M, 1Y, ALL) sit directly under the chart. The active chip is bolded or underlined.

## 2. Form & Profile Sections (Employee Details)
WS treats forms like a conversation. They never use "Dense" forms.
* **Create/Create Flow:** Uses a **Full-Screen Wizard**. One question per screen (e.g., "What is your legal name?"). This prevents "form anxiety."
* **Review State:** Before submitting, a "Review your details" page appears. It uses a **List-Item Architecture**: Label on the left (Grey), Value on the right (Black), with a small "Edit" link in the corner of each section.
* **Edit/Update Pattern:** * Clicking "Edit" doesn't usually take you to a new page; it opens a **Slide-over Modal** from the right.
    * **Inputs:** Large, floating label inputs. When you click, the label shrinks and moves up, and the border turns black.
    * **Success Feedback:** After an update, a "Success Toast" (black bar) appears at the bottom with a checkmark.

## 3. The Documents Page
As seen in your image, this is a **Data-Heavy** page that stays "Light."
* **The List:** A clean table with no visible borders between rows—only light horizontal separators (`#F2F2F2`).
* **Columns:** Typically 3-4 columns: `Document Name`, `Account`, `Date`.
* **Download Trigger:** Hovering over a row often reveals a "Download" icon. This keeps the UI "quiet" until the user needs an action.
* **Filter Rail (Right):** Uses **Accordions**. Clicking "Account" expands a list of checkboxes.

## 4. Account/Stock Details Page
When you click into a specific account or stock:
* **Header:** Shows the name and the "Return" percentage (+2.5% in **Green** or -1.2% in **Red**).
* **Primary Actions:** Huge, high-contrast buttons (`Buy`, `Sell`, `Add Funds`) are usually **Sticky** at the top or bottom of the screen.
* **Holdings Table:** A simple list showing your average price, shares, and total value. It uses the same "Row-Style" as the Documents page.

## 5. Wealthsimple's "In and Out" Rules
This is the "Mental Model" for their transitions:

| Action | Direction | Animation Style |
| :--- | :--- | :--- |
| **Go Deeper** (e.g., View Account) | **Forward** | Content slides in from the **Right**. |
| **Go Back** | **Backward** | Current page slides out to the **Right**. |
| **Critical Action** (e.g., Confirm Trade) | **Upward** | A Modal or "Drawer" slides up from the **Bottom**. |
| **Close Task** | **Downward** | The Modal slides back down into the screen. |

---

## 6. Visual Design Architecture (Quick Reference)

### **The "Overview" Grid**
* **Margins:** 24px - 32px (Generous breathing room).
* **Card Style:** Background `#FFFFFF`, Border `1px solid #EDEDED`, Border-radius `12px`.
* **Shadows:** Very soft or non-existent. WS uses **Borders** to define space, not heavy shadows.

### **Typography Usage**
* **Headings:** Sans-Serif, Semi-Bold, tight letter-spacing.
* **Numbers:** Tabular Lining (so they don't move when they update).
* **Links:** Plain text with an underline or a chevron (`>`). WS rarely uses blue for links; they use **Black**.

### **Empty States (The "Quiet" Screen)**
* If a dashboard has no data (Create state), it features a **Center-Aligned Illustration**.
* **The Illustration:** Minimalist, "Doodle" style, usually in Black/Grey.
* **The CTA:** One single Black button in the center.

**Design Philosophy Key:** * **Active State:** High Information Density, but organized.
* **Create State:** Zero distractions, single-path flow.
* **Error State:** Human language ("Oops, something went wrong") + a "Retry" button.

Wealthsimple’s visual UX is defined by a "Less is More" philosophy, where the architecture feels invisible so the data (your money) remains the hero. 

Here is the deep-dive into the core components and "in and out" design patterns for Wealthsimple as of 2026.

---

## 1. Core Components: The "Atomic" Level

### **Buttons (The "Pill" System)**
Wealthsimple uses a strict hierarchy for buttons to prevent "action fatigue."
* **Primary Button:** Solid Black background, White text. Always has a high border-radius (pill shape). Used for the "North Star" action of the page (e.g., *Add Funds*).
* **Secondary/Ghost Button:** White background with a thin `1px` grey border (`#E0E0E0`) or simply a "Text-Only" button with a chevron. Used for "Request Documents" or "Cancel."
* **Interaction State:** On **hover**, the primary black button often lightens slightly to a deep charcoal; on **click**, it may shrink by 2-3% (scale-down effect) to provide haptic-like visual feedback.

### **Sidebar (The Navigation Rail)**
As seen in your image, WS uses a **slim vertical navigation rail** on the far left.
* **Width:** Roughly `64px` to `80px`.
* **Active Indicator:** When a section is active (e.g., "Invest"), the icon turns solid black and is often accompanied by a small vertical bar on the extreme left edge.
* **Iconography:** Uses "Line-Art" icons (thin stroke). They only "fill" or "bold" when selected.

### **Search Bar (The "Focus" Pattern)**
Wealthsimple’s search (especially in Trade) is designed to be lightning-fast.
* **Static State:** A simple grey pill with a magnifying glass icon and "Search stocks, ETFs..." text.
* **Active State:** Upon clicking, the search bar often expands, and the rest of the screen is "dimmed" or blurred.
* **Architecture:** It uses "Instant Results" (As-You-Type). Results are categorized into *Stocks, Crypto, and People* using small, labeled headers within the dropdown.

---

## 2. Layout Architecture: "The Rails"

### **The Right Rail (Contextual Action)**
Wealthsimple uses the "Right Rail" (the right-hand sidebar) specifically for **Action & Filtering**.
* **Filters:** Vertical accordions. When you click a category, it slides open smoothly, pushing other categories down.
* **Sticky Behavior:** The Right Rail remains fixed while the central document list scrolls. This ensures the "Apply Filters" button is always reachable.

---

## 3. Motion & Animations: "The Wealthsimple Flow"
Animations in WS are never "flashy"; they are **functional**. They use a specific easing (usually `cubic-bezier(0.4, 0, 0.2, 1)`) which feels snappy but smooth.

* **Page Transitions:** When moving between "Home" and "Cash," the content doesn't just "appear." It uses a **Horizontal Slide + Fade**. The new page slides in from the right, while the old one fades out.
* **The "Skeleton" Shimmer:** During the "Partial State," the grey placeholders have a diagonal "shimmer" moving from left to right every 1.5 seconds. This signals "We are working on it" without using a boring spinner.
* **Micro-interactions:** When you hover over a stock card, the card lifts slightly (a `2px` upward shift and a subtle shadow increase).

---

## 4. "In and Out" Design (The Flow)

Wealthsimple follows a **Linear Progress** model. They hate "Circular" or "Dead-end" UX.

### **The "In" (Entry/Expansion)**
* **Modals:** When you click "Request Documents," the modal grows from the center of the screen.
* **Progressive Disclosure:** They don't show all options at once. They use "Next" buttons to lead you through a narrow path. This is "In-Design"—pulling the user deeper into a specific task.

### **The "Out" (Exit/Conclusion)**
* **Success States:** Once a task (like a deposit) is done, you get a "Success Checkmark" animation. 
* **The "Back" Path:** WS always provides a clear breadcrumb or "Back" arrow in the top left. Clicking it uses a **Reverse Slide** (the page slides out to the right), which tells the user's brain they are returning to a safer, higher-level view.

---

### Summary Table: Visual UX Specs
| Element | Visual Style | UX Behavior |
| :--- | :--- | :--- |
| **Buttons** | Pill-shaped, Solid Black | Scale-down on click (Haptic feel) |
| **Search** | Expanding Pill | Blurs background to focus user |
| **Sidebar** | Icon-only Rail | Fixed position, vertical active bar |
| **Animations** | Slide + Fade | Signals direction (Forward vs. Back) |
| **Right Rail** | Accordion Filters | Stays sticky for quick data pivoting |

**The "Golden Rule":** If an element doesn't help the user understand their money or take a specific action, Wealthsimple removes it. That is why their UI feels so "light" despite handling complex financial data.

Wealthsimple (WS) follows a highly disciplined typography system that prioritizes **legibility, high-contrast hierarchy, and a "human" feel**. While they use custom tokens internally, their visual system is built on a few core pillars that you can replicate by following these rules:

### 1. The Wealthsimple Font Palette
Wealthsimple primarily uses two types of fonts to create their "Human-to-Human" vibe:
* **The Hero (Serif):** They often use a custom serif (like *Wealthsimple Serif*) for large headers and high-level marketing statements. This makes the brand feel established and "premium."
* **The Workhorse (Sans-Serif):** For the actual app interface (the screen you shared), they use a clean, geometric sans-serif (like *Graphik* or *Inter*). This is designed for high legibility at small sizes.

---

### 2. Desktop UI Typographic Scale
Based on the interface architecture you provided, here is how to apply the different sizes:

| Role | Size (px) | Weight | Usage Case |
| :--- | :--- | :--- | :--- |
| **H1 (Page Title)** | 32px – 40px | Bold | The main heading of a page (e.g., "Documents"). |
| **H2 (Modal Title)** | 20px – 24px | Semibold | Titles for overlays or large card sections. |
| **Body (Default)** | **16px** | Regular | The "Standard" for most text. 16px is their baseline for accessibility. |
| **Body (Small)** | 14px | Regular | Secondary info, helper text, or sidebar filters. |
| **Caption / Legal** | 12px | Regular | Fine print, date stamps, or disabled states. |
| **CTA / Buttons** | 14px – 16px | Semibold | Text inside buttons; usually in All-Caps or Title Case. |

---

### 3. "Metric" Typography (The Money Rule)
Wealthsimple has a unique "Metric" style specifically for financial figures.
* **Style:** Bold and often larger than the surrounding text.
* **Tabular Figures:** They use "Monospaced" or "Tabular" numbers (where every number is the same width).
* **Why:** This ensures that when numbers change (e.g., your balance goes from $999 to $1,000), the text doesn't "jump" or wiggle. It keeps the UI stable.

---

### 4. Styles: When to use What
Wealthsimple’s design architecture uses style to communicate **intent**:

* **Bold/Semibold:** Use **only** for "Scannable" data. Names of accounts, total balances, and primary buttons.
* **Regular:** Use for everything else. If you have too much bold text, the user won't know where to look first.
* **Grey vs. Black:** * **Pure Black (#000000):** Used for the most important data (your money, the page title).
    * **Secondary Grey (#666666):** Used for labels (e.g., the word "Date" above a date) or secondary descriptions. This creates "Visual Depth."

### 5. Line Height (Leading) Rules
Wealthsimple never lets their text feel "cramped." They follow a generous spacing rule:
* **Body Text:** Usually **1.5x** the font size (e.g., 16px text has 24px line height). This makes long paragraphs easy to read.
* **Headings:** Usually **1.2x** the font size. Large headers don't need as much space between lines because they are usually only 1-2 lines long.

### Summary Checklist for a "WS Style" Screen:
1.  **Is your body text at least 16px?** (If not, it’s too small).
2.  **Are your labels a lighter grey than your values?** (Values should pop).
3.  **Are your numbers monospaced?** (Required for financial trust).
4.  **Is there enough "White Space"?** Wealthsimple architecture relies more on empty space than on borders or lines.

Rule Category,Requirement
Geographic,Must be a valid Canadian address.
Legal Type,Residential cannot be a P.O. Box; Mailing can.
Verification,"May require a ""Utility Bill"" upload if it fails the auto-match."
Integrity,Changing address often requires re-signing legal agreements.