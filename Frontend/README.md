# UberClone Frontend

## Overview

This project is a frontend for an Uber-like ride-hailing app, supporting registration and login for both riders (users) and captains (drivers), and integrating Google Maps for location and route visualization.

---

## Registration & Login

### Rider (User)

- **Registration Fields:**
  - `firstname` (string, required)
  - `lastname` (string, required)
  - `email` (string, required, must be unique and valid)
  - `password` (string, required, minimum 8 characters)

- **Login Fields:**
  - `email` (string, required)
  - `password` (string, required)

- **Process:**
  - Registration and login forms are found in `src/pages/UserRegister.jsx` and `src/pages/UserLogin.jsx`.
  - On successful registration/login, user data is stored in context (`UserDataContext`), and navigation to the home page occurs.

---

### Captain (Driver)

- **Registration Fields:**
  - `firstname` (string, required)
  - `lastname` (string, required)
  - `email` (string, required, must be unique and valid)
  - `password` (string, required, minimum 8 characters)
  - `color` (string, required, vehicle color)
  - `plate` (string, required, vehicle plate number, minimum 8 characters)
  - `type` (string, required, vehicle type: "Car", "Motorcycle", "Auto")
  - `capacity` (number, required, minimum 1)

- **Login Fields:**
  - `email` (string, required)
  - `password` (string, required)

- **Process:**
  - Registration and login forms are found in `src/pages/CaptainRegister.jsx` and `src/pages/CaptainLogin.jsx`.
  - On successful registration/login, captain data is stored in context (`CaptainDataContext`), and navigation to the captain home page occurs.

---

## Frontend Routes

| Route                | Component                | Purpose                                                                 |
|----------------------|-------------------------|-------------------------------------------------------------------------|
| `/home`                  | ` Rider Home`                  | Rider home page, search and book rides                                  |
| `/user-register`          | `UserRegister`          | Rider registration form                                                 |
| `/user-login`             | `UserLogin`             | Rider login form                                                        |
| `/captain-register`  | `CaptainRegister`       | Captain registration form                                               |
| `/captain-login`     | `CaptainLogin`          | Captain login form                                                      |
| `/captainhome`      | `CaptainHome`           | Captain dashboard/home page                                             |
| `/ongoing-ride`      | `OngoingRide`           | On Rider side, shows ongoing ride details and map with route between captain and rider |
| `/captain-riding`      | `CaptainRiding`           | On Captain side, shows ongoing ride details and map with route between captain and rider |
| `/ride-details`      | `RideDetails`           | Displays details of a completed ride                         |

---

For more details, see the source files in `src/pages` and `src/components`.