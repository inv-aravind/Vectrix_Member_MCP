# Change Password Module – Test Cases

Application: Mobipark Member Site  
Module: Change Password  
Generated From: Change Password Sheet Test Cases  

---

# TC_001 – Verify authenticated user can open the Change password page

## Feature
Change Password

## Sub Feature
Page Access

## Preconditions
-

## Test Steps
1. Navigate to the dashboard
2. Clcik the profile icon
3. Select change password from the list.
4. Observe the form fields for current and new password

## Expected Result
The system should display the Change password page with current password and new password inputs without errors

---

# TC_002 – Verify successful password change when current password is correct and new password meets all policy criteria

## Feature
Change Password

## Sub Feature
Successful Change

## Preconditions
None

## Test Steps
1. Navigate to the dashboard
2. Clcik the profile icon
3. Select change password from the list.
4. Enter the correct current password
5. Enter a new password that satisfy every policy rule
6. Click submit

## Expected Result
The system should accept the change and should confirm success without exposing the new password in the URL

---

# TC_003 – Verify Change password page is not accessible without authentication

## Feature
Change Password

## Sub Feature
Access Control

## Preconditions
-

## Test Steps
1. Ensure no active application session exists
2. Attempt to open the Change password URL directly if known
3. Observe the response

## Expected Result
The system should block access and should redirect or require sign-in

---

# TC_004 – Verify submission is blocked when current password field is empty

## Feature
Change Password

## Sub Feature
Current Password Validation

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Leave the current password field empty
3. Enter a new password and matching confirmation if the form includes confirmation and both meet policy
4. Click submit or save password

## Expected Result
The system should prevent submission and should indicate that the current password is required

---

# TC_005 – Verify submission is rejected when current password is incorrect

## Feature
Change Password

## Sub Feature
Current Password Validation

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Enter a password that is not the account current password in the current password field
3. Enter a new password and confirmation that meet the password policy
4. Click submit or save password

## Expected Result
The system should reject the change and should indicate that the current password is incorrect without updating the password

---

# TC_006 – Verify submission is blocked when new password field is empty

## Feature
Change Password

## Sub Feature
New Password Validation

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Enter the correct current password
3. Leave the new password field empty
4. Click submit or save password

## Expected Result
The system should prevent submission and should indicate that the new password is required

---

# TC_007 – Verify new password is rejected when it does not meet the documented password policy

## Feature
Change Password

## Sub Feature
Password Policy

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Enter the correct current password
3. Enter a new password and matching confirmation that violate the policy such as being too short or missing required character classes
4. Click submit or save password

## Expected Result
The system should prevent submission and should show which policy rules failed

---

# TC_008 – Verify submission is blocked when confirm new password does not match new password

## Feature
Change Password

## Sub Feature
Confirm Password Validation

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Enter the correct current password
3. Enter a valid new password in the new password field
4. Enter a different value in confirm new password if that field exists
5. Click submit or save password

## Expected Result
The system should prevent submission and should indicate that the new passwords must match

---

# TC_009 – Verify user can sign in with the new password after a successful change from the same session or after sign-out

## Feature
Change Password

## Sub Feature
Post-Change Login

## Preconditions
The user should change his password

## Test Steps
1. Sign out if a sign-out action is available or open a fresh browser session
2. Navigate to Login
3. Enter the same username or email identifier used before the change
4. Enter the new password from the successful change flow
5. Click Log in

## Expected Result
The system should authenticate successfully using the new password

---

# TC_010 – Verify sign-in fails when using the previous password after a successful change

## Feature
Change Password

## Sub Feature
Post-Change Login

## Preconditions
The user should change his password

## Test Steps
1. Navigate to the Login page
2. Enter the same account identifier used before the change
3. Enter the old password that existed before the successful change
4. Click Log in

## Expected Result
The system should reject authentication and should not grant access with the old password

---

# TC_011 – Verify changing password again after a first successful change works when the latest current password is used

## Feature
Change Password

## Sub Feature
Repeated Change

## Preconditions
The user should change his password.
 A second distinct new password value is prepared per policy

## Test Steps
1. Open the Change password popup again while still signed in if the session remains valid
2. Enter the current password that was set by the first change password
3. Enter a different new password and confirmation that meet the password policy
4. Click submit or save password
5. Sign out if needed and verify login using only the latest new password

## Expected Result
The second change should succeed and login should work only with the latest new password

---

# TC_012 – Verify new password fields mask input by default

## Feature
Change Password

## Sub Feature
Password Masking

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Type characters into new password and confirm fields if present
3. Observe masking for current password field as well

## Expected Result
The system should mask password fields by default

---

# TC_013 – Verify show or hide password toggles behave correctly when present on change password fields

## Feature
Change Password

## Sub Feature
Password Visibility

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Enter text in current and new password fields
3. Use each show or hide control if available
4. Observe plain text versus masked display

## Expected Result
The system should toggle visibility without losing entered characters

---

# TC_014 – Verify rapid double click on submit does not leave the account in an inconsistent password state

## Feature
Change Password

## Sub Feature
Submit Idempotency

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Fill valid current password and valid new password and confirmation
3. Rapidly double-click submit
4. Verify resulting login behavior with permitted tools

## Expected Result
The system should end in a single consistent password state without duplicate critical errors

---

# TC_015 – Verify password change request completes within acceptable time under normal server conditions

## Feature
Change Password

## Sub Feature
Performance

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Fill valid values meeting policy
3. Measure time from submit click until definitive success or error is shown

## Expected Result
The submission should finish within an acceptable window without indefinite hang

---

# TC_016 – Verify keyboard user can tab through current password, new password and submit in a logical order

## Feature
Change Password

## Sub Feature
Keyboard Navigation

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Use Tab through the primary fields and submit control
3. Observe visible focus at each stop

## Expected Result
The system should provide visible focus indicators and a sensible tab order

---

# TC_017 – Verify page title and instructional copy for change password match the design

## Feature
Change Password

## Sub Feature
Page Content

## Preconditions
None

## Test Steps
1. Open the Change password popup.
2. Read headings and any helper text describing password rules

## Expected Result
The system should display intended copy and policy hints consistent with the design

---

# TC_018 – Verify change password form layout remains usable at a narrow viewport width

## Feature
Change Password

## Sub Feature
Responsive Layout

## Preconditions
None

## Test Steps
1. Open the Change password popup.
2. Resize the browser to a narrow mobile width
3. Observe field stacking and button reachability

## Expected Result
The system should keep the form readable and submittable without destructive overlap

---

# TC_019 – Verify new password identical to current password is rejected

## Feature
Change Password

## Sub Feature
Password Reuse Rule

## Preconditions
None

## Test Steps
1. Open the Change password popup.
2. Enter the correct current password
3. Enter the same value as new password
4. Click submit

## Expected Result
The system should accordingly

---

# TC_020 – Verify Return to My Page or back navigation from change password returns to the expected member area without losing session unintentionally

## Feature
Change Password

## Sub Feature
Navigation

## Preconditions
None

## Test Steps
1. Open the Change password popup.
2. Click Return to My Page or the browser Back control per test plan
3. Observe destination and session state

## Expected Result
The system should navigate predictably and should keep the user signed in unless the design signs out on navigation

---

# TC_021 – Verify whitespace-only new password is rejected on submit

## Feature
Change Password

## Sub Feature
New Password Validation

## Preconditions
None

## Test Steps
1. Open the Change password popup
2. Enter correct current password
3. Enter only spaces in new password and confirmation if applicable within any length limit
4. Click submit

## Expected Result
The system should reject whitespace-only content as an invalid new password

---

# TC_022 – Verify password change is blocked when Password is shorter than 8 characters

## Feature
password change

## Sub Feature
Password Rules

## Preconditions
-

## Test Steps
1. Open change password popup from dashboard
2. Enter a password with 7 characters that otherwise contains lowercase and uppercase English letters
3. Submit

## Expected Result
The system should prevent submission and should indicate the minimum length rule for Password

---

# TC_023 – Verify password change is blocked when Password has no uppercase English letter

## Feature
password change

## Sub Feature
Password Rules

## Preconditions
-

## Test Steps
1. Open change password popup from dashboard
2. Enter a password with 8 or more characters containing only lowercase English letters and digits if used
3. Submit

## Expected Result
The system should prevent submission and should indicate that an uppercase English letter is required

---

# TC_024 – Verify password change is blocked when Password has no lowercase English letter

## Feature
password change

## Sub Feature
Password Rules

## Preconditions
-

## Test Steps
1. Open change password popup from dashboard
2. Enter a password with 8 or more characters containing only uppercase English letters and digits if used
3. Submit

## Expected Result
The system should prevent submission and should indicate that a lowercase English letter is required

---

# TC_025 – Verify password change blocks password with no digit when a digit is required

## Feature
password change

## Sub Feature
Password Policy Numeric

## Preconditions
None

## Test Steps
1. Open change password popup from dashboard
2. Enter a password with letters (and symbols if allowed) but no digits 0–9
3. Submit

## Expected Result
The system should block submit and should state that a digit is required

---

# TC_026 – Verify password change blocks password with no special character when that rule applies

## Feature
password change

## Sub Feature
Password Policy Special Character

## Preconditions
Policy requires a special character from the defined set

## Test Steps
1. Open change password popup from dashboard
2. Enter a password that meets length letters upper lower and digit but has no required special character
3. Submit

## Expected Result
The system should block submit and should state the special-character requirement

---
