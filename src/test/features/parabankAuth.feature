Feature: Parabank User Registration and Login

  Scenario: User registration and login with valid credentials
    Given User is on the Parabank registration page
    When User fills in the registration form with valid details
      | firstName  | lastName | address        | city        | state | zipCode | phoneNumber  | ssn         | username | password   | confirmPassword |
      | John       | Doe      | 123 Main St    | Anytown     | CA    | 12345   | 555-123-4567 | 123-45-6789 | testuser | Test123456 | Test123456      |
    And User submits the registration form
    Then Registration should be successful
    Given User logs in with registered credentials
      | username | password   |
      | testuser | Test123456 |
    Then Login should be successful
    And Account balance should be displayed on the page