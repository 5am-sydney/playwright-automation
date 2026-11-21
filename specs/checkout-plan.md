# Checkout Flow Test Plan

## Application Overview

Checkout flow for https://www.saucedemo.com (cart -> step one information -> step two overview -> complete). Behaviour verified live. Selectors: checkout, firstName, lastName, postalCode, continue, cancel, finish, error, error-button, back-to-products, shopping-cart-badge, shopping-cart-link, add-to-cart-<slug>. Error texts: 'Error: First Name is required', 'Error: Last Name is required', 'Error: Postal Code is required'. Overview labels: 'Payment Information:' 'SauceCard #31337', 'Shipping Information:' 'Free Pony Express Delivery!', 'Item total: $', 'Tax: $', 'Total: $'. Complete page: heading 'Thank you for your order!', text 'Your order has been dispatched, and will arrive just as fast as the pony can get there!', img alt 'Pony Express', 'Back Home'. Observed app quirks: whitespace-only values are accepted; empty cart can proceed through checkout to completion with $0.00; direct URLs for all checkout pages load without redirect when logged in. Not covered here (already covered elsewhere): happy path single item, missing first name, totals for single/multiple items, remove-then-purchase, continue-shopping-then-purchase, sort-then-buy cheapest.

## Test Scenarios

### 1. Checkout Step One (Information)

**Seed:** `tests/seed.spec.ts`

#### 1.1. Missing last name shows error and keeps entered values

**File:** `tests/checkout/missing-last-name.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack, open cart, click Checkout
    - expect: URL is /checkout-step-one.html, header 'Checkout: Your Information'
  2. Fill First Name 'Jane', Zip '2000', leave Last Name empty; click Continue
    - expect: Stay on step one
    - expect: Error 'Error: Last Name is required' shown
    - expect: First Name still 'Jane' and Zip still '2000'

#### 1.2. Missing postal code shows error and keeps entered values

**File:** `tests/checkout/missing-postal-code.spec.ts`

**Steps:**
  1. Add item, go to step one, fill First 'Jane', Last 'Doe', leave Zip empty; click Continue
    - expect: Stay on step one
    - expect: Error 'Error: Postal Code is required'
    - expect: First and Last values retained

#### 1.3. All fields empty shows First Name error (validation order)

**File:** `tests/checkout/all-fields-empty-validation-order.spec.ts`

**Steps:**
  1. Add item, go to step one, click Continue with all empty
    - expect: Error 'Error: First Name is required'
  2. Fill First Name only, Continue
    - expect: Error 'Error: Last Name is required'
  3. Fill Last Name, Continue
    - expect: Error 'Error: Postal Code is required'. Order is First Name, then Last Name, then Postal Code

#### 1.4. Dismiss error banner with X

**File:** `tests/checkout/dismiss-error-banner.spec.ts`

**Steps:**
  1. Add item, go to step one, click Continue to trigger error
    - expect: Error banner visible with 'Dismiss error' button
  2. Click the X (data-test error-button)
    - expect: Banner no longer visible; still on step one

#### 1.5. Whitespace-only values are accepted (observed behaviour)

**File:** `tests/checkout/whitespace-only-values.spec.ts`

**Steps:**
  1. Add item, go to step one, fill each of the three fields with three spaces, click Continue
    - expect: No error shown (observed: app does not trim/validate)
    - expect: Navigates to /checkout-step-two.html 'Checkout: Overview'. Note in test comment that this is a known app weakness

#### 1.6. Special characters and long values accepted

**File:** `tests/checkout/special-and-long-values.spec.ts`

**Steps:**
  1. Add item, go to step one, First "Zoë-Anne O'Brien-Smith ñ 李", Last a 100+ character string, Zip 'SW1A 1AA-@#$%'; Continue
    - expect: No error; navigates to overview (special chars verified live; long values to be confirmed by generator, assert real behaviour)

#### 1.7. Cancel on step one returns to cart with items intact

**File:** `tests/checkout/step-one-cancel.spec.ts`

**Steps:**
  1. Add Backpack and Bike Light, open cart, Checkout, click Cancel
    - expect: URL /cart.html
    - expect: Both items listed, badge shows 2

#### 1.8. Checkout with empty cart (observed behaviour)

**File:** `tests/checkout/empty-cart-checkout.spec.ts`

**Steps:**
  1. From seed state open cart, click Checkout, fill valid info, Continue
    - expect: Observed: app allows it; overview shows no items, 'Item total: $0', 'Tax: $0.00', 'Total: $0.00'
  2. Click Finish
    - expect: Observed: reaches /checkout-complete.html with 'Thank you for your order!'. Assert real behaviour and annotate as app defect

### 2. Checkout Step Two (Overview)

**Seed:** `tests/seed.spec.ts`

#### 2.1. Overview lists items, quantities and prices matching the cart

**File:** `tests/checkout/overview-items-match-cart.spec.ts`

**Steps:**
  1. Add Backpack ($29.99) and Bike Light ($9.99), record cart names/prices, complete step one
    - expect: Overview shows both items, each QTY 1, names and prices equal to cart ($29.99, $9.99)

#### 2.2. Overview shows payment, shipping and summary labels

**File:** `tests/checkout/overview-labels.spec.ts`

**Steps:**
  1. Add Backpack and Bike Light, complete step one
    - expect: 'Payment Information:' with 'SauceCard #31337'
    - expect: 'Shipping Information:' with 'Free Pony Express Delivery!'
    - expect: 'Item total: $39.98', 'Tax: $3.20', 'Total: $43.18' labels present (labels only; arithmetic covered elsewhere)

#### 2.3. Cancel on overview returns to inventory with cart intact

**File:** `tests/checkout/overview-cancel.spec.ts`

**Steps:**
  1. Add Backpack and Bike Light, complete step one, click Cancel
    - expect: URL /inventory.html (not cart)
    - expect: Cart badge shows 2; the two items show 'Remove' buttons

### 3. Checkout Complete

**Seed:** `tests/seed.spec.ts`

#### 3.1. Complete page content

**File:** `tests/checkout/complete-page-content.spec.ts`

**Steps:**
  1. Add item, complete checkout through Finish
    - expect: Header 'Checkout: Complete!'
    - expect: Heading 'Thank you for your order!'
    - expect: Text 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    - expect: Image alt 'Pony Express' visible
    - expect: 'Back Home' button visible

#### 3.2. Back Home returns to inventory with empty cart

**File:** `tests/checkout/back-home-empties-cart.spec.ts`

**Steps:**
  1. Add two items, complete order, click Back Home
    - expect: URL /inventory.html; no cart badge (cart labelled empty)
  2. Open cart
    - expect: No items listed in cart

### 4. Direct URL Access

**Seed:** `tests/seed.spec.ts`

#### 4.1. Direct access to checkout pages when logged in (observed behaviour)

**File:** `tests/checkout/direct-url-access.spec.ts`

**Steps:**
  1. With empty cart goto /checkout-step-one.html
    - expect: Page loads with 'Checkout: Your Information' form, no redirect
  2. goto /checkout-step-two.html without completing step one
    - expect: Page loads 'Checkout: Overview' with payment/shipping labels, no items, Item total $0, no redirect
  3. goto /checkout-complete.html without ordering
    - expect: Page loads showing 'Thank you for your order!' and Back Home, no redirect. Assert the real behaviour and annotate as app weakness
