# 🏡 Buyer Lead Intake App

A **mini CRM-style app** to capture, list, and manage **buyer leads** with validation, search/filter, and CSV import/export.  
Built with **Next.js (App Router)**, **TypeScript**, **Prisma**, and **PostgreSQL**.

---

## ✨ Features

- ✅ **Authentication** – simple demo login / magic link  
- ✅ **Create Buyer Lead** with validation (Zod, client + server)  
- ✅ **List & Search** with filters, pagination (SSR, page size 10), and debounced search  
- ✅ **View & Edit Buyer** with concurrency check (`updatedAt`)  
- ✅ **History Tracking** – last 5 changes with old → new values  
- ✅ **CSV Import** (max 200 rows, full validation, transactional insert)  
- ✅ **CSV Export** – respects filters/search/sort  
- ✅ **Ownership rules** – users can edit/delete only their own leads  
- ✅ **Error boundaries + empty states** for better UX  
- ✅ **Accessibility basics** – labels, keyboard focus, form errors announced  
- ❌ **Unit tests** – planned (budget validator / CSV row validator)  

---

## 🛠️ Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Prisma ORM](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/)  
- [Zod](https://zod.dev/) for validation  
- [Tailwind CSS](https://tailwindcss.com/) for styling  

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone [https://github.com/your-username/buyer-lead-intake.git](https://github.com/Iftekhar19/buyer-lead-intake.git)
cd buyer-lead-intake

### 2. Install dependencies
```bash
npm install

### 3. Setup environment variables
```bash
DATABASE_URL="paset your postgresql url (local or neon db)"








