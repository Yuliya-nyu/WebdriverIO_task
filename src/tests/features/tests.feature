Feature: Practice software testing

  Scenario: Test Login form with missing password
    Given user is on login page
    When user enters a valid email
    And user leaves the password field empty
    And user clicks the login button
    Then an error message for missing password is displayed

  Scenario: Add product to basket
    Given the user is on the product details page
    When the user adds the product to the basket
    Then a confirmation toast is displayed
    Then the basket counter is incremented

  Scenario: Add to favourites without signing in
    Given the user is not signed in
    And the user is on the product details page
    When the user add product to favourites
    Then the error toast is displayed

  Scenario: View product details
    Given the user is on the home page
    When the user selects a product
    Then the product details page is displayed
    And the product information is visible

  Scenario Outline: View products by category
    Given the user is on the home page
    When the user selects the "<category>" category from the Categories menu
    Then the category page for "<category>" is displayed
    And products from "<category>" are shown

    Examples:
      | category      |
      | Hand Tools    |
      | Power Tools   |
      | Other         |
      | Special Tools |
      | Rentals       |

  Scenario: Search for an existing product
    Given the user is on the home page
    When the user searches for the existing "<product>" name
    Then the search results for "<product>" are displayed
    And all listed results contain the "<product>" name

    Examples:
      | product |
      | Hammer  |
      | Pliers  |

  Scenario: Search for a non-existing product
    Given the user is on the home page
    When the user searches for non-existing "<product>"
    Then a no results message "<message>" is shown

    Examples:
      | product | message                      |
      | apple   | There are no products found. |

  Scenario Outline: Change site language
    Given the user is on the home page
    When the user selects "<lang>" from the language dropdown
    Then the language indicator shows "<lang>"
    And the site content is displayed in "<lang>"

    Examples:
      | lang |
      | DE   |
      | EN   |
      | ES   |
      | FR   |
      | NL   |
      | TR   |
