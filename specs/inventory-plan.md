# Inventory Test Plan

## Application Overview

Inventory area of https://www.saucedemo.com (inventory.html and inventory-item.html). All scenarios start from the seed tests/seed.spec.ts (logged in as standard_user, empty cart, default sort Name A to Z). Catalog: Sauce Labs Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99, Test.allTheThings() T-Shirt (Red) $15.99. Not planned (already covered): add one, add multiple, remove from inventory, price low-high sort only, open first product name check, logout to login page.

## Test Scenarios

### 1. Inventory

**Seed:** `tests/seed.spec.ts`

#### 1.1. Inventory shows 6 products by default in Name A to Z order

**File:** `tests/inventory/product-count.spec.ts`

**Steps:**
  1. Observe the inventory page after login
    - expect: Title 'Products' shown; exactly 6 product cards
    - expect: Sort dropdown shows 'Name (A to Z)'
    - expect: Order: Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Test.allTheThings() T-Shirt (Red)

#### 1.2. Each product card shows image, name, description, price and Add to cart button

**File:** `tests/inventory/card-data-integrity.spec.ts`

**Steps:**
  1. For each of the 6 cards read image, name, description, price, button
    - expect: Image is visible, loaded (naturalWidth > 0) and alt equals product name
    - expect: Name, non-empty description and price in $X.XX format match the catalog values
    - expect: Button reads 'Add to cart'; cart badge absent

#### 1.3. Sort Name (Z to A) reverses order and keeps prices paired

**File:** `tests/inventory/sort-name-desc.spec.ts`

**Steps:**
  1. Select 'Name (Z to A)'
    - expect: Names ordered Test.allTheThings() T-Shirt (Red), Onesie, Fleece Jacket, Bolt T-Shirt, Bike Light, Backpack
    - expect: Each name keeps its catalog price (e.g. Onesie $7.99, Fleece Jacket $49.99)
    - expect: Still 6 cards

#### 1.4. Sort Name (A to Z) restores default order after another sort

**File:** `tests/inventory/sort-name-asc.spec.ts`

**Steps:**
  1. Select 'Price (high to low)' then 'Name (A to Z)'
    - expect: Order returns to Backpack ... Test.allTheThings() T-Shirt (Red)
    - expect: Name-price pairs unchanged

#### 1.5. Sort Price (high to low) orders prices descending with names paired

**File:** `tests/inventory/sort-price-desc.spec.ts`

**Steps:**
  1. Select 'Price (high to low)'
    - expect: Prices: 49.99, 29.99, 15.99, 15.99, 9.99, 7.99
    - expect: Names pair: Fleece Jacket, Backpack, the two $15.99 T-Shirts (either order, assert as a set), Bike Light, Onesie

#### 1.6. Sort selection does not alter cart badge or Remove button state

**File:** `tests/inventory/sort-preserves-cart-state.spec.ts`

**Steps:**
  1. Add Backpack and Onesie, then change sort to Price (high to low)
    - expect: Badge stays 2
    - expect: Only Backpack and Onesie show 'Remove'; others show 'Add to cart'

#### 1.7. Product detail page shows correct name, description, price and image

**File:** `tests/inventory/detail-content.spec.ts`

**Steps:**
  1. Click a product name (e.g. Bike Light), then repeat via the product image for Onesie
    - expect: URL is inventory-item.html?id=N
    - expect: Name, full description, price and image (alt equals name, loaded) match the inventory card
    - expect: 'Back to products' button visible; button reads 'Add to cart'

#### 1.8. Back to products returns to the inventory page

**File:** `tests/inventory/detail-back-to-products.spec.ts`

**Steps:**
  1. Open a product detail then click 'Back to products'
    - expect: URL is inventory.html
    - expect: 6 cards displayed, default sort Name A to Z

#### 1.9. Add and remove from detail page syncs the cart badge

**File:** `tests/inventory/detail-add-remove-badge.spec.ts`

**Steps:**
  1. Open Backpack detail, click 'Add to cart'
    - expect: Button changes to 'Remove'; badge shows 1
  2. Click 'Remove'
    - expect: Button returns to 'Add to cart'; badge disappears

#### 1.10. Add/remove state persists after opening a detail page and returning

**File:** `tests/inventory/state-persistence-detail.spec.ts`

**Steps:**
  1. Add Backpack on inventory, open Bike Light detail, return via Back to products
    - expect: Backpack still 'Remove', Bike Light 'Add to cart', badge 1
  2. Open Backpack detail
    - expect: Button shows 'Remove'
  3. Click Remove on detail, go back
    - expect: Backpack shows 'Add to cart'; badge gone

#### 1.11. Cart badge counts items and cart icon opens the cart from inventory

**File:** `tests/inventory/cart-badge-icon.spec.ts`

**Steps:**
  1. Add 3 items then remove 1 on inventory
    - expect: Badge goes 1, 2, 3, then 2
  2. Click the cart icon
    - expect: URL is cart.html and lists exactly the 2 added items

#### 1.12. Burger menu opens and closes and lists expected items

**File:** `tests/inventory/burger-menu.spec.ts`

**Steps:**
  1. Click Open Menu
    - expect: Menu shows All Items, About, Logout, Reset App State (observed also a 'Dynamic Catalog' item; verify and assert actual behaviour)
  2. Click Close Menu
    - expect: Menu hidden; inventory still visible
  3. Open menu on a detail page and click All Items
    - expect: Navigates to inventory.html

#### 1.13. Reset App State clears cart badge and resets button states

**File:** `tests/inventory/reset-app-state.spec.ts`

**Steps:**
  1. Add Backpack and Bike Light, open menu, click Reset App State
    - expect: Badge disappears
  2. Check all buttons (reload page if buttons are stale, and note which)
    - expect: All 6 show 'Add to cart'; cart page is empty
