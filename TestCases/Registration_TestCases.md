# Registration Module – Test Cases

Application: Mobipark Member Site  
Module: Registration  
Generated From: Registration Sheet Test Cases  

---

# TC_001 – Verify successful registration when all required fields meet validation rules

## Feature
Registration

## Sub Feature
Submit Success

## Preconditions
1. The email address is not already registered
2. Test data complies with all field maximum lengths

## Test Steps
1. Navigate to the New Member Registration page
2. Enter valid values in First Name and Last Name within 25 characters each
3. Select a Gender option
4. Select a complete valid Date of birth using Year, Month, and Day dropdowns
5. Enter a syntactically valid unique Email Address
6. Enter a Telephone Number within 20 characters
7. Enter Postal Code, Prefecture, Municipality, Street Address, and Building name within their maximum lengths
8. Enter a Password that is at least 8 characters and includes lowercase and uppercase English letters
9. Re-enter the same value in Confirm Password
10. Select agreement to Terms of Service and Privacy Policy if the checkbox is shown
11. Click Register as a member

## Expected Result
The system should accept registration and should indicate that an activation link will be sent to the registered email address

---

# TC_002 – Verify activation email is delivered to the registered email address after successful registration

## Feature
Registration

## Sub Feature
Activation Email

## Preconditions
None

## Test Steps
1. Open the mailbox for the email address used in registration
2. Locate the most recent registration or activation message from the application
3. Open the message and inspect its content

## Expected Result
The system should send an email to the registered address and the email should contain an activation link

---

# TC_003 – Verify account activation succeeds when the user opens the activation link within 7 days

## Feature
Registration

## Sub Feature
Activation Link

## Preconditions
None

## Test Steps
1. Open the activation link from the registration email in a browser
2. Wait for the activation confirmation page or message to load
3. Observe the stated account status

## Expected Result
The system should mark the account as activated and should show a clear success confirmation for activation

---

# TC_004 – Verify activated user can log in with registered email and password

## Feature
Registration

## Sub Feature
Post-Activation Login

## Preconditions
None

## Test Steps
1. Navigate to the Login page
2. Enter the registered Email Address used in registration
3. Enter the Password set during registration
4. Click Log in

## Expected Result
The system should authenticate the user successfully after activation

---

# TC_005 – Verify login is blocked or shows pending-activation state before the activation link is used

## Feature
Registration

## Sub Feature
Pre-Activation Login

## Preconditions
The activation link from the email has not been opened yet

## Test Steps
1. Navigate to the Login page
2. Enter the same Email Address and Password submitted at registration
3. Click Log in

## Expected Result
The system should not grant login and should show error message

---

# TC_006 – Verify activation fails or shows expiry messaging when the activation link is used after 7 days

## Feature
Registration

## Sub Feature
Activation Expiry

## Preconditions
None

## Test Steps
1. Obtain or simulate an activation URL that is older than 7 days per test environment controls
2. Open that activation URL in a browser
3. Observe the response

## Expected Result
The system should not activate the account and should show an appropriate expired or invalid link message

---

# TC_007 – Verify registration is blocked when First Name is empty

## Feature
Registration

## Sub Feature
First Name Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave First Name empty
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that First Name is required

---

# TC_008 – Verify registration is blocked when Last Name is empty

## Feature
Registration

## Sub Feature
Last Name Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Last Name empty
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that Last Name is required

---

# TC_009 – Verify First Name cannot exceed 25 characters

## Feature
Registration

## Sub Feature
First Name Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a First Name longer than 25 characters
3. Fill remaining fields with otherwise valid data
4. Attempt to continue entry and submit

## Expected Result
The system should enforce the 25-character maximum for First Name and should prevent valid submission until within the limit

---

# TC_010 – Verify Last Name cannot exceed 25 characters

## Feature
Registration

## Sub Feature
Last Name Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a Last Name longer than 25 characters
3. Fill remaining fields with otherwise valid data
4. Attempt to continue entry and submit

## Expected Result
The system should enforce the 25-character maximum for Last Name and should prevent valid submission until within the limit

---

# TC_011 – Verify registration accepts First Name at exactly 25 characters when all other fields are valid

## Feature
Registration

## Sub Feature
First Name Boundary

## Preconditions
1. A unique valid email is prepared for the attempt

## Test Steps
1. Navigate to the New Member Registration page
2. Enter exactly 25 characters in First Name
3. Complete all other fields with valid values including password rules
4. Click Register as a member

## Expected Result
The system should accept the First Name length and should complete registration per the success rules

---

# TC_012 – Verify registration accepts Last Name at exactly 25 characters when all other fields are valid

## Feature
Registration

## Sub Feature
Last Name Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter exactly 25 characters in Last Name
3. Complete all other fields with valid values including password rules
4. Click Register as a member

## Expected Result
The system should accept the Last Name length and should complete registration per the success rules

---

# TC_013 – Verify registration is blocked when no Gender option is selected

## Feature
Registration

## Sub Feature
Gender Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave all Gender radio buttons unselected
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should require a Gender selection

---

# TC_014 – Verify registration is blocked when Date of birth is incomplete

## Feature
Registration

## Sub Feature
Date of Birth Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave one of Year, Month, or Day unselected while leaving the others selected if applicable
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that Date of birth is required or incomplete

---

# TC_015 – Verify registration is blocked when Email Address is empty

## Feature
Registration

## Sub Feature
Email Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Email Address empty
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that Email Address is required

---

# TC_016 – Verify registration is blocked when Email Address format is invalid

## Feature
Registration

## Sub Feature
Email Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a value that is not a valid email format in Email Address
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that the Email Address format is invalid

---

# TC_017 – Verify registration is rejected when Email Address is already registered

## Feature
Registration

## Sub Feature
Duplicate Email

## Preconditions
1. A user account already exists with the chosen email address

## Test Steps
1. Navigate to the New Member Registration page
2. Enter an email address that already exists in the system for an active or registered user
3. Fill all other fields with valid values
4. Click Register as a member

## Expected Result
The system should reject registration and should show a clear message that the email cannot be used

---

# TC_018 – Verify registration is blocked when Telephone Number is empty

## Feature
Registration

## Sub Feature
Telephone Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Telephone Number empty
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that Telephone Number is required

---

# TC_019 – Verify Telephone Number cannot exceed 20 characters

## Feature
Registration

## Sub Feature
Telephone Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a Telephone Number longer than 20 characters
3. Fill remaining fields with valid values
4. Attempt submit

## Expected Result
The system should enforce the 20-character maximum for Telephone Number

---

# TC_020 – Verify registration accepts Telephone Number at exactly 20 characters when valid

## Feature
Registration

## Sub Feature
Telephone Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter exactly 20 characters in Telephone Number
3. Complete all other fields with valid values
4. Click Register as a member

## Expected Result
The system should accept the telephone length and should complete registration per the success rules

---

# TC_021 – Verify Postal Code cannot exceed 50 characters

## Feature
Registration

## Sub Feature
Postal Code Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a Postal Code longer than 50 characters
3. Fill remaining fields with valid values
4. Attempt submit

## Expected Result
The system should enforce the 50-character maximum for Postal Code

---

# TC_022 – Verify Municipality cannot exceed 50 characters

## Feature
Registration

## Sub Feature
Municipality Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a Municipality value longer than 50 characters
3. Fill remaining fields with valid values
4. Attempt submit

## Expected Result
The system should enforce the 50-character maximum for Municipality

---

# TC_023 – Verify Street Address cannot exceed 255 characters

## Feature
Registration

## Sub Feature
Street Address Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a Street Address longer than 255 characters
3. Fill remaining fields with valid values
4. Attempt submit

## Expected Result
The system should enforce the 255-character maximum for Street Address

---

# TC_024 – Verify Building name cannot exceed 50 characters

## Feature
Registration

## Sub Feature
Building Name Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a Building name longer than 50 characters
3. Fill remaining fields with valid values
4. Attempt submit

## Expected Result
The system should enforce the 50-character maximum for Building name

---

# TC_025 – Verify no Gender option is selected by default when the user first opens the New Member Registration page

## Feature
Registration

## Sub Feature
Gender Default

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page with a fresh load or hard refresh
2. Before clicking any radio control observe the Gender group
3. Confirm whether any Male Female Others or Do not answer option appears selected

## Expected Result
The system should not have any Gender radio pre-selected unless product documentation explicitly requires a default

---

# TC_026 – Verify user cannot access authenticated pages by URL manipulation

## Feature
Registration

## Sub Feature
URL Security

## Preconditions
User is not logged in

## Test Steps
1. Copy the URL of a the dashboard
2. Open a new browser session or logout
3. Paste and navigate to the copied URL

## Expected Result
The user should not be allowed to access the page and should be redirected to the login page or shown an unauthorized access message

---

# TC_027 – Verify Date of Birth does not allow selection of a year that makes the user under 16

## Feature
Registration

## Sub Feature
Date of Birth Boundary

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Open the Year dropdown in Date of Birth
3. Check the latest selectable year
4. Select the latest year with month and day

## Expected Result
The most recent selectable birth year should not allow completing registration as under sixteen for example the latest year should align with policy such as two thousand ten or earlier when evaluation date requires it

---

# TC_028 – Verify Telephone Number accepts a standard Japanese domestic format without international country code

## Feature
Registration

## Sub Feature
Telephone Format

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a valid Japanese domestic-style number without plus eight one prefix within the twenty-character limit such as zero nine zero hyphen digits pattern
3. Fill other required fields with valid data and submit or trigger field validation

## Expected Result
The system should accept the domestic format without forcing an error for missing country code

---

# TC_029 – Verify Telephone Number accepts Japanese numbers entered with international country code plus eight one

## Feature
Registration

## Sub Feature
Telephone Format

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter the same logical Japanese mobile or landline number prefixed with plus eight one and spacing or hyphens as the UI allows within the character limit
3. Fill other required fields with valid data and submit or trigger validation

## Expected Result
The system should accept the number with country code equivalently to the domestic form

---

# TC_030 – Verify Postal Code mandatory behaviour

## Feature
Registration

## Sub Feature
Postal Code Mandatory

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Postal Code empty while filling other address fields as applicable
3. Submit registration

## Expected Result
The system should prevent submission and should indicate Postal Code is required

---

# TC_031 – Verify Municipality field mandatory behaviour

## Feature
Registration

## Sub Feature
Municipality Mandatory

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Municipality empty while filling other fields as valid
3. Submit registration

## Expected Result
The system should prevent submission and should indicate Municipality is required

---

# TC_032 – Verify Street Address mandatory behaviour

## Feature
Registration

## Sub Feature
Street Address Mandatory

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Street Address empty while filling other fields as valid
3. Submit registration

## Expected Result
The system should prevent submission and should indicate Street Address is required

---

# TC_033 – Verify registration is blocked when Prefecture is left unselected at the empty default

## Feature
Registration

## Sub Feature
Prefecture Mandatory

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Prefecture at the placeholder or empty selection
3. Fill other required fields with valid values
4. Submit registration

## Expected Result
The system should prevent submission and should indicate that Prefecture must be selected

---

# TC_034 – Verify Read address or postal lookup fills Prefecture Municipality and Street when a valid postal code is entered and the control is activated

## Feature
Registration

## Sub Feature
Postal Auto Fill

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a valid Japanese postal code format supported by the lookup service
3. Click Read address next to Postal Code
4. Observe Prefecture Municipality and Street Address fields

## Expected Result
Prefecture Municipality and Street Address should populate automatically from the lookup when the postal code is valid

---

# TC_035 – Verify postal lookup does not overwrite valid manual entries incorrectly when user edits fields after lookup

## Feature
Registration

## Sub Feature
Postal Auto Fill

## Preconditions
None

## Test Steps
1. Enter valid postal code and trigger Read address so fields fill
2. Manually adjust one line of the address
3. Submit registration

## Expected Result
The system should retain user edits unless another lookup is triggered per design

---

# TC_036 – Verify postal lookup shows an error and leaves fields empty when an invalid or unknown postal code is submitted to lookup

## Feature
Registration

## Sub Feature
Postal Auto Fill

## Preconditions
Invalid sample codes are agreed

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a malformed or non-existent postal code for the lookup service
3. Click Read address
4. Observe messages and field states

## Expected Result
The system should show lookup failure messaging and should not fabricate address data

---

# TC_037 – Verify registration succeeds when names and address use Japanese scripts (hiragana katakana kanji)

## Feature
Registration

## Sub Feature
Unicode Japanese

## Preconditions
None

## Test Steps
1. Open New Member Registration
2. Enter First Name in hiragana and Last Name in katakana (max 25 characters each)
3. Fill Gender Date of birth Email Telephone and a password that meets all rules
4. Add kanji or Japanese punctuation in address fields where used (stay within max lengths)
5. Accept terms and submit

## Expected Result
The system should save Japanese text correctly and registration should complete

---

# TC_038 – Verify each password rule shows its own error when only that rule fails

## Feature
Registration

## Sub Feature
Password Rule Messaging

## Preconditions
None

## Test Steps
1. Open registration and fill all non-password fields with valid data
2. Enter a password that fails length only — check messages or checklist
3. Repeat separately: fails lowercase only; uppercase only; digit only; special character only if required

## Expected Result
The system should indicate exactly which rule failed each time and should block submit until every rule passes

---

# TC_039 – Verify registration blocks password with no digit when a digit is required

## Feature
Registration

## Sub Feature
Password Policy Numeric

## Preconditions
None

## Test Steps
1. Open New Member Registration
2. Enter a password with letters (and symbols if allowed) but no digits 0–9
3. Enter the same value in Confirm password
4. Submit

## Expected Result
The system should block submit and should state that a digit is required

---

# TC_040 – Verify registration blocks password with no special character when that rule applies

## Feature
Registration

## Sub Feature
Password Policy Special Character

## Preconditions
None

## Test Steps
1. Open New Member Registration
2. Enter a password that meets length letters upper lower and digit but has no required special character
3. Match Confirm password
4. Submit

## Expected Result
The system should block submit and should state the special-character requirement

---

# TC_041 – Verify registration is blocked when Password is shorter than 8 characters

## Feature
Registration

## Sub Feature
Password Rules

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a password with 7 characters that otherwise contains lowercase and uppercase English letters
3. Match Confirm Password to the same value
4. Fill all other required fields with valid values
5. Click Register as a member

## Expected Result
The system should prevent submission and should indicate the minimum length rule for Password

---

# TC_042 – Verify registration is blocked when Password has no uppercase English letter

## Feature
Registration

## Sub Feature
Password Rules

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a password with 8 or more characters containing only lowercase English letters and digits if used
3. Match Confirm Password
4. Fill all other required fields with valid values
5. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that an uppercase English letter is required

---

# TC_043 – Verify registration is blocked when Password has no lowercase English letter

## Feature
Registration

## Sub Feature
Password Rules

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a password with 8 or more characters containing only uppercase English letters and digits if used
3. Match Confirm Password
4. Fill all other required fields with valid values
5. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that a lowercase English letter is required

---

# TC_044 – Verify registration is blocked when Confirm Password is empty

## Feature
Registration

## Sub Feature
Confirm Password Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a valid Password meeting all password rules
3. Leave Confirm Password empty
4. Fill all other required fields with valid values
5. Click Register as a member

## Expected Result
The system should prevent submission and should require Confirm Password

---

# TC_045 – Verify registration is blocked when Confirm Password does not match Password

## Feature
Registration

## Sub Feature
Confirm Password Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter a valid Password meeting all password rules
3. Enter a different value in Confirm Password
4. Fill all other required fields with valid values
5. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that Confirm Password must match Password

---

# TC_046 – Verify Confirm password fails if it matches Password except for letter case

## Feature
Registration

## Sub Feature
Confirm Password Case Sensitivity

## Preconditions
Confirm comparison is case-sensitive (review TC 029)

## Test Steps
1. Open New Member Registration
2. Complete mandatory fields with valid data
3. Type Password with mixed upper and lower case per rules
4. In Confirm password type the same characters but change only letter case (keep digits and symbols the same)
5. Submit

## Expected Result
The system should show passwords do not match and should not complete registration

---

# TC_047 – Verify registration is blocked when agreement to Terms of Service and Privacy Policy is not checked

## Feature
Registration

## Sub Feature
Terms Acceptance

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Fill all required fields with valid values
3. Leave the Terms and Privacy agreement checkbox unchecked if present
4. Click Register as a member

## Expected Result
The system should prevent submission and should require agreement before registration

---

# TC_048 – Verify Prefecture selection is required when the dropdown is left at the default empty state

## Feature
Registration

## Sub Feature
Prefecture Validation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Leave Prefecture unselected at the placeholder or empty default
3. Fill all other required fields with valid values
4. Click Register as a member

## Expected Result
The system should prevent submission and should indicate that Prefecture must be selected

---

# TC_049 – Verify Password field masks input by default

## Feature
Registration

## Sub Feature
Password Masking

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter characters into the Password field
3. Observe the displayed characters

## Expected Result
The system should mask Password input by default

---

# TC_050 – Verify show or hide password control toggles visibility for the Password field

## Feature
Registration

## Sub Feature
Password Visibility

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter text in the Password field
3. Use the show or hide password control beside the field
4. Observe plain text versus masked display

## Expected Result
The system should toggle Password visibility correctly without losing entered characters

---

# TC_051 – Verify show or hide password control toggles visibility for the Confirm Password field

## Feature
Registration

## Sub Feature
Password Visibility

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter text in the Confirm Password field
3. Use the show or hide password control beside the field
4. Observe plain text versus masked display

## Expected Result
The system should toggle Confirm Password visibility correctly without losing entered characters

---

# TC_052 – Verify password rule indicators reflect compliance with length and letter-case requirements

## Feature
Registration

## Sub Feature
Password Rule Indicators

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Enter progressively stronger passwords into the Password field
3. Observe any checklist or inline indicators for minimum length and letter cases

## Expected Result
The system should update rule indicators so the user can see which password requirements are met or not met

---

# TC_053 – Verify Terms of Service link opens the correct policy content

## Feature
Registration

## Sub Feature
Legal Links

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Click the Terms of Service hyperlink in the agreement text
3. Observe the destination page or document

## Expected Result
The system should open the Terms of Service content in the expected manner without errors

---

# TC_054 – Verify Privacy Policy link opens the correct policy content

## Feature
Registration

## Sub Feature
Legal Links

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Click the Privacy Policy hyperlink in the agreement text
3. Observe the destination page or document

## Expected Result
The system should open the Privacy Policy content in the expected manner without errors

---

# TC_055 – Verify existing member login link navigates to the Login page

## Feature
Registration

## Sub Feature
Navigation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Click the control or link that directs existing members to log in
3. Observe the destination page

## Expected Result
The system should navigate to the Login page or equivalent sign-in route

---

# TC_056 – Verify header Login here link navigates to the Login page when present

## Feature
Registration

## Sub Feature
Navigation

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Click Login here in the header area if shown
3. Observe the destination page

## Expected Result
The system should navigate to the Login page without errors

---

# TC_057 – Verify registration form fields expose accessible names for assistive technologies

## Feature
Registration

## Sub Feature
Accessibility

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Inspect programmatic labels or accessible names for First Name, Last Name, Email Address, Password, and Confirm Password

## Expected Result
The system should associate each control with an understandable accessible name

---

# TC_058 – Verify Register as a member can be triggered from the keyboard when focused

## Feature
Registration

## Sub Feature
Keyboard Access

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Fill all required fields with valid values
3. Move keyboard focus to the Register as a member button
4. Press Enter or Space as appropriate

## Expected Result
The system should submit registration the same as a mouse click when activation via keyboard is supported

---

# TC_059 – Verify rapid repeated clicks on Register as a member do not create duplicate accounts

## Feature
Registration

## Sub Feature
Submit Idempotency

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Fill all required fields with valid unique data
3. Rapidly double-click or triple-click Register as a member
4. Search or verify account records for the email used

## Expected Result
The system should create at most one account for the email and should behave deterministically

---

# TC_060 – Verify registration completes within acceptable response time under normal conditions

## Feature
Registration

## Sub Feature
Performance

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Fill all required fields with valid values
3. Start a timer before clicking Register as a member
4. Stop the timer when a definitive success or validation response is shown

## Expected Result
The submission should complete within an acceptable time window without indefinite hang

---

# TC_061 – Verify Japanese characters in First and Last Name within limits are accepted when policy allows

## Feature
Registration

## Sub Feature
Unicode Names

## Preconditions
None

## Test Steps
1. Navigate to the New Member Registration page
2. Enter Japanese characters in First Name and Last Name within 25 characters each
3. Complete remaining fields with valid values including a unique email
4. Click Register as a member

## Expected Result
The system should accept the characters without corruption and should register successfully

---

# TC_062 – Verify Street Address accepts a long valid string up to the 255-character maximum

## Feature
Registration

## Sub Feature
Street Address Boundary

## Preconditions
A unique valid email is prepared for the attempt

## Test Steps
1. Navigate to the New Member Registration page
2. Enter exactly 255 characters in Street Address using allowed characters
3. Complete all other fields with valid values
4. Click Register as a member

## Expected Result
The system should accept the maximum length and should complete registration per the success rules

---

# TC_063 – Verify activation link in email references a token or path that is unique and not guessable from another user pattern

## Feature
Registration

## Sub Feature
Token Security

## Preconditions
Two distinct mailboxes or capture methods are available

## Test Steps
1. Complete registration for user A with email A
2. Complete registration for user B with email B
3. Compare activation URLs or tokens from both emails

## Expected Result
The system should issue distinct activation links and should not trivially expose predictable tokens

---

# TC_064 – Verify Email Address helper text indicates it will be used as the login ID when shown

## Feature
Registration

## Sub Feature
Helper Text

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Locate helper text near the Email Address field

## Expected Result
The system should display guidance that the email will be used as the login identifier when that helper is part of the design

---

# TC_065 – Verify pasted Password and Confirm Password values respect masking and max length rules

## Feature
Registration

## Sub Feature
Password Entry

## Preconditions
-

## Test Steps
1. Navigate to the New Member Registration page
2. Paste a compliant password into Password from the clipboard
3. Paste the same value into Confirm Password
4. Observe masking and any length enforcement

## Expected Result
The system should accept pasted values within rules and should mask by default

---

# TC_066 – Verify password limit validation message is displayed in UI when password exceeds allowed length

## Feature
Registration

## Sub Feature
Password Validation

## Preconditions
-

## Test Steps
1. Open the Registration page.
2. Enter a password longer than the allowed limit.
3. Fill all other mandatory fields with valid values.
4. Submit the registration form.
5. Check the password field area for validation message.
6. Check API response for the same validation.

## Expected Result
The UI should display a clear password limit validation message and it should match the API validation reason.

---

# TC_067 – Verify age restriction validation message is shown in UI when user age is 16 or below

## Feature
Registration

## Sub Feature
Age Validation

## Preconditions
-

## Test Steps
1. Open the Registration page.
2. Enter date of birth that makes the user age 16 or below.
3. Fill all other mandatory fields with valid values.
4. Submit the registration form.
5. Check the UI for age validation message.

## Expected Result
The UI should show an age restriction validation message and should prevent registration submission for age 16 or below.

---

# TC_068 – Verify postal code acceptance with hyphen for address fetching

## Feature
Registration

## Sub Feature
Postal code

## Preconditions
None

## Test Steps
1. Navigate to the Registration page.
2. Enter a valid postal code with hyphen (e.g., 150-0002).
3. Click on Read Address.
4. Observe the behaviour and any validation/error message.
5. Compare with the same action on the main site.

## Expected Result
System should accept valid postal codes with hyphen
Address should be fetched and populated correctly.

---
