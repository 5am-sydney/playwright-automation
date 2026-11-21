# Saucedemo Login and Authentication Test Plan

## Application Overview

Login and authentication coverage for https://www.saucedemo.com (BASE_URL from .env). IMPORTANT: tests/seed.spec.ts performs a standard_user login. Every scenario below must NOT use the seed login; each must start from a fresh, un-logged-in page/context (fresh browser context, no storage state) at BASE_URL. All selectors verified live: [data-test=username] (#user-name, placeholder "Username"), [data-test=password] (#password, placeholder "Password"), [data-test=login-button] (#login-button, input value "Login"), [data-test=error] banner, [data-test=error-button] (X). Password for all users: secret_sauce. Already covered elsewhere and excluded: valid standard_user login, locked_out_user error, logout returns to login page.

## Test Scenarios

### 1. Login and Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login page UI elements

**File:** `tests/login/login-page-ui.spec.ts`

**Steps:**
  1. Open BASE_URL in a fresh context (no login).
    - expect: Page title is 'Swag Labs'
    - expect: Logo text 'Swag Labs' (.login_logo) visible
  2. Inspect form controls.
    - expect: Username input with placeholder 'Username' is visible and empty
    - expect: Password input with placeholder 'Password' is visible, empty, type=password (masked)
    - expect: Login button with value 'Login' is visible and enabled
    - expect: No error banner is present
  3. Read the credentials hint block.
    - expect: Text 'Accepted usernames are:' lists standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user
    - expect: Text 'Password for all users:' followed by secret_sauce

#### 1.2. Invalid username and password shows mismatch error

**File:** `tests/login/invalid-credentials.spec.ts`

**Steps:**
  1. Fresh page; enter username 'bad' and password 'bad'; click Login.
    - expect: Error banner text: 'Epic sadface: Username and password do not match any user in this service'
    - expect: URL remains BASE_URL root, no inventory shown
    - expect: Both inputs get red error styling (class 'error')

#### 1.3. Valid username with wrong password shows mismatch error

**File:** `tests/login/wrong-password.spec.ts`

**Steps:**
  1. Fresh page; enter standard_user and password 'wrong'; click Login.
    - expect: Error: 'Epic sadface: Username and password do not match any user in this service'
    - expect: User stays on login page

#### 1.4. Empty username shows Username is required

**File:** `tests/login/empty-username.spec.ts`

**Steps:**
  1. Fresh page; leave username empty, enter secret_sauce; click Login.
    - expect: Error: 'Epic sadface: Username is required'
    - expect: User stays on login page

#### 1.5. Empty password shows Password is required

**File:** `tests/login/empty-password.spec.ts`

**Steps:**
  1. Fresh page; enter standard_user, leave password empty; click Login.
    - expect: Error: 'Epic sadface: Password is required'
    - expect: User stays on login page

#### 1.6. Both fields empty shows Username is required

**File:** `tests/login/empty-both-fields.spec.ts`

**Steps:**
  1. Fresh page; click Login without entering anything.
    - expect: Error: 'Epic sadface: Username is required' (username validated first)
    - expect: User stays on login page

#### 1.7. Credentials are case sensitive

**File:** `tests/login/case-sensitive-credentials.spec.ts`

**Steps:**
  1. Fresh page; enter STANDARD_USER / secret_sauce; click Login.
    - expect: Mismatch error 'Epic sadface: Username and password do not match any user in this service'
  2. Reload; enter standard_user / SECRET_SAUCE; click Login.
    - expect: Same mismatch error; no navigation to inventory

#### 1.8. Error banner can be dismissed with X button

**File:** `tests/login/dismiss-error-banner.spec.ts`

**Steps:**
  1. Fresh page; click Login with empty fields.
    - expect: Error banner visible; username and password inputs have error styling
    - expect: [data-test=error-button] (X) visible
  2. Click the X button.
    - expect: Banner is removed from the page
    - expect: Input error styling is cleared
    - expect: User stays on login page and can log in afterwards

#### 1.9. Direct access to /inventory.html without login is blocked

**File:** `tests/login/auth-guard-inventory.spec.ts`

**Steps:**
  1. In a fresh context navigate directly to BASE_URL/inventory.html.
    - expect: User is redirected to the login page (URL is root '/')
    - expect: Error banner: "Epic sadface: You can only access '/inventory.html' when you are logged in."
    - expect: No product list is rendered

#### 1.10. Direct access to /cart.html without login is blocked

**File:** `tests/login/auth-guard-cart.spec.ts`

**Steps:**
  1. In a fresh context navigate to BASE_URL/cart.html.
    - expect: Login form is shown
    - expect: Error banner: "Epic sadface: You can only access '/cart.html' when you are logged in." (Observed: URL stayed /cart.html while login form rendered; assert on error text, not URL)

#### 1.11. Browser back after logout does not restore session

**File:** `tests/login/session-after-logout-back.spec.ts`

**Steps:**
  1. Fresh page; log in as standard_user (this is part of the scenario, not the seed); open burger menu; click Logout.
    - expect: Login page shown at root URL
  2. Click browser Back.
    - expect: Inventory is NOT shown (0 inventory items)
    - expect: Login page with error "Epic sadface: You can only access '/inventory.html' when you are logged in."
  3. Click browser Forward / navigate to /inventory.html.
    - expect: Still blocked with the same error

#### 1.12. problem_user, error_user and visual_user reach inventory

**File:** `tests/login/other-users-login.spec.ts`

**Steps:**
  1. For each of problem_user, error_user, visual_user: fresh page, login with secret_sauce.
    - expect: URL is /inventory.html
    - expect: 6 inventory items displayed
    - expect: No error banner
    - expect: Cart shows empty
  2. Verify user-specific known quirk for problem_user (all 6 images use /assets/sl-404 placeholder) and visual_user (first product image is the sl-404 placeholder, the other 5 normal).
    - expect: Image src assertions match observed behaviour; standard images for error_user

#### 1.13. performance_glitch_user logs in after a delay

**File:** `tests/login/performance-glitch-user-login.spec.ts`

**Steps:**
  1. Fresh page; login as performance_glitch_user / secret_sauce; wait for URL /inventory.html with a generous timeout (>= 15s).
    - expect: Login succeeds (observed about 5.6s total versus about 1.4s for others)
    - expect: 6 inventory items displayed
    - expect: Do NOT assert on exact elapsed time; only use the extended timeout to keep deterministic
