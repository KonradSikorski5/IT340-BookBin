# BookBin - IT 340 Project

Konrad Sikorski - IT 340, Fall 2026

BookBin is a book search website. You make an account, log in, and search for books by title or author. The book info comes from the Open Library API.

## Milestone 1: Front-End
- frontend/index.html - Home page with the search bar and book results
- frontend/login.html - Login page
- frontend/register.html - Register page
- frontend/style.css - Colors and layout for all 3 pages

The pages are hosted with nginx on my Front-End VM (Ubuntu). I clone this repo onto the VM with git and copy the frontend files into /var/www/html.

## Milestone 2: Authentication
3 Ubuntu VMs on a VMware host-only network (VMnet1, 192.168.50.0/24):

| VM | IP | What it runs |
|---|---|---|
| Front-End | 192.168.50.10 | nginx (only VM with internet) |
| Back-End | 192.168.50.20 | Node.js + Express on port 3000 |
| Database | 192.168.50.30 | MongoDB on port 27017 |

- backend/server.js - Express server with /register and /login
- Passwords are hashed with Node's built-in crypto module (random salt + scrypt hash)
- User input is turned into plain text with String() so it can't be used for injection
- nginx on the Front-End forwards /api/ requests to the Back-End

### Firewall (UFW)
| VM | Allowed in |
|---|---|
| Front-End | port 80 (website) and 22 (ssh) |
| Back-End | port 3000 from the Front-End only, and 22 |
| Database | port 27017 from the Back-End only, and 22 |

MongoDB listens on all addresses (bindIp 0.0.0.0) because it started before the network was ready at boot. UFW makes sure only the Back-End can reach it.

### System Logs
- Front-End: /var/log/nginx/access.log (every web request, including logins)
- Database: /var/log/mongodb/mongod.log
- All VMs: /var/log/auth.log (logins and sudo use)

## AI Usage
I used Claude to help with the HTML, CSS, and the back-end code. I built each file in VS Code one piece at a time, and Claude gave me the code for each piece and explained what it does so I understand it. The layout is based on the mockups in my proposal.