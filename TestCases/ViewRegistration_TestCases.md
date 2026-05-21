# View Registration Module – Test Cases

Application: Mobipark Member Site  
Module: View Registration  
Generated From: View Registered Vehicles Sheet Test Cases  

---

# TC_001 – Verify authenticated member can open the Registered vehicles tab and load the vehicle list area

## Feature
Vehicle Registration

## Sub Feature
Registered Vehicles View

## Preconditions
-

## Test Steps
1. Navigate to the Login page
2. Sign in with valid credentials for an activated member account that has at least one completed vehicle registration
3. Navigate to the Vehicle registration (owner registration) area
4. Select the Registered vehicles tab if it is not already active
5. Observe whether vehicle cards or list rows appear

## Expected Result
The system should display the Registered vehicles view without errors and should show at least one registered vehicle entry

---

# TC_002 – Verify vehicle serial number is displayed for each vehicle in the registered list

## Feature
Vehicle Registration

## Sub Feature
Vehicle Information Display

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Locate each vehicle entry in the list
3. Read the vehicle serial number or vehicle identification number field for each entry

## Expected Result
The system should display the vehicle serial number for every listed vehicle and the value should match the stored registration record

---

# TC_003 – Verify purchase date or delivery date is displayed for each registered vehicle

## Feature
Vehicle Registration

## Sub Feature
Vehicle Information Display

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Locate each vehicle entry
3. Read the new car purchase date or delivery date field for each entry

## Expected Result
The system should display the purchase or delivery date for every listed vehicle and the value should match the stored registration record

---

# TC_004 – Verify warranty period end date is displayed for each registered vehicle

## Feature
Vehicle Registration

## Sub Feature
Vehicle Information Display

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Locate each vehicle entry
3. Read the warranty period information shown for each entry

## Expected Result
The system should display the warranty period information for every listed vehicle and it should match the stored registration record

---

# TC_005 – Verify the vehicle card shows Current owner for the member who most recently registered that vehicle as sole owner

## Feature
View Registered Vehicles

## Sub Feature
Ownership Badge

## Preconditions
None

## Test Steps
1. Sign in as User A
2. Complete new vehicle registration for a vehicle not yet linked to another member
3. Open the Registered vehicles tab
4. Locate the vehicle card and read the ownership badge

## Expected Result
The vehicle card for User A should show the Current owner badge

---

# TC_006 – Verify the vehicle card shows Previous owner for the prior registrant after another member becomes the current owner

## Feature
View Registered Vehicles

## Sub Feature
Ownership Badge

## Preconditions
1. User B has become the current owner for that vehicle per product rules
2. User A still sees the vehicle in the list when the product retains previous owners

## Test Steps
1. Sign in as User A who registered the vehicle first
2. Open Registered vehicles
3. Locate that vehicle card and read the ownership badge

## Expected Result
The vehicle card for User A should show Previous owner and should not show Current owner

---

# TC_007 – Verify the vehicle card shows Current owner for the member who holds current ownership after transfer

## Feature
View Registered Vehicles

## Sub Feature
Ownership Badge

## Preconditions
User B is recorded as the active current owner in test data

## Test Steps
1. Sign in as User B where User B is the current owner for that vehicle
2. Open Registered vehicles
3. Locate the vehicle card

## Expected Result
The vehicle card for User B should show the Current owner badge

---

# TC_008 – Verify Current owner and Previous owner badges are not both shown on the same vehicle card for one ownership record

## Feature
View Registered Vehicles

## Sub Feature
Ownership Badge

## Preconditions
None

## Test Steps
1. Open Registered vehicles as a member who has that vehicle listed
2. Inspect badges on that vehicle card

## Expected Result
Only one ownership badge should appear on that card according to product rules

---

# TC_009 – Verify ownership badge wording matches product labels for Current owner and Previous owner

## Feature
View Registered Vehicles

## Sub Feature
Ownership Badge

## Preconditions
None

## Test Steps
1. Open Registered vehicles for accounts that display each ownership state
2. Compare badge text to the specification

## Expected Result
Badge labels should match the specification exactly

---

# TC_010 – Verify warranty extension callout text is visible on the registered vehicles view

## Feature
Vehicle Registration

## Sub Feature
Informational Content

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Locate the warranty information callout or notice area
3. Read the text about registering within one month of delivery and the two-year warranty extension

## Expected Result
The system should display the warranty extension guidance consistent with the product copy and layout

---

# TC_011 – Verify switching to the New registration tab shows the new registration content

## Feature
Vehicle Registration

## Sub Feature
Tab Navigation

## Preconditions
None

## Test Steps
1. Navigate back to the Registered vehicles tab area if you are not already on the vehicle registration page
2. Click the New registration tab
3. Observe the main content area

## Expected Result
The system should show the New registration workflow content and should indicate the New registration tab as active

---

# TC_012 – Verify switching back to the Registered vehicles tab restores the registered vehicle list

## Feature
Vehicle Registration

## Sub Feature
Tab Navigation

## Preconditions
None

## Test Steps
1. On the vehicle registration page ensure the New registration tab is selected
2. Click the Registered vehicles tab
3. Observe the list or empty state area

## Expected Result
The system should show the Registered vehicles tab as active and should display the same registered vehicle entries as before the tab switch

---

# TC_013 – Verify Return to My Page navigates back to the member My page or dashboard destination

## Feature
Vehicle Registration

## Sub Feature
Navigation

## Preconditions
None

## Test Steps
1. Navigate back to the Registered vehicles tab if needed
2. Click Return to My Page or the equivalent back navigation control
3. Observe the destination page

## Expected Result
The system should navigate to the My page or member home destination without errors

---

# TC_014 – Verify Register a new vehicle entry navigates to new vehicle registration flow

## Feature
Vehicle Registration

## Sub Feature
Navigation

## Preconditions
None

## Test Steps
1. Navigate back to the Registered vehicles tab if the current page is not the vehicle registration page with that tab active
2. Click the Register a new vehicle control with the plus label
3. Observe the destination route or form step

## Expected Result
The system should open the new vehicle registration flow or the New registration tab content as designed

---

# TC_015 – Verify registered vehicles list is empty or shows an appropriate empty state when the member has no registrations

## Feature
Vehicle Registration

## Sub Feature
Empty State

## Preconditions
A test member account exists with no vehicle registrations

## Test Steps
1. Sign in with an activated member account that has zero registered vehicles
2. Navigate to Vehicle registration (owner registration)
3. Open the Registered vehicles tab
4. Observe the content area

## Expected Result
The system should show an empty list with a clear empty-state message and should not show another member vehicles

---

# TC_016 – Verify multiple registered vehicles appear as separate list entries when the member has several registrations

## Feature
Vehicle Registration

## Sub Feature
List Display

## Preconditions
A test member account exists with two or more registered vehicles

## Test Steps
1. Sign in with an activated member account that has at least two registered vehicles
2. Navigate to Vehicle registration (owner registration)
3. Open the Registered vehicles tab
4. Count distinct vehicle entries such as separate cards or rows

## Expected Result
The system should render a distinct entry for each registration and each entry should show serial number, purchase date, warranty period, and ownership status fields

---

# TC_017 – Verify the Registered vehicles page is not accessible without authentication when no session exists

## Feature
Vehicle Registration

## Sub Feature
Access Control

## Preconditions
-

## Test Steps
1. Ensure all application sessions are signed out or use a private window
2. Attempt to open the Registered vehicles URL directly if known
3. Observe the response

## Expected Result
The system should block access and should redirect or require sign-in without exposing private vehicle data

---

# TC_018 – Verify another member vehicle registrations never appear in the signed-in user list

## Feature
Vehicle Registration

## Sub Feature
Data Isolation

## Preconditions
Two member accounts exist each with at least one non-overlapping vehicle registration

## Test Steps
1. Sign in as member A who has at least one vehicle registration
2. Note serial numbers shown on Registered vehicles
3. Sign out and sign in as member B who has different vehicle registrations
4. Open Registered vehicles for member B
5. Compare lists

## Expected Result
The system should list only vehicles belonging to the signed-in member and should not show member A data to member B

---

# TC_019 – Verify two-year warranty badge or label appears when the registration qualifies under the thirty-day extension rule

## Feature
Vehicle Registration

## Sub Feature
Warranty Presentation

## Preconditions
None

## Test Steps
1. Sign in with a member account that has a vehicle registered within thirty days of delivery per test data
2. Navigate to the Registered vehicles tab
3. Observe warranty-related badges or labels on that vehicle card

## Expected Result
The system should indicate extended two-year warranty coverage in the UI when the business rule applies

---

# TC_020 – Verify warranty presentation reflects standard coverage when registration is outside the thirty-day extension window

## Feature
Vehicle Registration

## Sub Feature
Warranty Presentation

## Preconditions
Test data defines a non-qualifying registration timing relative to delivery

## Test Steps
1. Sign in with a member account that has a vehicle registered after thirty days from delivery per test data
2. Navigate to the Registered vehicles tab
3. Observe warranty-related badges and the displayed warranty period

## Expected Result
The system should present warranty information consistent with standard coverage and should not show the two-year extension badge incorrectly

---

# TC_021 – Verify displayed warranty period is consistent with the delivery date and configured warranty rules

## Feature
Vehicle Registration

## Sub Feature
Warranty Calculation

## Preconditions
 Expected warranty end dates are documented for the test vehicle records

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Select one vehicle with known delivery date and warranty end date in test records
3. Compare the on-screen warranty period with the expected end date from the rule set

## Expected Result
The on-screen warranty period should match the calculated end date from the business rules

---

# TC_022 – Verify purchase date and warranty period use the intended date format and locale

## Feature
Vehicle Registration

## Sub Feature
Formatting

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Read the purchase or delivery date and warranty period fields
3. Compare separators and ordering with the product locale specification

## Expected Result
The system should format dates consistently such as YYYY/MM/DD style when that is the design for this locale

---

# TC_023 – Verify browser refresh on the Registered vehicles tab reloads the list without losing authentication

## Feature
Vehicle Registration

## Sub Feature
Session Stability

## Preconditions
None

## Test Steps
1. Navigate back to the Registered vehicles tab if needed
2. Use the browser refresh action
3. Observe authentication state and list content

## Expected Result
The system should remain signed in and should reload the vehicle list without data corruption

---

# TC_024 – Verify direct URL navigation to the registered vehicles view works for a signed-in session

## Feature
Vehicle Registration

## Sub Feature
Deep Link

## Preconditions
None

## Test Steps
1. While signed in paste or navigate to the Registered vehicles page URL if available
2. Observe tab selection and list content

## Expected Result
The system should show the Registered vehicles content for the authenticated member

---

# TC_025 – Verify keyboard user can move focus between tabs and primary actions

## Feature
Vehicle Registration

## Sub Feature
Keyboard Navigation

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Use Tab to reach the New registration tab control
3. Activate it with Enter or Space if applicable
4. Tab to Return to My Page and to Register a new vehicle

## Expected Result
The system should provide visible focus and should allow keyboard activation consistent with mouse behavior

---

# TC_026 – Verify direct URL navigation to the registered vehicles view works for a signed-in session

## Feature
Vehicle Registration

## Sub Feature
Backend Consistency

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Capture on-screen serial number, purchase date, warranty period, and ownership status for one vehicle
3. Using permitted tools compare with the registration API or database row for that vehicle ID

## Expected Result
The on-screen values should match the authoritative server data for that member and vehicle

---

# TC_027 – Verify vehicle brand and model labels are displayed on each registered vehicle card

## Feature
Vehicle Registration

## Sub Feature
Vehicle Information Display

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Read the brand and model text on each vehicle entry

## Expected Result
The system should display brand and model information consistent with the registration record

---

# TC_028 – Verify status badges such as current owner and extended warranty appear according to registration data

## Feature
Vehicle Registration

## Sub Feature
Status Badges

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Observe badges adjacent to model names for each entry
3. Compare badge presence with expected states from test data

## Expected Result
The system should show Current owner and warranty-related badges only when the underlying data qualifies

---

# TC_029 – Verify page title and subtitle for vehicle owner registration are displayed

## Feature
Vehicle Registration

## Sub Feature
Page Header

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Read the main page title and subtitle above the tabs

## Expected Result
The system should display the vehicle registration title and explanatory subtitle per the design

---

# TC_030 – Verify MOBIPARK header and primary navigation remain available on the registered vehicles view

## Feature
Vehicle Registration

## Sub Feature
Global Header

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Observe the header logo and primary links such as My page and Enquiry

## Expected Result
The system should render the global header without broken layout or missing key controls

---

# TC_031 – Verify Japanese labels for global header and navigation render correctly on the registered vehicles view

## Feature
Vehicle Registration

## Sub Feature
Localization

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Read Japanese labels in the header and local navigation where applicable

## Expected Result
The system should display intended Japanese strings without truncation errors on typical desktop width

---

# TC_032 – Verify vehicle list layout remains usable at a narrow viewport width

## Feature
Vehicle Registration

## Sub Feature
Responsive Layout

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Resize the browser to a narrow mobile width
3. Observe card stacking and readability of serial number and dates

## Expected Result
The system should adapt layout so fields remain readable without destructive overlap

---

# TC_033 – Verify very long brand or model names wrap or truncate without breaking the card layout

## Feature
Vehicle Registration

## Sub Feature
Layout Robustness

## Preconditions
A test vehicle record exists with long brand or model text

## Test Steps
1. Use a test registration with a long brand or model string within allowed limits
2. Open the Registered vehicles tab
3. Observe the vehicle card header area

## Expected Result
The system should present long text without breaking the card layout or hiding critical fields

---

# TC_034 – Verify stored vehicle text fields containing angle brackets or script-like content are not executed in the browser

## Feature
Vehicle Registration

## Sub Feature
Stored Content Safety

## Preconditions
 A controlled test payload exists per security testing policy

## Test Steps
1. Using an approved security test vehicle record view the Registered vehicles tab
2. Observe brand model and serial fields rendering
3. Inspect DOM for unexpected script execution if permitted

## Expected Result
The system should treat vehicle text as plain data and should not execute embedded script in the list view

---

# TC_035 – Verify vehicle thumbnail or placeholder image loads without broken image icons

## Feature
Vehicle Registration

## Sub Feature
Media Display

## Preconditions
None

## Test Steps
1. Open Vehicle registration (owner registration) and ensure the Registered vehicles tab is active if you are not already on that view
2. Observe the image area on each vehicle card

## Expected Result
The system should show a vehicle image or an intentional placeholder without a broken image icon for normal records

---

# TC_036 – Verify switching member context after viewing vehicles updates the list to the new member data

## Feature
Vehicle Registration

## Sub Feature
Session Context

## Preconditions
Two members exist with different registered vehicles

## Test Steps
1. Sign in as member A and open Registered vehicles noting at least one serial number
2. Sign out completely
3. Sign in as member B and open Registered vehicles

## Expected Result
The list after step 3 should show only member B vehicles and should not retain member A entries

---

# TC_037 – Verify vehicle details shown in the UI match the Mobipark main site catalog response for the same VIN

## Feature
Vehicle Registration

## Sub Feature
Main Site Data

## Preconditions
None

## Test Steps
1. Obtain the data for the VIN from the main site lookup
2. Open Registered vehicles for that VIN
3. Compare brand model VIN delivery date warranty fields on screen to the data

## Expected Result
On-screen values should match the main site source fields

---

# TC_038 – Verify warranty details are not shown on the second and later vehicles in the Registered vehicles list

## Feature
Vehicle Registration

## Sub Feature
Warranty Display

## Preconditions
Member has at least two registered vehicles in test data

## Test Steps
1. Sign in as a member who has two or more vehicles on Registered vehicles
2. Look at the first vehicle card
3. Look at the second and third vehicle cards

## Expected Result
The first vehicle may show warranty info per design; from the second vehicle onward warranty details should not appear

---

# TC_039 – Verify only one-year warranty applies when the main site has no delivery date for that vehicle

## Feature
Vehicle Registration

## Sub Feature
Warranty Display

## Preconditions
Test VIN exists with missing delivery_date on main site

## Test Steps
1. Use a vehicle whose main site catalog record has no delivery date
2. Open New registration search or Registered vehicles for that VIN
3. Check warranty text or period shown

## Expected Result
The screen should treat warranty as one-year standard only; no two-year extension based on delivery timing

---

# TC_040 – Verify warranty information is not shown for vehicles where the member is only a previous owner or has an earlier ownership history per product rules

## Feature
Vehicle Registration

## Sub Feature
Warranty Display

## Preconditions
Test data sets up previous-only ownership for same user

## Test Steps
1. Sign in as the member who should see the previous-owner or history state for that vehicle
2. Open Registered vehicles or the vehicle detail that applies to previous ownership
3. Look for warranty period badges or warranty paragraphs

## Expected Result
Warranty information should not appear on that vehicle row when the product hides it for previous ownership by that user

---

# TC_041 – Verify Member Registration Date is updated in MOBIPARK main system inventory when a vehicle is registered on the member site

## Feature
Vehicle Registration

## Sub Feature
Main System Inventory Sync

## Preconditions
1. Tester has read access to main system inventory or equivalent API for the VIN
2. Member registration can complete successfully for the test VIN

## Test Steps
1. Record the inventory row for the test VIN on the MOBIPARK main system before registration including Member Registration Date if present
2. On the member site complete vehicle registration for that VIN as an authenticated member
3. Query or open the same vehicle inventory record on the main system after registration completes
4. Read Member Registration Date and compare with the registration completion date or timestamp from the member flow

## Expected Result
Member Registration Date on the main inventory record should be updated to reflect vehicle registration on the member site and should align with the documented date-time rule

---

# TC_042 – Verify delivery date and warranty period on registered vehicle list and details stay consistent with the main site and with registration success messaging

## Feature
View Registered Vehicles

## Sub Feature
Warranty and Delivery Sync

## Preconditions
1. Two member accounts can register vehicles.
2. Main site access exists to view and set delivery date for the vehicle.
3. Test data supports within-one-month-of-purchase rule for two-year warranty where applicable.

## Test Steps
1. Register a vehicle on the member site when no delivery date exists on record for that vehicle.
2. On the main site, add or update the delivery date for that same vehicle.
3. Open View Registered Vehicles, open details for that vehicle, and note delivery date and warranty period.
4. Compare those fields with the main site authoritative delivery date and applicable warranty rules.
5. Log in as a different user who has not registered this vehicle.
6. Ensure on the main site the vehicle already has a delivery date that supports two-year warranty per within-one-month-of-purchase rules.
7. Complete vehicle registration for that vehicle and note the success message about warranty (for example two-year warranty applied).
8. Open the registered vehicles list for that user and locate the vehicle.
9. Check delivery date and warranty period on the list row and in details if available.
10. Confirm they match the success message and main site data and are not blank.

## Expected Result
After main site delivery date update, registered vehicle details should show the same delivery date and correct warranty period as on the main site and should not leave those fields blank.
After the second user completes registration, the list and detail views should show non-blank delivery date and warranty period that should align with the registration success message and main site eligibility and should not contradict the success text.

---
