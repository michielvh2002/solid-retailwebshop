# Solid Webshop

This project explores the integration of Solid Pods into a retail setting to support personalized marketing while ensuring user privacy and data control. The proof-of-concept demonstrates a decentralized and user-focused approach to marketing, aligning with Solid principles.

## Overview

This repository contains three key components:

1. **Klantenapplicatie**:  
   A user-owned application for managing access to personal data. It simplifies granting and revoking permissions for retailers to access resources like order history and demographic information.

2. **Backend API**:  
   A server-side application that interacts with user Pods to read and write data (e.g., orders) securely, based on user-provided permissions.

3. **Webshop**:  
   An online store where customers can log in using their Solid WebID, browse products, manage their shopping cart, and participate in a loyalty program called Superplus.

## Setup

Ensure you have [Node.js](https://nodejs.org/) installed before proceeding. Each component runs independently, and the steps for setup are outlined below.

---

### Backend API

The backend API requires credentials for authentication. Follow these steps:

1. Duplicate `.env.example` and rename it to `.env`.
2. Add your `client_id` and `client_secret` obtained from your Solid Pod provider to the `.env` file.
3. Run the following commands to start the backend:

```bash
cd backend
npm install
npm run build
npm run dev
```

---

### Webshop

The webshop enables users to log in with their WebID and shop online. To run the Webshop:

```bash
cd Webshop
npm install
npm run build
npm start
```

---

### Klantenapplicatie

The klantenapplicatie simplifies access control for users. To start the application:

```bash
cd Klantenapplicatie
npm install
npm run build
npm start
```

---

## Features

### Klantenapplicatie:

- Initializes the user's Pod structure for the project.
- Adds retailers and sets permissions for resources (e.g., order history, demographic data).
- Uses Vue.js and TypeScript for front-end functionality.

### Backend API:

- Authenticates with Solid Pods using Solid OIDC.
- Handles secure reading and writing of data.
- Includes identity verification to ensure secure data transactions.

### Webshop:

- Provides a shopping experience where users log in using their Solid WebID.
- Integrates with the API to store orders directly in the user's Solid Pod.
- Enables participation in a loyalty program where permissions granted influence rewards.
