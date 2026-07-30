# Database Schema

StudentOS AI uses MongoDB with Mongoose for Object Data Modeling (ODM).

## 1. User (`User.js`)
Stores authentication data and basic profile information.
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `branch` (String)
- `semester` (Number)
- `role` (String, enum: ['student', 'admin'], default: 'student')
- `timestamps` (createdAt, updatedAt)

## 2. Attendance (`Attendance.js`)
Tracks course attendance.
- `user` (ObjectId, ref: 'User')
- `subject` (String, required)
- `totalClasses` (Number, default: 0)
- `attendedClasses` (Number, default: 0)
- `percentage` (Number, computed before save)

## 3. Semester (`Semester.js`)
Stores SGPA and credit data for CGPA calculation.
- `user` (ObjectId, ref: 'User')
- `semester` (Number, required)
- `sgpa` (Number, required)
- `credits` (Number, required)

## 4. Task (`Task.js`)
Planner tasks and assignments.
- `user` (ObjectId, ref: 'User')
- `title` (String, required)
- `subject` (String)
- `type` (String, enum: ['Task', 'Assignment', 'Exam'])
- `priority` (String, enum: ['Low', 'Medium', 'High'])
- `status` (String, enum: ['Pending', 'Completed'], default: 'Pending')
- `dueDate` (Date, required)

## 5. CodingProfile (`CodingProfile.js`)
Tracks algorithmic problem-solving progress.
- `user` (ObjectId, ref: 'User', unique)
- `stats` (Object: { `easy`, `medium`, `hard` })
- `topics` (Object: arrays, strings, trees, graphs, etc.)
- `platforms` (Object: leetcode, hackerrank)
- `streak` (Number)

## 6. PlacementPrep (`PlacementPrep.js`)
Milestone tracking for campus placement readiness.
- `user` (ObjectId, ref: 'User', unique)
- `dsa` (Object of Booleans)
- `coreSubjects` (Object of Booleans)
- `aptitude` (Object of Booleans)
- `portfolio` (Object of Booleans)

## 7. Fee (`Fee.js`)
Tracks student fees and payment history.
- `student` (ObjectId, ref: 'User')
- `semester` (Number, required)
- `totalAmount` (Number, required)
- `paidAmount` (Number, default: 0)
- `dueDate` (Date, required)
- `description` (String)
- `status` (String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending')
- `payments` (Array of objects: date, amount, method, receiptNumber)

## 8. Exam (`Exam.js`)
Examination scheduling and timetable.
- `title` (String, required)
- `type` (String, enum: ['Internal', 'External'])
- `semester` (Number, required)
- `branch` (String, required)
- `startDate` (Date)
- `endDate` (Date)
- `subjects` (Array of objects: subject ObjectId, date, startTime, endTime, room, maxMarks)
- `status` (String, enum: ['Scheduled', 'Ongoing', 'Completed'])

## 9. Result (`Result.js`)
Comprehensive student academic performance records.
- `student` (ObjectId, ref: 'User')
- `semester` (Number, required)
- `exam` (ObjectId, ref: 'Exam')
- `subjects` (Array of objects: subject ObjectId, internalMarks, externalMarks, totalMarks, grade, passed)
- `sgpa` (Number)
- `cgpa` (Number)
- `status` (String, enum: ['Pass', 'Fail', 'Pending'])

## 10. ActivityLog (`ActivityLog.js`)
System audit logging for enterprise security.
- `user` (ObjectId, ref: 'User')
- `action` (String, required)
- `entity` (String, required)
- `entityId` (ObjectId)
- `details` (Object)
- `ipAddress` (String)
