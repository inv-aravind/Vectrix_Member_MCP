# Login Module – Test Cases

Application: Mobipark Member Site
Module: Login
Total Test Cases: 42

---

# Test Case Format

Each test case contains:

* Test Case ID
* Description
* Feature
* Sub Feature
* Preconditions
* Test Steps
* Expected Result

---

# TC_001 – Verify successful login with valid registered email and password

## Feature

Authentication

## Sub Feature

Login Submit

## Preconditions

1. A user account exists with the email registered in the system.
2. The account password matches the credentials being used.

## Test Steps

1. Navigate to the Login page.
2. Enter a registered email address in the Email Address field.
3. Enter the matching correct password in the Password field.
4. Click the Log in button.

## Expected Result

The system should authenticate the user and grant access to the members-only area.

---

# TC_002 – Verify members-only content is accessible after successful login

## Feature

Authentication

## Sub Feature

Post-Login Access

## Preconditions

User should be logged in.

## Test Steps

1. Navigate to a members-only URL or protected page action.
2. Observe whether the page loads or access is granted.

## Expected Result

The system should allow access without redirecting back to the Login page.

---

# TC_003 – Verify successful login redirects the user to the Dashboard

## Feature

Authentication

## Sub Feature

Post-Login Redirect

## Preconditions

An activated member account exists.

## Test Steps

1. Navigate to the Login page.
2. Enter valid activated member credentials.
3. Click Log in.
4. Observe the URL and page title after authentication completes.

## Expected Result

The system should navigate to the Dashboard without requiring manual navigation from the member.

---

# TC_004 – Verify validation when Email Address and Password are both empty

## Feature

Authentication

## Sub Feature

Field Validation

## Preconditions

None.

## Test Steps

1. Navigate to the Login page.
2. Leave the Email Address field empty.
3. Leave the Password field empty.
4. Click the Log in button.

## Expected Result

The system should prevent login and should display a clear validation indication for the required fields.

---

# TC_005 – Verify validation when Email Address is empty and Password is entered

## Feature

Authentication

## Sub Feature

Field Validation

## Preconditions

None.

## Test Steps

1. Navigate to the Login page.
2. Leave the Email Address field empty.
3. Enter any text in the Password field.
4. Click the Log in button.

## Expected Result

The system should prevent login and should indicate that the Email Address is required.

---

# TC_006 – Verify validation when Password is empty and Email Address is entered

## Feature

Authentication

## Sub Feature

Field Validation

## Preconditions

None.

## Test Steps

1. Navigate to the Login page.
2. Enter a syntactically valid email address in the Email Address field.
3. Leave the Password field empty.
4. Click the Log in button.

## Expected Result

The system should prevent login and should indicate that the Password is required.

---

# TC_007 – Verify login is rejected when Email Address format is invalid (missing @)

## Feature

Authentication

## Sub Feature

Email Validation

## Preconditions

None.

## Test Steps

1. Navigate to the Login page.
2. Enter an email value without the @ symbol in the Email Address field.
3. Enter any password in the Password field.
4. Click the Log in button.

## Expected Result

The system should prevent login and should indicate that the Email Address format is invalid.

---

# TC_008 – Verify login is rejected when Email Address format is invalid (missing local part)

## Feature

Authentication

## Sub Feature

Email Validation

## Preconditions

None.

## Test Steps

1. Navigate to the Login page.
2. Enter a value starting with @ and a domain in the Email Address field.
3. Enter any password in the Password field.
4. Click the Log in button.

## Expected Result

The system should prevent login and should indicate that the Email Address format is invalid.

---

# TC_009 – Verify login is rejected when Email Address format is invalid (missing domain)

## Expected Result

The system should prevent login and indicate invalid email format.

---

# TC_010 – Verify login is rejected using an unregistered email address

## Expected Result

The system should prevent login and display invalid credential indication.

---

# TC_011 – Verify login is rejected using incorrect password

## Expected Result

The system should prevent login and display invalid credential indication.

---

# TC_012 – Verify login fails when account is not activated

## Expected Result

The system should prevent login for non-activated accounts.

---

# TC_013 – Verify password field masks entered characters

## Expected Result

Characters entered in the password field should be masked.

---

# TC_014 – Verify login button is clickable and functional

## Expected Result

The Log in button should trigger authentication flow.

---

# TC_015 – Verify user session is created after successful login

## Expected Result

A valid authenticated session should be created.

---

# TC_016 – Verify authenticated user cannot access Login page again

## Expected Result

Authenticated users should be redirected away from Login page.

---

# TC_017 – Verify logout invalidates user session

## Expected Result

The session should be terminated successfully after logout.

---

# TC_018 – Verify protected pages are inaccessible after logout

## Expected Result

Protected pages should redirect to Login page after logout.

---

# TC_019 – Verify email field accepts valid email formats

## Expected Result

Valid email formats should be accepted.

---

# TC_020 – Verify password field enforces maximum length

## Expected Result

Password field should not accept characters beyond the allowed limit.

---

# TC_021 – Verify leading/trailing spaces are handled correctly in email field

## Expected Result

The system should trim or properly validate spaces in the email field.

---

# TC_022 – Verify login using email with uppercase characters

## Expected Result

The system should handle email case-insensitively.

---

# TC_023 – Verify pressing Enter key submits Login form

## Expected Result

Pressing Enter should trigger login submission.

---

# TC_024 – Verify Forgot Password link navigation

## Expected Result

User should be redirected to Forgot Password page.

---

# TC_025 – Verify Register as new member link navigation

## Expected Result

User should be redirected to Registration page.

---

# TC_026 – Verify browser back navigation after login

## Expected Result

Protected content should remain secure during navigation.

---

# TC_027 – Verify direct access to Dashboard without login

## Expected Result

Unauthenticated users should be redirected to Login page.

---

# TC_028 – Verify login page loads successfully

## Expected Result

Login page should load without UI or console errors.

---

# TC_029 – Verify login page responsiveness on different screen sizes

## Expected Result

The Login page should remain usable across supported screen sizes.

---

# TC_030 – Verify validation message clarity for invalid credentials

## Expected Result

Clear and understandable validation messages should be displayed.

---

# TC_031 – Verify multiple consecutive failed login attempts

## Expected Result

The application should continue functioning without crashing or exposing vulnerabilities.

---

# TC_032 – Verify login with special characters in password

## Expected Result

Special characters in password should be handled correctly.

---

# TC_033 – Verify session persists during page refresh

## Expected Result

Authenticated session should remain active after refresh.

---

# TC_034 – Verify expired session redirects to Login page

## Expected Result

Expired sessions should require re-authentication.

---

# TC_035 – Verify login functionality across supported browsers

## Expected Result

Login functionality should work consistently across supported browsers.

---

# TC_036 – Verify login page behavior during slow network conditions

## Expected Result

The page should remain stable and provide proper loading behavior.

---

# TC_037 – Verify login page handles server errors gracefully

## Expected Result

Appropriate error handling should be displayed without exposing technical details.

---

# TC_038 – Verify login form accessibility using keyboard navigation

## Expected Result

All login controls should be accessible using keyboard navigation.

---

# TC_039 – Verify focus order on Login page

## Expected Result

Focus order should follow logical top-to-bottom navigation.

---

# TC_040 – Verify Login page UI elements visibility

## Expected Result

All mandatory UI elements should be visible and properly aligned.

---

# TC_041 – Verify Login page retains no sensitive information after logout

## Expected Result

Sensitive information should not remain visible after logout.

---

# TC_042 – Verify Registration page loads from the top after navigating from a scrolled Login page

## Feature

Navigation

## Sub Feature

Scroll Position On Route Change

## Preconditions

None.

## Test Steps

1. Open the Login page in the browser.
2. Scroll down until the bottom of the Login page is visible.
3. Click the link that navigates to the Registration page.
4. Observe the initial scroll position of the Registration page without manually scrolling.
5. Confirm whether the viewport shows the top of the Registration content first.

## Expected Result

The Registration page should open with scroll position at the top and should not retain the previous page scroll offset so users should see the beginning of the new page immediately.
