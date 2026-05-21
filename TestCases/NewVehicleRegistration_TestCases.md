# New Vehicle Registration Module – Test Cases

Application: Mobipark Member Site

Module: New Vehicle Registration

---

# Test Case ID – Test Case Description

## Feature

Feature


## Sub Feature

Sub Feature


## Preconditions

PreCondition


## Test Steps

Test steps


## Expected Result

Expected Result

---

# TC_001 – Verify authenticated member can open the New registration tab and see the Vehicle Identification Number search form

## Feature

New Vehicle Registration


## Sub Feature

Page Access


## Preconditions

-


## Test Steps

1. Navigate to the Login page
2. Sign in with valid credentials for an activated member account
3. Navigate to Vehicle registration
4. Select the New registration tab
5. Observe the New vehicle registration section


## Expected Result

The system should display the Vehicle identification number field, the Search control, and instructional text without errors

---

# TC_002 – Verify Search is blocked or shows validation when Vehicle identification number is empty

## Feature

New Vehicle Registration


## Sub Feature

VIN Validation


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Leave the Vehicle identification number field empty
3. Click Search


## Expected Result

The system should prevent a meaningless lookup or should show a clear required-field message and should not show a false vehicle match

---

# TC_003 – Verify vehicle lookup succeeds when the user enters the exact case-sensitive vehicle serial number

## Feature

New Vehicle Registration


## Sub Feature

Successful Lookup


## Preconditions

 A valid test vehicle serial number is available with documented exact casing


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Enter the exact vehicle serial number including correct letter casing as stored in the catalog
3. Click Search
4. Observe the area below the search form


## Expected Result

The system should invoke the lookup successfully and should display basic vehicle details and a Register button

---

# TC_004 – Verify vehicle lookup shows not found or invalid messaging when the serial does not exist in the catalog

## Feature

New Vehicle Registration


## Sub Feature

Lookup Failure


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Enter a serial number that is not present in the Mobipark catalog
3. Click Search


## Expected Result

The system should complete the search without crashing and should show that the vehicle was not found or is invalid

---

# TC_005 – Verify Search triggers a request to the Mobipark main site vehicle lookup API

## Feature

New Vehicle Registration


## Sub Feature

API Integration


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Open permitted network or instrumentation tools to observe outbound requests
3. Enter any serial and click Search
4. Observe request timing and endpoint behavior


## Expected Result

The system should issue a lookup request consistent with the Mobipark main site API and should handle normal responses without client errors

---

# TC_006 – Verify partial vehicle serial entry does not return the same successful match as the full exact serial

## Feature

New Vehicle Registration


## Sub Feature

Exact Match Rule


## Preconditions

 valid full serial number is documented for comparison


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Enter only a prefix substring of a known valid full serial number
3. Click Search
4. Compare outcome with a separate run using the full exact serial


## Expected Result

The system should not display the full vehicle details unless the entire exact serial is entered as required

---

# TC_007 – Verify leading or trailing spaces in the Vehicle identification number field are handled consistently with the exact-match rule

## Feature

New Vehicle Registration


## Sub Feature

Input Normalization


## Preconditions

A valid exact serial is documented for the trim or no-trim behavior being validated


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Paste or type a valid serial with leading spaces and trailing spaces
3. Click Search
4. Observe whether a match occurs


## Expected Result

The system should apply documented normalization or should require exact characters so behavior matches the specification

---

# TC_008 – Verify warranty eligibility shows two-year coverage messaging when purchase date is within one month of purchase

## Feature

New Vehicle Registration


## Sub Feature

Warranty Eligibility


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Search using a catalog serial for a vehicle whose purchase or delivery date is within one month per test data
3. Read warranty-related text on the result panel


## Expected Result

The system should indicate two-year warranty eligibility consistent with the business rule

---

# TC_009 – Verify warranty eligibility shows one-year coverage messaging when purchase date is more than one month old per rules

## Feature

New Vehicle Registration


## Sub Feature

Warranty Eligibility


## Preconditions

Test catalog data defines a vehicle beyond the one-month window


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Search using a catalog serial for a vehicle whose purchase or delivery date is beyond one month per test data
3. Read warranty-related text on the result panel


## Expected Result

The system should indicate one-year warranty eligibility consistent with the business rule

---

# TC_010 – Verify warranty classification at the boundary of one month from purchase date matches the product definition

## Feature

New Vehicle Registration


## Sub Feature

Warranty Boundary


## Preconditions

Product owners document inclusive or exclusive boundary behavior for the one-month rule


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Search using a catalog serial tied to a purchase date exactly on the one-month boundary per test environment configuration
3. Record which warranty tier is shown


## Expected Result

The system should assign one-year or two-year eligibility exactly as documented for the boundary date

---

# TC_011 – Verify basic vehicle details shown after a successful search match the API response fields

## Feature

New Vehicle Registration


## Sub Feature

Result Display


## Preconditions

nan


## Test Steps

1. On the New registration tab observe each field shown in the vehicle details panel below the search area
2. Compare each displayed attribute with the Mobipark API or fixture response for the serial used in TC_004


## Expected Result

The on-screen basic details should match the authoritative vehicle data returned by the lookup service

---

# TC_012 – Verify Register button is shown only after a successful valid vehicle lookup

## Feature

New Vehicle Registration


## Sub Feature

Register Control


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Observe whether a Register button is visible before any search
3. Run a failed search with an invalid serial and observe controls
4. Run a successful search and observe controls


## Expected Result

The system should show the Register button only in the successful lookup result state and not after failed or empty searches

---

# TC_013 – Verify clicking Register after a successful lookup advances the registration flow

## Feature

New Vehicle Registration


## Sub Feature

Registration Flow


## Preconditions

nan


## Test Steps

1. On the New registration tab with vehicle details and Register visible from the successful lookup click Register
2. Observe the next page or confirmation step


## Expected Result

The system should proceed to the next registration step or confirmation without losing the selected vehicle context

---

# TC_014 – Verify switching to the Registered vehicles tab and back retains the New registration form search result

## Feature

New Vehicle Registration


## Sub Feature

Tab Navigation


## Preconditions

nan


## Test Steps

1. Open Vehicle registration with the New registration tab active after a successful or failed search
2. Click the Registered vehicles tab
3. Click the New registration tab again
4. Observe field and result state


## Expected Result

The system should follow the documented tab behavior for preserving VIN and search results

---

# TC_015 – Verify Return to My Page navigates away from vehicle registration to the dashboard

## Feature

New Vehicle Registration


## Sub Feature

Navigation


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Click Return to My Page or equivalent back link
3. Observe the destination


## Expected Result

The system should navigate to the dashboard

---

# TC_016 – Verify Logout from the header ends the session and prevents further authenticated vehicle search

## Feature

New Vehicle Registration


## Sub Feature

Session Control


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Click Logout in the header
3. Attempt to open the new vehicle registration URL directly if known


## Expected Result

The system should end the session and should require sign-in before further protected actions

---

# TC_017 – Verify help text describing where to find the VIN is visible under the search field

## Feature

New Vehicle Registration


## Sub Feature

Help Content


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Read the helper text below the Vehicle identification number field


## Expected Result

The system should display the VIN location guidance consistent with the design copy

---

# TC_018 – Verify warranty extension callout text is visible on the new registration view

## Feature

New Vehicle Registration


## Sub Feature

Informational Content


## Preconditions

After TC_001.


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Read the highlighted warranty notice about one month and two-year extension


## Expected Result

The system should display the warranty callout text consistent with the product messaging

---

# TC_019 – Verify new vehicle registration page is not usable for vehicle lookup without authentication

## Feature

New Vehicle Registration


## Sub Feature

Access Control


## Preconditions

-


## Test Steps

1. Ensure no active session exists
2. Attempt to open the new vehicle registration route directly if known
3. Observe the response


## Expected Result

The system should block protected access and should not expose lookup functionality without sign-in

---

# TC_020 – Verify rapid double activation of Search does not corrupt UI state or duplicate critical side effects

## Feature

New Vehicle Registration


## Sub Feature

Submit Idempotency


## Preconditions

A valid serial is available for lookup


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Enter a valid serial number
3. Rapidly double-click Search
4. Observe loading indicators and final result panel


## Expected Result

The system should settle on a single consistent result state without duplicate critical errors

---

# TC_021 – Verify special characters-only or invalid pattern input does not return a false successful vehicle match

## Feature

New Vehicle Registration


## Sub Feature

VIN Validation


## Preconditions

After TC_001.


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Enter a string composed of special characters that is not a valid catalog serial
3. Click Search


## Expected Result

The system should reject or not-found the lookup and should not show vehicle details with a Register button

---

# TC_022 – Verify search for a serial already linked to the same member behaves according to product rules

## Feature

New Vehicle Registration


## Sub Feature

Duplicate Registration


## Preconditions

Test data includes a serial already on the member account


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Search for a serial number that is already registered to the signed-in member per test data
3. Observe messaging and Register availability


## Expected Result

The system should follow the documented re-register rule without data corruption

---

# TC_023 – Verify very long input in the VIN field respects maximum length or server validation without client crash

## Feature

New Vehicle Registration


## Sub Feature

Boundary


## Preconditions

After TC_001.


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Paste or type a string longer than typical VIN length if the field allows
3. Click Search


## Expected Result

The system should enforce length or validation rules gracefully and should not crash the page

---

# TC_024 – Verify post-search vehicle card displays brand model vehicle identification number delivery date and warranty period fields

## Feature

New Vehicle Registration


## Sub Feature

Review Screen Display


## Preconditions

nan


## Test Steps

1. Open Vehicle registration and select the New registration tab if not already there
2. Search for a valid catalog serial and wait for the vehicle review card
3. Read each labeled value on the card including warranty period


## Expected Result

The system should display brand, model, vehicle identification number, new car purchase or delivery date, and warranty period in alignment with the lookup data

---

# TC_025 – Verify Current owner and extended warranty badges on the review card match eligibility data from the catalog

## Feature

New Vehicle Registration


## Sub Feature

Status Badges


## Preconditions

 Test data documents whether the vehicle should qualify as current owner and extended warranty


## Test Steps

1. On the New registration tab after a successful search observe badges on the vehicle card such as Current owner and two-year warranty indicators
2. Compare badge presence with expected states from test data


## Expected Result

The system should show or hide badges consistently with the underlying registration and warranty eligibility

---

# TC_026 – Verify calculated warranty end date matches two calendar years after the delivery date when the extended two-year rule applies

## Feature

New Vehicle Registration


## Sub Feature

Warranty Calculation


## Preconditions

Delivery date and extension rule are documented for the test vehicle


## Test Steps

1. On the New registration tab after a successful search for a vehicle within the thirty-day extension window read delivery date and warranty period end date
2. Compute the expected end date as two years after the delivery date using the same calendar rules as the product


## Expected Result

The displayed warranty period end date should match the expected two-year end date for qualifying vehicles

---

# TC_027 – Verify green eligibility banner appears with a day count when the vehicle is still within the thirty-day extension window after delivery

## Feature

New Vehicle Registration


## Sub Feature

Eligibility Banner


## Preconditions

Test environment clock or date is known for the calculation


## Test Steps

1. On the New registration tab after a successful search for a qualifying vehicle locate the green eligibility banner
2. Read the message including how many days have passed since the delivery date
3. Independently calculate days elapsed from the delivery date to the current system date used by the app


## Expected Result

The day count in the banner should match the documented calculation and the message should state extended warranty eligibility

---

# TC_028 – Verify Register this vehicle action submits owner registration and navigates to the completion confirmation view

## Feature

New Vehicle Registration


## Sub Feature

Register This Vehicle


## Preconditions

The vehicle is eligible to be registered to the signed-in member under product rules


## Test Steps

1. On the New registration tab with a successful vehicle review displayed click the Register this vehicle primary button or equivalent labeled control
2. Wait for navigation or confirmation content
3. Observe URL or page title if shown


## Expected Result

The system should complete registration processing and should show a success confirmation state without a blocking error

---

# TC_029 – Verify registered vehicle summary on the confirmation page shows the correct vehicle name and serial for the vehicle just registered

## Feature

New Vehicle Registration


## Sub Feature

Confirmation Screen


## Preconditions

nan


## Test Steps

1. On the confirmation page read the vehicle name and registration or serial number in the summary panel
2. Compare with the vehicle that was confirmed on the review step before submit


## Expected Result

The summary should display the same vehicle identity as the registered vehicle and should match server records for the new registration

---

# TC_030 – Verify confirmation warranty panel states two-year manufacturer warranty applied when registration occurs within thirty days of delivery

## Feature

New Vehicle Registration


## Sub Feature

Confirmation Warranty


## Preconditions

The registered vehicle scenario is the within-thirty-day extension path


## Test Steps

1. Complete registration for a vehicle that qualifies under the thirty-day extension rule
2. On the confirmation page read the green warranty information panel


## Expected Result

The system should state that a two-year manufacturer warranty was applied and should mention registration within thirty days of delivery consistent with design copy

---

# TC_031 – Verify confirmation warranty messaging follows the standard or one-year path when registration occurs after thirty days from delivery

## Feature

New Vehicle Registration


## Sub Feature

Confirmation Warranty


## Preconditions

Test data defines an outside-window vehicle and registration is allowed


## Test Steps

1. Sign in and complete the new vehicle registration flow for a catalog vehicle whose delivery date makes registration fall outside the thirty-day extension window per test data
2. Reach the registration confirmation page
3. Read the warranty information panel or equivalent messaging


## Expected Result

The system should show warranty messaging consistent with the standard or one-year path and should not claim the two-year extension incorrectly

---

# TC_032 – Verify Go to Registered Vehicle List control from the confirmation page opens the registered vehicles list or tab

## Feature

New Vehicle Registration


## Sub Feature

Post-Confirmation Navigation


## Preconditions

nan


## Test Steps

1. On the confirmation page after a successful registration click the control that navigates to the registered vehicle list
2. Observe the destination route and list content


## Expected Result

The system should navigate to the registered vehicles view and should include the newly registered vehicle entry when the list loads

---

# TC_033 – Verify My page header link from the confirmation page navigates correctly while the session remains active

## Feature

New Vehicle Registration


## Sub Feature

Header Navigation


## Preconditions

nan


## Test Steps

1. On the confirmation page click My page in the global header
2. Observe the destination


## Expected Result

The system should open the My page destination associated with the header control

---

# TC_034 – Verify Enquiry header link from the confirmation page navigates correctly while the session remains active

## Feature

New Vehicle Registration


## Sub Feature

Header Navigation


## Preconditions

nan


## Test Steps

1. On the confirmation page click Enquiry in the global header
2. Observe the destination


## Expected Result

The system should open the enquiry destination associated with the header control

---

# TC_035 – Verify Logout from the confirmation page ends the session and prevents reuse of protected routes without signing in again

## Feature

New Vehicle Registration


## Sub Feature

Session Control


## Preconditions

nan


## Test Steps

1. On the confirmation page click Logout in the header
2. Attempt to reopen a protected vehicle registration URL without signing in


## Expected Result

The system should end the session and should require authentication before further protected access

---

# TC_036 – Verify editing VIN in main site does not create duplicate vehicle records in Registered Vehicles list

## Feature

Vehicle Registration


## Sub Feature

VIN Sync Data Integrity


## Preconditions

1. Main site user can edit VIN
2. Same physical vehicle is available as VIN_OLD before update


## Test Steps

1. Register a vehicle using VIN_OLD in member site
2. Edit the same vehicle VIN to VIN_NEW in main site
3. Search and register VIN_NEW in member site
4. Open Registered Vehicles list
5. Check number of records for that vehicle


## Expected Result

The system should show only one consolidated vehicle record in Registered Vehicles and should not create duplicate entries for VIN_OLD and VIN_NEW

---

# TC_037 – Verify VIN search with more than two special characters does not return HTTP 500

## Feature

Vehicle Registration


## Sub Feature

VIN API Validation


## Preconditions

 A valid stored VIN with more than two special characters exists in main site


## Test Steps

1. Open Vehicle Registration search
2. Enter a VIN that exists in main site and contains more than two special characters
3. Click Search
4. Capture API status and response


## Expected Result

The API should not return HTTP 500 and should return vehicle data or a controlled client validation response

---

# TC_038 – Verify Vehicle registration is successful for all seriel number cases

## Feature

Vehicle Registration


## Sub Feature

Serial Number Limit Enforcement


## Preconditions

User account has already reached configured serial limit


## Test Steps

1. Prepare user account at maximum allowed serial registration limit
2. Open Vehicle Registration
3. Search a new serial number
4. Submit registration
5. Check API response and Registered Vehicles list


## Expected Result

Vehicle resgistration should be successful

---

# TC_039 – Verify one-year warranty label is shown for eligible vehicle without delivery date

## Feature

Vehicle Registration


## Sub Feature

Warranty Label Display


## Preconditions

Eligible vehicle without delivery date exists


## Test Steps

1. Open Vehicle Registration search
2. Search a vehicle with no delivery date that is eligible for one-year warranty by business rule
3. Observe search result warranty label


## Expected Result

The result should display one-year warranty applicable label clearly

---

# TC_040 – Verify VIN with spaces saved on main site is searchable in registration

## Feature

Vehicle Registration


## Sub Feature

VIN Format Consistency


## Preconditions

Main site allows and stores VIN with spaces


## Test Steps

1. Save or confirm a vehicle VIN with spaces on main site
2. Open Vehicle Registration search
3. Enter same VIN including spaces
4. Click Search
5. Observe search result


## Expected Result

The search should accept equivalent stored VIN format and should return the matching vehicle

---

# TC_041 – Verify warranty block styling is visually consistent on registration success screen for one-year and two-year manufacturer warranty

## Feature

Vehicle Registration


## Sub Feature

Registration Success – Warranty Styling


## Preconditions

Valid vehicle and user data; registration configurations available for one-year and two-year manufacturer warranty


## Test Steps

1. Complete vehicle registration with a configuration that results in one-year manufacturer warranty
2. On the registration complete success screen observe the warranty section heading body text and background/border styling
3. Complete vehicle registration again with a configuration that results in two-year manufacturer warranty
4. On the registration complete success screen observe the same warranty section styling
5. Compare both success screens


## Expected Result

Warranty messaging on the success screen should be visually consistent for one-year and two-year outcomes; if design specifies a green success/highlight treatment for warranty confirmation both flows should use it

---

# TC_042 – Verify VIN field UI and API behavior are consistent when editing a Wholesale Status record on Main Site

## Feature

Main Site


## Sub Feature

Wholesale Status – VIN Edit


## Preconditions

Record exists in Wholesale Status; user has access to edit records on Main Site


## Test Steps

1. Navigate to the Main Site
2. Open a record that is already in Wholesale Status
3. Attempt to edit the VIN value
4. Save/Update the changes
5. Observe the API response and UI behavior (field state and any error message)


## Expected Result

VIN field should either be non-editable/disabled for Wholesale Status records or allow successful update if editing is permitted; UI behavior and API validation should be consistent

---

# TC_043 – Verify main section titles and subtitles are not incorrectly bold in Safari on Mac

## Feature

UI Cross-Browser


## Sub Feature

Safari – Typography


## Preconditions

Mac device; Safari browser; pages with main and subsection titles available


## Test Steps

1. On Mac open the application in Safari browser
2. Navigate to pages with main section titles and subsection titles
3. Observe font weight and readability of titles and subtitles


## Expected Result

Main section titles and subsection titles should match design font weight and should not appear incorrectly bold causing readability issues in Safari

---

# TC_044 – Verify header layout is not broken on vehicle registration and enquiry pages on iPad

## Feature

UI Responsive


## Sub Feature

iPad – Header Layout


## Preconditions

iPad device or iPad viewport; vehicle registration and enquiry pages accessible


## Test Steps

1. On iPad open the application
2. Navigate to the vehicle registration page and observe the header layout
3. Navigate to the enquiry page and observe the header layout
4. Scroll and interact on each page while observing the header


## Expected Result

The header should render correctly without broken layout overlap or misalignment on vehicle registration and enquiry pages
Brand number does not show unintended underline in search results and list on iPad

---
