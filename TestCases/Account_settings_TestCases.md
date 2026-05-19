# Account Settings Module – Test Cases

Application: Mobipark Member Site  
Module: Account Settings  
Generated From: Account Settings Sheet Test Cases  

---

# TC_001 – Verify authenticated member can open the Account Settings page and view member sections

## Feature
Account Settings

## Sub Feature
Page Access

## Preconditions
-

## Test Steps
1. Navigate to the Login page
2. Sign in with valid credentials for an activated member account
3. Navigate to Account Settings using the menu or direct route
4. Observe Member Information and Other information sections

## Expected Result
The system should display Account Settings with membership fields with edit button

---

# TC_002 – Verify membership number is displayed and cannot be edited in Other information

## Feature
Account Settings

## Sub Feature
Read-Only Membership Fields

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Locate Membership number in Other information
3. Attempt to place focus in the value and type or use browser dev tools to confirm non-editable controls

## Expected Result
The system should display the membership number and the value should not be user-editable

---

# TC_003 – Verify membership registration date is displayed and cannot be edited in Other information

## Feature
Account Settings

## Sub Feature
Read-Only Membership Fields

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Locate Membership registration date in Other information
3. Attempt to edit the displayed date value

## Expected Result
The system should display the registration date and the value should not be user-editable

---

# TC_004 – Verify membership number and registration date values match the authoritative member record

## Feature
Account Settings

## Sub Feature
Data Integrity

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Read Membership number and Membership registration date from Other information
3. Compare with the member profile source using permitted tools

## Expected Result
The displayed membership number and registration date should match the server record

---

# TC_005 – Verify submission or save is blocked when First Name is empty

## Feature
Account Settings

## Sub Feature
First Name Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode if the page uses an Edit control before changing fields
3. Clear First Name while keeping other fields valid
4. Trigger Submit or Save

## Expected Result
The system should prevent save and should indicate that First Name is required

---

# TC_006 – Verify submission or save is blocked when Last Name is empty

## Feature
Account Settings

## Sub Feature
Last Name Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Clear Last Name while keeping other fields valid
4. Trigger Submit or Save

## Expected Result
The system should prevent save and should indicate that Last Name is required

---

# TC_007 – Verify First Name cannot exceed 25 characters

## Feature
Account Settings

## Sub Feature
First Name Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter a First Name longer than 25 characters
4. Observe field enforcement and attempt save

## Expected Result
The system should enforce the 25-character maximum for First Name

---

# TC_008 – Verify Last Name cannot exceed 25 characters

## Feature
Account Settings

## Sub Feature
Last Name Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter a Last Name longer than 25 characters
4. Observe field enforcement and attempt save

## Expected Result
The system should enforce the 25-character maximum for Last Name

---

# TC_009 – Verify save accepts First Name at exactly 24 characters when all other fields are valid

## Feature
Account Settings

## Sub Feature
First Name Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Set First Name to exactly 24 allowed characters and keep remaining fields valid
4. Trigger Submit or Save

## Expected Result
The system should accept the First Name length and should complete save per success rules

---

# TC_010 – Verify save accepts First Name at exactly 25 characters when all other fields are valid

## Feature
Account Settings

## Sub Feature
First Name Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Set First Name to exactly 25 allowed characters and keep remaining fields valid
4. Trigger Submit or Save

## Expected Result
The system should accept the First Name length and should complete save per success rules

---

# TC_011 – Verify save accepts Last Name at exactly 24 characters when all other fields are valid

## Feature
Account Settings

## Sub Feature
Last Name Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Set Last Name to exactly 24 allowed characters and keep remaining fields valid
4. Trigger Submit or Save

## Expected Result
The system should accept the Last Name length and should complete save per success rules

---

# TC_012 – Verify save accepts Last Name at exactly 25 characters when all other fields are valid

## Feature
Account Settings

## Sub Feature
Last Name Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Set Last Name to exactly 25 allowed characters and keep remaining fields valid
4. Trigger Submit or Save

## Expected Result
The system should accept the Last Name length and should complete save per success rules

---

# TC_013 – Verify submission or save is blocked when no Gender option is selected

## Feature
Account Settings

## Sub Feature
Gender Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Clear all Gender radio selections if the UI allows clearing
4. Trigger Submit or Save

## Expected Result
The system should prevent save and should require a Gender selection

---

# TC_014 – Verify submission or save is blocked when Date of birth is incomplete

## Feature
Account Settings

## Sub Feature
Date of Birth Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Leave one of Year, Month, or Day unselected while the form otherwise validates
4. Trigger Submit or Save

## Expected Result
The system should prevent save and should indicate that Date of birth is required or incomplete

---

# TC_015 – Verify Email address cannot be edited

## Feature
Account Settings

## Sub Feature
Email Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Clear Email Address
4. Trigger Submit or Save

## Expected Result
Email address should not be editable field

---

# TC_016 – Verify submission or save is blocked when Telephone Number is empty

## Feature
Account Settings

## Sub Feature
Telephone Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Clear Telephone Number
4. Trigger Submit or Save

## Expected Result
The system should prevent save and should indicate that Telephone Number is required

---

# TC_017 – Verify save accepts Telephone number at exactly 19 characters when all other fields are valid

## Feature
Account Settings

## Sub Feature
Telephone Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Set Telephone number to exactly 19 allowed characters and keep remaining fields valid
4. Trigger Submit or Save

## Expected Result
The system should accept the Telephone number length and should complete save per success rules

---

# TC_018 – Verify Telephone Number cannot exceed 20 characters

## Feature
Account Settings

## Sub Feature
Telephone Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter a Telephone Number longer than 20 characters
4. Observe enforcement and attempt save

## Expected Result
The system should enforce the 20-character maximum for Telephone Number

---

# TC_019 – Verify save accepts Postal code at exactly 49 characters when all other fields are valid

## Feature
Account Settings

## Sub Feature
Telephone Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Set Postal Code to exactly 49 allowed characters and keep remaining fields valid
4. Trigger Submit or Save

## Expected Result
The system should accept the Postal code length and should complete save per success rules

---

# TC_020 – Verify Postal Code cannot exceed 50 characters

## Feature
Account Settings

## Sub Feature
Postal Code Boundary

## Preconditions
 A string longer than 50 characters is available for entry or paste

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter a Postal Code longer than 50 characters
4. Observe enforcement and attempt save

## Expected Result
The system should enforce the 50-character maximum for Postal Code

---

# TC_021 – Verify Municipality cannot exceed 50 characters

## Feature
Account Settings

## Sub Feature
Municipality Boundary

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter a Municipality value longer than 50 characters
4. Observe enforcement and attempt save

## Expected Result
The system should enforce the 50-character maximum for Municipality

---

# TC_022 – Verify Street Address cannot exceed 255 characters

## Feature
Account Settings

## Sub Feature
Street Address Boundary

## Preconditions
 A string longer than 255 characters is available for entry or paste

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter a Street Address longer than 255 characters
4. Observe enforcement and attempt save

## Expected Result
The system should enforce the 255-character maximum for Street Address

---

# TC_023 – Verify Building name cannot exceed 50 characters

## Feature
Account Settings

## Sub Feature
Building Name Boundary

## Preconditions
A string longer than 50 characters is available for entry or paste

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter a Building name longer than 50 characters
4. Observe enforcement and attempt save

## Expected Result
The system should enforce the 50-character maximum for Building name

---

# TC_024 – Verify Prefecture must be selected when the dropdown is left at empty default on save

## Feature
Account Settings

## Sub Feature
Prefecture Validation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode
3. Set Prefecture to the empty placeholder if selectable
4. Trigger Submit or Save

## Expected Result
The system should prevent save and should indicate that Prefecture must be selected

---

# TC_025 – Verify successful save updates editable profile fields when all validations pass

## Feature
Account Settings

## Sub Feature
Submit Success

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter valid values for all editable fields within maximum lengths
4. Trigger Submit or Save
5. Observe confirmation and reload or re-open settings to verify persistence

## Expected Result
The system should save changes and persisted values should match the submitted data for editable fields only

---

# TC_026 – Verify Edit control toggles member fields into an editable state when the page uses view-then-edit pattern

## Feature
Account Settings

## Sub Feature
Edit Mode

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Observe initial field state before clicking Edit
3. Click Edit
4. Observe whether inputs become editable and whether Save or Submit appears

## Expected Result
The system should allow editing of member fields that are permitted to change and should expose a clear save path

---

# TC_027 – Verify Return to My Page navigates to the member dashboard

## Feature
Account Settings

## Sub Feature
Navigation

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Click Return to My Page
3. Observe the destination

## Expected Result
The system should navigate to the My page

---

# TC_028 – Verify Logout from Account Settings ends the session

## Feature
Account Settings

## Sub Feature
Session Control

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Click Logout in the header
3. Attempt to reopen Account Settings without signing in again

## Expected Result
The system should end the session and should require sign-in before accessing Account Settings again

---

# TC_029 – Verify Account Settings is not accessible without authentication when protected

## Feature
Account Settings

## Sub Feature
Access Control

## Preconditions
-

## Test Steps
1. Ensure no active session exists
2. Attempt to open the Account Settings URL directly if known
3. Observe the response

## Expected Result
The system should block access and should redirect or require sign-in

---

# TC_030 – Verify Japanese characters in editable name fields save and display correctly within length limits

## Feature
Account Settings

## Sub Feature
Unicode Fields

## Preconditions
 Product policy allows Japanese characters in name fields

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Enter Japanese characters in First and Last Name within 25 characters each
4. Trigger Submit or Save
5. Reload and read the displayed names

## Expected Result
The system should preserve characters without corruption after save

---

# TC_031 – Verify editable inputs expose accessible names matching First Name and Telephone labels

## Feature
Account Settings

## Sub Feature
Email

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Inspect programmatic labels for the main editable inputs

## Expected Result
The system should associate each input with an understandable accessible name

---

# TC_032 – Verify duplicate or rapid Submit or Save clicks do not create inconsistent profile states

## Feature
Account Settings

## Sub Feature
Submit Idempotency

## Preconditions
None

## Test Steps
1. Open Account Settings if not already displayed
2. Enter edit mode 
3. Change one benign field and rapidly double-click Submit or Save
4. Inspect resulting profile using permitted tools

## Expected Result
The system should end in a single consistent saved state without duplicate critical errors

---

# TC_033 – Verify registration data is shown in Account Settings form

## Feature
Account Settings

## Sub Feature
Data Visibility

## Preconditions
Registration data for the account is known

## Test Steps
1. Sign in with a member account
2. Open Account Settings
3. Compare form values with the data entered during registration (name DOB gender email phone and address fields)

## Expected Result
Account Settings should display the same data that was saved during registration

---

# TC_034 – Verify edits are not saved when user clicks Cancel after making changes

## Feature
Account Settings

## Sub Feature
Edit Cancel

## Preconditions
Cancel button is available in edit mode

## Test Steps
1. Open Account Settings
2. Click Edit
3. Change one or more fields
4. Click Cancel
5. Reopen Account Settings or refresh the page

## Expected Result
Changes should not be saved and old values should remain

---

# TC_035 – Verify saved edits in Account Settings are reflected on Dashboard

## Feature
Account Settings

## Sub Feature
Data Sync to Dashboard

## Preconditions
 Member account can access both Account Settings and Dashboard

## Test Steps
1. Open Account Settings
2. Click Edit and update fields that also appear on Dashboard ( name and email)
3. Click Save or Submit
4. Open Dashboard
5. Check the same fields on Dashboard

## Expected Result
Dashboard should show the updated values after save

---

# TC_036 – Verify phone number length validation accepts values up to the configured maximum of 20 digits in Account Settings and matches stated max length rules

## Feature
Account Settings

## Sub Feature
Phone Number Validation

## Preconditions
1. User account can edit Account Settings.
2. Test accounts allow profile updates.

## Test Steps
1. Open Account Settings.
2. Locate the Phone Number field and note the stated maximum length or hint text.
3. Enter a 16-digit phone number and save.
4. Confirm the save succeeds or validation passes as expected.
5. Clear the field and enter a 20-digit phone number using only digits.
6. Save and observe validation message and API response if applicable.
7. Repeat steps 3 through 6 on the Registration form phone field if the same rule applies.

## Expected Result
If maximum length is configured as 20, phone numbers up to 20 digits should pass length validation and messages should be consistent with the configured max and should not reject 20 digits while accepting 16 digits without clear rule.

---
