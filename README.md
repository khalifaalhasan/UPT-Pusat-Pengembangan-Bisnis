# 🏢 Business Development Center

### Modern Booking Platform

A modern business asset reservation system inspired by the seamless booking flow of **Traveloka**.  
Supports **Down Payment / Full Payment**, real-time admin verification, and **QR-Based E‑Ticketing**.

---

<div align="center">

### 🚀 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![Shadcn](https://img.shields.io/badge/UI-Shadcn/ui-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

## 🌟 Key Features

### 👤 User Features

- **Traveloka‑Style Booking Flow**  
  Choose Date → Fill Details → Make Payment

- **Smart Calendar**  
  - Blocks *Pending* & *Confirmed* dates  
  - Supports Daily & Hourly rentals

- **Flexible Payment**  
  - Full Payment / 50% Down Payment  
  - Prevents double payments

- **User Dashboard**  
  - Real‑time status updates  
  - Upload payment proof  
  - Booking history

- **Wishlist** to save preferred services  
- **Form Persistence** using localStorage  
- **E‑Ticket (PDF) + QR Code** activated upon payment completion

---

### 🛡️ Admin Features

- Management Dashboard  
- Verify Payments (Approve / Reject)  
- CRUD Services + Multiple Image Upload  
- Dynamic Spec (JSONB)  
- Auto‑Generated Slug URL  
- Built‑in QR Scanner (Camera Support)

---

## 🛠️ Technologies Used

| Category          | Technology                   |
| ----------------- | ----------------------------- |
| Framework         | Next.js 15 (App Router)      |
| Language          | TypeScript                   |
| Database & Auth   | Supabase (PostgreSQL)        |
| UI                | TailwindCSS + Shadcn/ui      |
| Forms             | React Hook Form + Zod        |
| Date Utilities    | Date-fns + React-day-picker  |
| PDF Renderer      | @react-pdf/renderer          |
| QR Scanner        | @yudiel/react-qr-scanner     |
| Notifications     | Sonner Toast                 |

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/project.git
cd project
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a **.env.local** file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4️⃣ Configure Supabase Database

Ensure the following tables exist:

- profiles  
- categories  
- services  
- bookings  
- payments  
- saved_services  

**Include required triggers & payment status functions.**

### 5️⃣ Run Development Server

```bash
npm run dev
```

Open in browser:  
👉 http://localhost:3000

---

## 📂 Project Directory Structure

```
app/
 ├── (main)/
 │    ├── services/
 │    ├── book/
 │    ├── dashboard/
 ├── (admin)/
 │    ├── bookings/
 │    ├── services/
 │    ├── scan/
 ├── (checkout)/
 │    ├── payment/
 ├── layout.tsx
```

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center">
      <img src="public/images/image.png" width="300" />
    </td>
    <td align="center">
      <img src="public/images/image1.png" width="300" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/images/image2.png" width="300" />
    </td>
    <td align="center">
      <img src="public/images/image3.png" width="300" />
    </td>
  </tr>
</table>

---

## 🤝 Contributing

### 1️⃣ Fork the Repository  
### 2️⃣ Create a New Branch

```bash
git checkout -b new-feature
```

### 3️⃣ Commit Your Changes

```bash
git commit -m "Add new feature"
```

### 4️⃣ Push the Branch

```bash
git push origin new-feature
```

### 5️⃣ Open a Pull Request

---

## 📄 License

This project is released under the **MIT License**.  
See the `LICENSE` file for more details.

---

<div align="center">

⭐ **If you like this project, consider giving it a Star!** ⭐

</div>
