# SMART EXAM SEATING ARRANGEMENT SYSTEM

A complete Java 24 Swing + MySQL JDBC application for managing internal and external examination seating. It follows a simple MVC-style layout: Swing views in `ui`, domain objects in `model`, persistence in `dao`, business rules in `service`, and shared helpers in `util`.

## Features

- Role-based login with `ADMIN` and `TEACHER` permissions.
- CRUD screens for students, departments, semesters, rooms, teachers, exams, and room templates.
- Internal/external exams with multi-department and multi-semester filters.
- Quick room setup with preview, duplicate protection, and capacity calculation.
- Automatic or manual room selection, capacity checks, and invigilator assignment.
- Eight shuffle choices, including real department-interleaving/mixing.
- Seating persistence with unique student/seat constraints and safe regeneration.
- Room charts, student seat search, attendance, invigilator duty list, capacity, and complete reports.
- Java `PrinterJob` print dialogs on every report/output view.

## Technology

Java 24, Swing, Maven, MySQL 8+, JDBC/MySQL Connector/J, PreparedStatement, and a normalized relational schema.

## Requirements

- JDK 24 (`java -version`)
- Maven 3.9+
- MySQL Server 8+
- Eclipse, IntelliJ IDEA, or NetBeans (optional)

## Database installation

1. Start MySQL.
2. Run `database/schema.sql` in MySQL Workbench or from a shell:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

   The script creates `smart_exam_seating`, all tables, constraints, sample users, 143 CSE/S3 students for the five-room demonstration, additional mixed-department students, 10 rooms, 15 teachers, and three exams.
3. The default JDBC settings are in `src/main/java/com/smartseating/util/DBConnection.java`. Override without editing source using:

   ```bash
   set SMART_SEATING_DB_URL=jdbc:mysql://localhost:3306/smart_exam_seating
   set SMART_SEATING_DB_USER=root
   set SMART_SEATING_DB_PASSWORD=your_password
   ```

   On Linux/macOS use `export` instead of `set`. System properties `-Ddb.url`, `-Ddb.user`, and `-Ddb.password` take precedence.

## Build and run

From the `smart-exam-seating` directory:

```bash
mvn clean package
mvn exec:java
```

The executable JAR is also created in `target/smart-exam-seating-1.0.0.jar`; run it with `java -jar` after setting the database variables.

### Eclipse

Import the folder as **Existing Maven Project**, wait for Maven dependencies, then run `com.smartseating.Main` as a Java Application.

### IntelliJ IDEA

Open the `smart-exam-seating` folder, choose **Open as Project**, allow Maven import, and run `com.smartseating.Main`.

### NetBeans

Choose **File → Open Project**, select the Maven project, then use **Run Project**.

## Default credentials

- Admin: `admin` / `admin123`
- Teacher: `teacher` / `teacher123`

The admin can modify master data, users are authenticated from MySQL, and teachers cannot access destructive master-data actions.

## How to use the demonstration

1. Log in as admin or teacher.
2. Open **Generate Seating** and choose **Internal Examination - S3**.
3. Choose **Department Mixing** and **Automatic** rooms. The seeded CSE/S3 data selects 143 students, uses rooms 101–105, reports capacity 150 and seven empty seats.
4. Generate. The system deletes the old arrangement only after confirmation, applies the selected shuffle algorithm, assigns seats row-by-row, and saves each assignment with an invigilator.
5. Open **Search Seat**, enter `24CS023`, and print the student result. The generated room/seat is calculated from the saved assignment rather than hardcoded.
6. Use the result view for room chart, attendance, invigilator list, and complete report printing.
7. For an external exam, select the seeded mixed exam and choose **Department Mixing**; CSE, ECE, and EEE records are interleaved while preserving every student exactly once.

## Printing

Every report window uses `com.smartseating.service.PrintService`, which creates a `PrinterJob`, formats a college heading, report title, generated timestamp, wrapped content, page number, and signature footer, and opens the native printer dialog. No report is printed through console output.

## Project layout

```text
src/main/java/com/smartseating/
  Main.java
  model/       domain objects
  dao/         PreparedStatement persistence classes
  service/     shuffling, allocation, generation, reporting, printing
  util/        JDBC, validation, dates, Swing styling
  ui/          login, dashboard, CRUD and report frames
```

## Troubleshooting

- **Communications link failure:** confirm MySQL is running, port 3306 is open, and the URL/user/password are correct.
- **Unknown database:** run `database/schema.sql` first.
- **Duplicate key:** use a new register/room/template name; the UI also validates duplicates before saving.
- **Capacity low:** select more available rooms or use automatic allocation.
- **No print dialog:** configure a system printer; Java PrinterJob reports a clear error if no print service exists.
- **Old seating:** use **Regenerate Seating** or the admin-only **Clear Existing Seating** confirmation for the selected exam.

## Screenshots

Add project screenshots here when demonstrating locally: `docs/login.png`, `docs/dashboard.png`, `docs/seating-result.png`, and `docs/room-chart.png`.
