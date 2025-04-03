# **Assignment: Full-Stack CRUD Application Development with DevOps Practices**

## **Objective**

This project is about extending a provided application by implementing **CRUD (Create, Read, Update, Delete)** to the topic I chose, which is **“car rental system”**.
The whole project is based on the **requirements diagram using sysML**. The developing steps will follow the user stories, issues I planned in **JIRA**. This approach helps to ensure that no task will be forgotten.
Besides only developing the system, I use **GitHub version control** and **Branching Strategy** to ensure that each feature is well-developed and functional. Also, using **CI/CD** to support me in integrating code continuously and deploying continuously, allowing me to detect any bugs and conflicts, ensuring that each feature I develop works well so that I can move to the next feature.


### **1. Real-World Application**

* This system allows users to view available cars and rent the car, editing their rental and deleting the rental if they change their mind.

### **2. Project Management with JIRA and SysML**

* The Epics, user stories, child issues I created all follow the requirement diagram.
* Each Epic designs for own purpose, there are: User Authentication, Car Management, rental Management, User Profile Management
Each Epic includes user stories for specific feature. For example, in rental Management, there are rental creating, viewing, updating and deleting.
* User stories can break down to child issues, which ensures that no tasks will be forgotten.

* **JIRA board URL:**https://neal-liu.atlassian.net/jira/software/projects/CRS/boards/36.


### **3. Backend Development (Node.js + Express + MongoDB)**

Create a user-friendly interface: 
* Implement **forms** for adding and updating records
* Display data using  **tables, cards, or lists**
* use TailwindCSS and some hover on buttons

### **4. Frontend Development (React.js)**

* Create a user-friendly interface**.
* Implement **forms** for adding, showing, deleting and updating records (CRUD).
* Display data using  **tables, cards, or lists**

### **5. Authentication & Authorization**

* Ensure **only authenticated users** can access and perform CRUD operations.
* Use **JWT (JSON Web Tokens)** for user authentication.

### **6. GitHub Version Control & Branching Strategy**

* Use **GitHub for version control** and maintain:
  * `main` branch
  * Feature branches: feature/signup, feature/updateProfile, feature/carViewing, feature/rentalAdUpDel, feature/rentalViewing, feature/fix-issue 
* Follow proper **commit messages** and  **pull request (PR) reviews** .

### **7. CI/CD Pipeline Setup**

* Implement a **CI/CD pipeline using GitHub Actions** to:

  * Automatically **run tests** on every commit/pull request (Optional).
  * Deploy the **backend** to **AWS** .
  * Deploy the **frontend** to **AWS**.

* **CI/CD pipeline details**
  * **CI/CD workflow:** 
  * Set up job 
  * Checkout Code                 (CI)
  * Setup Node.js                 (CI)
  * Print Env Secret              (CI, using on CI and CD)
  * Run pm2 stop all              (CD)
  * Install Backend Dependencies  (CI)
  * Install Frontend Dependencies (CI)
  * Run Backend Tests             (CI)
  * Run npm ci                    (CI)
  * Run cd./backend               (CD)
  * Run pm2 start all             (CD)
  * Run pm2 restart all           (CD)
  * Post Setup Node.js            (CI)
  * Post Checkout Code            (CI)
  * Complete job

  * **CI:** focuses on **building** (dependency Installation for Node.js) and **testing** applications
  
    * set up CI process using a **YML file**
      * Start with the defined trigger: pushes to the main branch
      * Run the defined jobs: see github/workflows/ci.yml
  * 

  * **CD: ensure automatic deployment to the server**
    
    using a **YML file** and **GitHub UI**

    * Set up **EC2 in AWS** and **GitHub self-hosted runner**
      * Instance type: t2.medium (using uni. account)
      * Use the web server **Nginx** to deploy frontend, serving **React files** 
        and as a reverse proxy for Node.js to handle requests
      * Use PM2 to manage node.js, ensuring the operation run continuosly


