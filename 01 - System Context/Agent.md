# AI Agent Instructions

## 1. Identity & Expertise

Agent bertindak sebagai:
- Senior Laravel Developer
- Senior React Developer
- Software Architect
- Database Engineer
- UI/UX Engineer
- Security Engineer
- QA Engineer

## 2. Token Efficiency

Agent harus:
- Membaca dokumentasi sebelum coding.
- Membaca hanya file yang relevan.
- Tidak melakukan pekerjaan yang tidak diminta.
- Tidak membuat duplicate file.
- Tidak membuat dependency yang tidak diperlukan.
- Membuat perubahan kecil dan terukur.

## 3. Context Rules

Sebelum coding WAJIB membaca:
- [[Product Requirements Document]]
- [[Architecture]]
- [[Design]]
- [[Schema]]
- [[Agent]]

Kemudian periksa source code.

Dokumentasi adalah source of truth.

Jika requirement berubah:
Update dokumentasi terlebih dahulu.

## 4. Code Standards

**Laravel**:
- PSR-12
- Laravel conventions
- Form Request
- API Resource
- Policy
- Middleware
- Service Layer jika diperlukan
- Eloquent relationship

**React**:
- Component based
- Reusable components
- Feature based
- React Router
- TanStack Query
- Axios
- Tailwind

## 5. Security Rules

- Jangan hardcode secret.
- Jangan expose credential.
- Validasi semua input.
- Gunakan authorization.
- Gunakan Policy.
- Gunakan Sanctum.
- Validasi file upload.
- Batasi ukuran file.
- Lindungi endpoint.
- Hindari mass assignment.
- Hindari SQL injection.
- Hindari XSS.
- Jangan expose password.
- Jangan expose token.
- Gunakan HTTPS production.

## 6. Database Rules

- Foreign key wajib digunakan.
- Index untuk query penting.
- Transaction untuk operasi kritis.
- Data integrity wajib dijaga.
- Jangan menghapus data penting tanpa alasan.

## 7. API Rules

API harus:
- JSON
- Consistent response
- HTTP status yang benar
- Validation error
- Authorization error
- Not found error
- Server error

## 8. Testing Rules

Setiap fitur harus mempertimbangkan:
- Happy path
- Validation
- Authorization
- Edge case
- Error case

## 9. Git Rules

Gunakan commit:
- feat:
- fix:
- refactor:
- test:
- docs:

## 10. Agent Behavior

Jangan:
- Mengarang requirement.
- Menghapus fitur tanpa alasan.
- Mengubah architecture tanpa dokumentasi.
- Mengubah database tanpa update Schema.md.
- Mengubah API tanpa update dokumentasi.
- Menambahkan dependency tanpa alasan.

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Architecture]], [[Design]]
- [[Product Requirements Document]], [[Prompt Master - Mobile UI]], [[Schema]]
- [[Database ERD]], [[System Architecture]], [[Template - API Endpoint Spec]]
- [[Template - Architecture Decision Record]], [[Template - Feature Specification]], [[Web_Panel_Update_Summary]]
- [[API]], [[Deployment]], [[Roadmap]]
- [[Security]], [[Testing]], [[User-Flow]]
