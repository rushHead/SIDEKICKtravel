# SIDEKICK Travel

---

### 📑 Topics Overview
- [Topic 1: Repository Setup & Bun Installation](#-topic-1-repository-setup--bun-installation)
- [Topic 2: Login Implementation Thoughts](#-topic-2-login-implementation-thoughts)
- [Topic 3: File Structure & Monolithic Schema Design](#-topic-3-file-structure--monolithic-schema-design)
- [Topic 4: Server Architecture Thoughts (Bun & Elysia)](#-topic-4-server-architecture-thoughts-bun--elysia)

---

## 📌 Topic 1: Repository Setup & Bun Installation

<details open>
<summary><b>🔻 Click to expand / collapse Topic 1</b></summary>

To start working on this repo ; you need to clone it first in your folder ...

First open any code editor ;

then open any folder where you want to make your This PROJECT FOLDer and then runnnn ---

```bash
git clone https://github.com/rushHead/SIDEKICKtravel
```

After that what you do is install bun ; so that you can run the files 
[Steps to install bun --- 
i> open powershell at root folder 
ii> run this command  `powershell -c "irm bun.sh/install.ps1|iex"`
iii> then verify by running  `bun install`
]

</details>

---

## 📌 Topic 2: Login Implementation Thoughts

<details open>
<summary><b>🔻 Click to expand / collapse Topic 2</b></summary>

////login implementation thoughts 
First thing we do is login implementation so that .. we can ort out all 3 types of login mentioned :- 

1. user login
2. SalesMan login
3. Admin Login

first we do is start with the user gmail and phone number login.

Steps to implement ; first we connect this whole project to supabase and see what happens....

We will try to run independent Frontend and Backend processes ; so that they arent affected by each other .....

</details>

---

## 📌 Topic 3: File Structure & Monolithic Schema Design

<details open>
<summary><b>🔻 Click to expand / collapse Topic 3</b></summary>

/////thought in file structure
THOUGHT OF THE SCHEMA DESIGN ; going for a monolithic structure and making an overall file architechture/ schema to work on and so that everyone can understand it ...(will update it later as per future uses)

```text
sidekick-travel/
├── package.json
├── bun.lock
├── tsconfig.base.json
├── .gitignore
├── .env.example
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── app/
│       │   ├── router.tsx
│       │   └── providers.tsx
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── DestinationsPage.tsx
│       │   ├── ProductsPage.tsx
│       │   ├── PlannerPage.tsx
│       │   └── admin/
│       ├── features/
│       │   ├── destinations/
│       │   ├── products/
│       │   ├── trip-planner/
│       │   ├── itinerary/
│       │   ├── enquiries/
│       │   └── crm/
│       ├── components/
│       │   ├── ui/
│       │   └── layout/
│       ├── lib/
│       │   └── api.ts
│       └── styles/
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   ├── migrations/
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── config/
│   │   ├── db/
│   │   │   ├── index.ts
│   │   │   └── schema/
│   │   ├── routes/
│   │   │   ├── health.ts
│   │   │   ├── auth.ts
│   │   │   ├── destinations.ts
│   │   │   ├── products.ts
│   │   │   ├── inventory.ts
│   │   │   ├── recommendations.ts
│   │   │   ├── itineraries.ts
│   │   │   ├── enquiries.ts
│   │   │   └── admin/
│   │   ├── services/
│   │   │   ├── pricing.service.ts
│   │   │   ├── recommendation.service.ts
│   │   │   ├── itinerary.service.ts
│   │   │   ├── lead.service.ts
│   │   │   └── messaging.service.ts
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── schemas/
│   │   └── utils/
│   └── tests/
│
└── packages/
    └── shared/
        ├── package.json
        └── src/
            ├── types/
            └── schemas/
```

</details>

---

## 📌 Topic 4: Server Architecture Thoughts (Bun & Elysia)

<details open>
<summary><b>🔻 Click to expand / collapse Topic 4</b></summary>

/////Now thoughts on servers!!!!

cannot use express obviously bcoz beginner level noob server cannot handle shit also not optimized for bun. Need a server more dedicate for running Bun style architechture
...

Yooo i Found this new server shii called ....."Elysia"...sounds perfect for my use case 


 What does Elysia actually do?

Imagine someone is visiting the travel website and asks for travel packages to Goa.

-------------------------------------------------------------

React + Vite                                                    THIS IS THE FRONTEND LAYER

Displays the website and collects the user's choices.

-------------------------------------------------------------

HTTP request / response

-------------------------------------------------------------

Elysia + Bun
                                                                                                    THIS IS THE BACKEND SERVER LOGIC
Receives the request, checks it, runs your recommendation logic, and returns results.           

------------------------------------------------------------


PostgreSQL / Supabase
                                                                                                 DATABASE LAYER
Stores destinations, package prices, itineraries, and enquiries.

------------------------------------------------------------



/////when we do publish it then we will use AWS at that point of time ; for now krke koi point nhi hai

</details>