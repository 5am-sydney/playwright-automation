# SauceDemo Shopping Cart Test Plan

## Application Overview

Focused plan for the SauceDemo cart flow (add, remove, badge count, continue shopping). All scenarios start from the seed state in tests/seed.spec.ts: logged in as standard_user / secret_sauce on /inventory.html with an empty cart. Note: the plan was written without live exploration because the seed failed (BASE_URL env var undefined), so selectors and labels reflect known SauceDemo behavior and should be verified.

## Test Scenarios

### 1. Shopping Cart

**Seed:** `tests/seed.spec.ts`

#### 1.1. Add a single item to the cart

**File:** `tests/cart/add-to-cart.spec.ts`

**Steps:**
  1. On the inventory page, confirm no cart badge is shown, then click 'Add to cart' on 'Sauce Labs Backpack'
    - expect: The button text changes to 'Remove'
    - expect: The cart icon badge appears with the count 1
  2. Click the cart icon
    - expect: URL is /cart.html
    - expect: The cart lists 'Sauce Labs Backpack' with quantity 1 and price $29.99

#### 1.2. Cart badge count tracks multiple adds and removes

**File:** `tests/cart/badge-count.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack', 'Sauce Labs Bike Light' and 'Sauce Labs Bolt T-Shirt' from the inventory page
    - expect: Badge count increments 1, 2, 3 after each add
  2. Click 'Remove' on 'Sauce Labs Bike Light' on the inventory page
    - expect: Badge shows 2
    - expect: Button reverts to 'Add to cart' for that item
  3. Remove the remaining two items
    - expect: The badge disappears entirely (no '0' shown)

#### 1.3. Remove an item from the cart page

**File:** `tests/cart/remove-from-cart.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack' and 'Sauce Labs Onesie', then open the cart
    - expect: Both items are listed and badge shows 2
  2. Click 'Remove' on 'Sauce Labs Backpack'
    - expect: The Backpack disappears from the list
    - expect: Only 'Sauce Labs Onesie' remains and badge shows 1
  3. Click 'Remove' on the Onesie
    - expect: Cart list is empty and badge is gone
    - expect: Checkout button remains visible

#### 1.4. Continue Shopping preserves cart state

**File:** `tests/cart/continue-shopping.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Fleece Jacket' and open the cart
    - expect: Cart shows the Fleece Jacket
  2. Click 'Continue Shopping'
    - expect: URL returns to /inventory.html
    - expect: Badge still shows 1
    - expect: Fleece Jacket button reads 'Remove'
  3. Add 'Test.allTheThings() T-Shirt (Red)' and reopen the cart
    - expect: Both items are listed and badge shows 2
  4. Negative check: open the empty-cart state by removing all items, then click 'Continue Shopping'
    - expect: User returns to inventory with no badge and no error
