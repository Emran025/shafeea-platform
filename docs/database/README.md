# Database Documentation

This document provides a comprehensive overview of the database schema, migrations, Eloquent models, and their relationships for the Taj Al Waqar project.

---

## Table of Contents
- [Users](#users)
- [Students](#students)
- [Teachers](#teachers)
- [Halaqahs](#halaqahs)
- [Enrollments](#enrollments)
- [Halaqah Notes](#halaqah-notes)
- [Halaqah Schedules](#halaqah-schedules)
- [Student Reports](#student-reports)
- [Trackings](#trackings)
- [Tracking Details](#tracking-details)
- [Tracking Units](#tracking-units)
- [Units](#units)
- [Frequency Types](#frequency-types)
- [Admins](#admins)
- [Personal Access Tokens](#personal-access-tokens)
- [Telescope Entries](#telescope-entries)
- [Cache](#cache)
- [Jobs](#jobs)
- [Sessions](#sessions)
- [Password Reset Tokens](#password-reset-tokens)

---

## users
**Fields:**
- id, name, email, email_verified_at, password, avatar, phone, phone_zone, whatsapp, whatsapp_zone, gender, birth_date, country, city, residence, status, school_id, remember_token, timestamps, softDeletes

**Model (`User`):**
- **$fillable:** All above except id, remember_token, timestamps, softDeletes
- **Relationships:**
  - `student()` → hasOne(Student)
  - `teacher()` → hasOne(Teacher)
  - `admin()` → hasOne(Admin)
  - `school()` → belongsTo(School)
  - `roles()` → belongsToMany(Role)
  - `permissions()` → belongsToMany(Permission)

---

## students
**Fields:**
- id, user_id (unique, FK), qualification, memorization_level, status, timestamps, softDeletes

**Model (`Student`):**
- **$fillable:** user_id, qualification, memorization_level, status
- **Relationships:**
  - `user()` → belongsTo(User)
  - `enrollments()` → hasMany(Enrollment)
  - `reports()` → hasMany(StudentReport)

---

## teachers
**Fields:**
- id, user_id (unique, FK), bio, experience_years, timestamps, softDeletes

**Model (`Teacher`):**
- **$fillable:** user_id, bio, experience_years
- **Relationships:**
  - `user()` → belongsTo(User)
  - `halaqahs()` → hasMany(Halaqah)

---

## halaqahs
**Fields:**
- id, name, avatar, gender, residence, max_students, sum_of_students, is_active, is_deleted, teacher_id (FK), school_id (FK), timestamps, softDeletes

**Model (`Halaqah`):**
- **$fillable:** name, avatar, gender, residence, max_students, sum_of_students, is_active, is_deleted, teacher_id, school_id
- **Relationships:**
  - `school()` → belongsTo(School)
  - `teacher()` → belongsTo(Teacher)
  - `schedules()` → hasMany(HalaqahSchedule)
  - `notes()` → hasMany(HalaqahNote)
  - `enrollments()` → hasMany(Enrollment)

---

## enrollments
**Fields:**
- id, student_id (FK), halaqah_id (FK), enrolled_at, plan_id (FK), timestamps

**Model (`Enrollment`):**
- **$fillable:** student_id, halaqah_id, enrolled_at, plan_id
- **Relationships:**
  - `student()` → belongsTo(Student)
  - `halaqah()` → belongsTo(Halaqah)
  - `plan()` → belongsTo(Plan)

---

## halaqah_notes
**Fields:**
- id, halaqah_id (FK), admin_id (FK), note, timestamps

**Model (`HalaqahNote`):**
- **$fillable:** halaqah_id, admin_id, note
- **Relationships:**
  - `halaqah()` → belongsTo(Halaqah)
  - `admin()` → belongsTo(Admin)

---

## halaqah_schedules
**Fields:**
- id, halaqah_id (FK), day_of_week, start_time, end_time, timestamps

**Model (`HalaqahSchedule`):**
- **$fillable:** halaqah_id, day_of_week, start_time, end_time
- **Relationships:**
  - `halaqah()` → belongsTo(Halaqah)

---

## student_reports
**Fields:**
- id, student_id (FK), report_date, summary, details (json), timestamps

**Model (`StudentReport`):**
- **$fillable:** student_id, halaqah_id, date, attendance, behavior, notes, created_by
- **Relationships:**
  - `student()` → belongsTo(Student)
  - `halaqah()` → belongsTo(Halaqah)
  - `creator()` → belongsTo(User, 'created_by')

---

## trackings
**Fields:**
- id, plan_id (FK), date, note, behavior_note, timestamps

**Model (`Tracking`):**
- **$fillable:** plan_id, date, note, behavior_note
- **Relationships:**
  - `plan()` → belongsTo(Plan)
  - `details()` / `trackingDetails()` → hasMany(TrackingDetail)

---

## tracking_details
**Fields:**
- id, tracking_id (FK), tracking_type_id (FK), from_tracking_unit_id (FK), to_tracking_unit_id (FK), actual_amount, comment, score, timestamps

**Model (`TrackingDetail`):**
- **$fillable:** tracking_id, tracking_type_id, from_tracking_unit_id, to_tracking_unit_id, actual_amount, comment, score
- **Relationships:**
  - `tracking()` → belongsTo(Tracking)
  - `trackingType()` → belongsTo(TrackingType)
  - `fromTrackingUnit()` → belongsTo(TrackingUnit, 'from_tracking_unit_id')
  - `toTrackingUnit()` → belongsTo(TrackingUnit, 'to_tracking_unit_id')

---

## tracking_units
**Fields:**
- id, unit_id (FK), from_surah, from_page, from_ayah, to_surah, to_page, to_ayah, timestamps

**Model (`TrackingUnit`):**
- **$fillable:** unit_id, from_surah, from_page, from_ayah, to_surah, to_page, to_ayah
- **Relationships:**
  - `unit()` → belongsTo(Unit)
  - `fromDetails()` → hasMany(TrackingDetail, 'from_tracking_unit_id')
  - `toDetails()` → hasMany(TrackingDetail, 'to_tracking_unit_id')

---

## units
**Fields:**
- id, code, name_ar, timestamps

**Model (`Unit`):**
- **$fillable:** code, name_ar
- **Relationships:**
  - `trackingUnits()` → hasMany(TrackingUnit)
  - `reviewPlans()` → hasMany(Plan, 'review_unit_id')
  - `memorizationPlans()` → hasMany(Plan, 'memorization_unit_id')
  - `sardPlans()` → hasMany(Plan, 'sard_unit_id')

---

## frequency_types
**Fields:**
- id, name, days_between, description, timestamps

**Model (`FrequencyType`):**
- **$fillable:** name, days_between, description
- **Relationships:**
  - `plans()` → hasMany(Plan)

---

## admins
**Fields:**
- id, user_id (unique, FK), super_admin, timestamps, softDeletes

**Model (`Admin`):**
- **$fillable:** user_id, super_admin
- **Relationships:**
  - `user()` → belongsTo(User)
  - `halaqahNotes()` → hasMany(HalaqahNote)

---

## personal_access_tokens
**Fields:**
- id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, timestamps

*No Eloquent model shown, but used for Laravel Sanctum authentication.*

---

## telescope_entries (and related)
**Fields:**
- telescope_entries: sequence, uuid, batch_id, family_hash, should_display_on_index, type, content, created_at
- telescope_entries_tags: entry_uuid, tag
- telescope_monitoring: tag

*No Eloquent model shown, used for Laravel Telescope debugging/monitoring.*

---

## cache, cache_locks
**Fields:**
- cache: key, value, expiration
- cache_locks: key, owner, expiration

*No Eloquent model shown, used for Laravel cache system.*

---

## jobs, job_batches, failed_jobs
**Fields:**
- jobs: id, queue, payload, attempts, reserved_at, available_at, created_at
- job_batches: id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at
- failed_jobs: id, uuid, connection, queue, payload, exception, failed_at

*No Eloquent model shown, used for Laravel queue system.*

---

## sessions
**Fields:**
id, user_id (FK), ip_address, user_agent, payload, last_activity

---

## password_reset_tokens
**Fields:**
email (PK), token, created_at

---

*For more details, see the respective migration and model files.* 