# PROJECT DELIVERABLE 1 -- TEAM 10

## 1. Project Overview

Our project is the creation of a Pharmacy Patient Management System that will serve as the central hub for digital pharmacy operations. Instead of only tracking prescriptions, the system will focus on streamlining patient care and administrative workflows. Key features will include prescription and dosage management, automated patient updates such as reminders for pickups and appointments, and tools for caregivers or doctors to securely access authorized patient information. The system will also check for potential conflicts between medications and support accessibility through multilingual options and features for individuals with disabilities.

On the operations side, the system will help manage pharmacy inventory more effectively. This will involve monitoring stock levels in real time, sending alerts when supplies run low, and tracking expiration dates to ensure only valid prescriptions are distributed. Additional functions may include support for deliveries and billing to make the overall process smoother for both pharmacies and patients. By combining these features, the project aims to improve both patient safety and efficiency in digital pharmacy management.

### PLAN FOR DEVELOPMENT 
For development, we will primarily use a plan-driven approach with limited Agile elements. We believe a structured plan is important to ensure compliance, security, and clear direction, but we also want to allow for some flexibility in case requirements change or improvements are needed.

## 2. Stakeholders

Name/Role            | What they want from the system
---------------------|-----------------------------------------------------------------------------------------------
Patients             | Easy refills, clear dosage schedules, reminders (SMS/email/app), safe drug–drug interaction checks, accessible & multilingual UI, delivery status.
Pharmacists          | Fast patient lookup, e-prescription intake/verification, interaction/contraindication flags, queue management, counseling notes, inventory visibility, audit trails.
Pharmacy Technicians | Simple workflow for filling/labeling, pick/pack/ship, task queues, barcode checks, low-stock alerts.
Pharmacy Owner       | Compliance, operational dashboards, staff workload views, shrink/expiry controls, billing/revenue reports, SLA metrics.
Prescribers (doctors)| Send/track e-prescriptions, see fulfillment status, receive safety flags, secure messaging to pharmacy.
Caregivers/Guardians | View schedules, adherence updates, alerts, pickup/delivery status.
Delivery Team        | Route lists, proof of delivery, ID verification, failed-delivery flow.
Finance/Billing      | Accurate invoicing, payment reconciliation, refunds, patient statements.

## 3. Requirements Elicitation

### GATHERING REQUIREMENTS
* Stakeholder interviews (pharmacists, techs, manager, 1–2 prescribers, 4–6 patients).
* Short survey for patients (5–10 questions via Google Form/Qualtrics).
* Brainstorming workshops with the group.

### DRAFT QUESTIONNAIRE
* As a patient, how do you prefer reminders? (SMS / Email / App / Multiple)
* What’s the most confusing part of managing your medications today?
* Have you ever had to resolve a drug interaction or allergy issue at pickup? What happened?
* As pharmacy staff, which steps consume the most time during rush hours?
* What inventory problems cause delays (stockouts, expiries, etc.)?
* For deliveries, what causes most failures (address, ID, timing)?

### ORGANIZING REQUIREMENTS
1. Interface (UI/UX & Accessibility)
2. Functionality (Patient/Prescription/Inventory/Delivery/Billing)
3. Integration (messaging)
5. Operations (Performance, reliability, monitoring, backups)

## 4. Requirements Specification

### FUNCTIONAL REQUIREMENTS  **FR == Functional Requirements**
Patient & Access
- **FR-1** The system shall allow patients to create accounts and verify identity.

Prescriptions & Safety
- **FR-2** The system shall store electronic prescriptions
- **FR-3** The system shall check for drug–drug interactions and allergies
- **FR-4** The system shall maintain patient medication profiles and history, searchable by staff.


Notifications & Communication
- **FR-5** The system shall send reminders for appointments, pickups, refills, and daily doses via SMS, email, and in-app notifications.

Inventory & Fulfillment
- **FR-6** The system shall track real-time stock levels 
- **FR-7** The system shall alert staff for low stock thresholds and upcoming expirations.
- **FR-8** The system shall support pick/pack/label workflows and queue management.

Delivery
- **FR-9** The system shall record proof of delivery (timestamp, code) or failed-delivery reason.

Billing & Claims
- **FR-10** The system shall generate patient invoices and accept payments (card or approved methods).

### NON-FUNCTIONAL REQUIREMENTS **NFR == Non-functional Requirements** 
- **NFR-1 Usability**: The system shall be easy for patients and staff to navigate, with clear menus and labels. (Supports FR-1: account creation, FR-6: inventory lookup)
- **NFR-2 Reliability**: The system shall work consistently without crashing during normal use. (Supports FR-4: prescription storage, FR-6-8: stock tracking)
- **NFR-3 Performance**: The system shall load main pages (such as patient profile or prescription list) in a reasonable time for normal users. (Supports FR-4: patient history)
- **NFR-4 Maintainability**: The system shall be written in a way that future developers can update or fix it without needing to rebuild everything. (Supports all FRs)


### REQUIREMENTS IN TWO FORMATS

* A) Text-Based (Tabular Format)

| ID    | Requirement (Shall)                                                                                  | Type             |
|-------|-------------------------------------------------------------------------------------------------------|------------------|
| FR-1  | The system shall allow patients to create accounts and verify identity.                               | Functional       |
| FR-2  | The system shall store electronic prescriptions.                                                      | Functional       |
| FR-3  | The system shall check for drug–drug interactions and allergies.                                      | Functional       |
| FR-4  | The system shall maintain patient medication profiles and history, searchable by staff.               | Functional       |
| FR-5  | The system shall send reminders for appointments, pickups, refills, and daily doses.                  | Functional       |
| FR-6  | The system shall track real-time stock levels.                                                        | Functional       |
| FR-7  | The system shall alert staff for low stock thresholds and upcoming expirations.                       | Functional       |
| FR-8  | The system shall support pick/pack/label workflows and queue management.                              | Functional       |
| FR-9  | The system shall record proof of delivery (timestamp, code) or failed-delivery reason.                 | Functional       |
| FR-10 | The system shall generate patient invoices and accept payments (card or approved methods).            | Functional       |
| NFR-1 | The system shall be easy for patients and staff to navigate, with clear menus and labels.              | Non-Functional   |
| NFR-2 | The system shall work consistently without crashing during normal use.                                | Non-Functional   |
| NFR-3 | The system shall load main pages (such as patient profile or prescription list) in a reasonable time. | Non-Functional   |
| NFR-4 | The system shall be written in a way that future developers can update or fix it easily.              | Non-Functional   |

* B) Diagram

<img width="1882" height="850" alt="image" src="https://github.com/user-attachments/assets/95aacf1b-b1fb-46c4-9a51-08a2a1836c5c" />

## 5. Conflict Resolution
A possible conflict in our system could be between **NFR-1 (Usability: making the system simple and easy to navigate)** and **FR-3 (Checking for drug–drug interactions and allergies)**.  
To make the system very user-friendly, the interface should be simple with minimal pop-ups or interruptions. However, safety checks for interactions and allergies may require alerts, warnings, or extra confirmation screens, which can make the system feel slower or more complicated for users.  

Our team would resolve this conflict by **prioritizing patient safety over simplicity**, but designing the alerts in a way that is clear and not overwhelming. For example, only high-risk issues would trigger a pop-up, while less critical information could appear in a sidebar or info panel. This balances safety requirements with usability so that the system remains both safe and user-friendly.


## 6. Requirements Validation
To check that our requirements are correct, we will use a mix of **reviews, prototyping, and test cases**.  
- **Reviews:** Go through the requirements with our project team and compare them to stakeholder needs (patients, pharmacists, staff).  
- **Prototyping:** Build simple mockups of key features like inventory alerts to confirm that they match expectations.  
- **Test Cases:** Write small scenarios to see if requirements can be tested directly (ex: “Does the system send an SMS reminder for a pickup?”).  

### Validation by Requirement Set

**Functional Requirements (FRs)**  
- **Verifiability:** Each FR can be tested (ex: try logging in for FR-1, add a prescription and check history for FR-4).  
- **Comprehensibility:** They are written in plain language (“The system shall…”), so they are easy to understand.  
- **Traceability:** Each FR ties back to a clear need from patients, pharmacists, or staff (stakeholders).  
- **Adaptability:** If workflows change (like adding delivery options), we can adjust FRs without rewriting the entire system.  

**Non-Functional Requirements (NFRs)**  
- **Verifiability:** Qualities like usability or reliability can be tested through user feedback and simple stress tests.  
- **Comprehensibility:** They are broad but understandable (“easy to navigate,” “work consistently”), which avoids confusion.  
- **Traceability:** Each NFR connects to at least one FR (ex: NFR-1 usability supports FR-1 account creation).  
- **Adaptability:** NFRs are flexible — for example, if performance expectations change, we can adjust them without removing features.  
