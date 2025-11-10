# 1. Process Model (Activity Diagram)

**Activity Diagram:**

![Activity Diagram](https://github.com/user-attachments/assets/f7fe62b2-6e50-4fad-92e5-df9d18314207)

---

# 2. Behavioral Model

**Sequence Model:**

![Sequence Diagram](https://github.com/user-attachments/assets/89ef311c-744e-476a-9a68-ce13c88ed537)

---

# 3. Structural Model (Class Diagram)

The division of responsibilities among the five core classes (**User**, **Patient**, **Pharmacist**, **Prescription**, and **Inventory**) is based on the system's key functional domains: identity, safety, and operations. 

The **User** class provides a central foundation for identity management, allowing both **Patient** and **Pharmacist** subclasses to handle common access functions like `Login()` while inheriting essential user identity attributes [FR-1].  
The **Prescription** class acts as the central hub for patient safety and fulfillment, managing vital data like dosage and status, and executing critical safety checks for drug interactions and allergies [FR-3, FR-4].  
Operational resource management is handled by the **Inventory** class, which is solely responsible for tracking real-time stock levels, alerting staff to low supplies, and managing expiration dates to ensure efficiency and product validity [FR-6, FR-7].  

This separation ensures clear functional boundaries, promoting system maintainability and compliance [NFR-4].

**Class Diagram:**

<img width="772" height="744" alt="image" src="https://github.com/user-attachments/assets/1a26c21a-e078-4a87-83e1-41d458467857" />

---

# 4. Architectural Design

### NFR-2: Maintainability
- **Non-Functional Requirement:** The system shall work consistently without crashing during normal use.  
- **Design:** Use self-contained, fine-grained components that are easy to debug and modify if a crash occurs.  
- **Justification:** This design ensures that bugs are isolated within a single module, making them easier to locate and fix. It also prevents unrelated areas of the program from being affected, as modules are self-contained.

### NFR-3: Performance
- **Non-Functional Requirement:** The system shall load main pages (such as patient profile or prescription list) in a reasonable time.  
- **Design:** Localize the critical path by identifying and grouping critical elements. Ensure that patient profile and prescription logic run concurrently on the same server, using in-process calls. Utilize smaller, fine-grained components.  
- **Justification:** Placing key components in a single process eliminates network hops and serialization overhead, reducing load times. Smaller payloads further improve performance, especially on slower clients.

---

# 5. High-Level Architecture (4+1 Views)

## Hardware View

![Hardware View](https://github.com/user-attachments/assets/ec72be37-7e64-45e0-9686-6f55e1f52c88)

- This diagram shows the user's device leading into the pharmacy app, which communicates with the server.  
- Within the pharmacy app are links to objects and the database containing patient data.

## Logical View

![Logical View](https://github.com/user-attachments/assets/8ddb97f0-f6a1-49d7-8559-32b9d207f64c)

- The logical view diagram displays the main class (**Home**), which contains various methods leading to other classes like **Login**, **Signup**, and **Profile**.  
- The **Profile** class holds patient information and links to **Prescriptions** and **Refills**.  
- **Prescriptions** maintain a list of current and previous prescriptions written by the doctor.  
- **Refill** allows a patient to request or refill a prescription.

---

# 6. Use of Architectural Patterns

## Layered Architecture Pattern

**Why Chosen:**  
This pattern separates the system into different layers — for example, the presentation layer (UI), the application layer (main logic), and the data layer (database). This makes the system easier to update later without requiring a complete rebuild. Each layer handles its own job, which keeps the code organized and easier to fix if something goes wrong.

**Strength:**  
Easy to maintain: If we change one part, like updating the UI or the database, it doesn’t break the rest of the system. This helps when adding new features such as delivery tracking or billing.

**Limitation:**  
Slight performance slowdown: Since the system must pass data between multiple layers, it may experience a slight slowdown for tasks such as live inventory checks.

---

## Client-Server Architecture Pattern

**Why Chosen:**  
Our system works best with a client-server setup. All users (patients, pharmacists, doctors, and delivery staff) use the app or website (the client), which connects to a main server. The server stores all the data and handles important tasks like managing prescriptions, checking interactions, and sending notifications.

**Strength:**  
Centralized and consistent: Since everything goes through one server, data stays secure and up to date for everyone.

**Limitation:**  
Needs internet connection: If the network is slow or goes down, users might have trouble viewing or updating information in real time.
