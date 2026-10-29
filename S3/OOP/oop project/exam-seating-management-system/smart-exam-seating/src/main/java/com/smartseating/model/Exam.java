package com.smartseating.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Exam {
    private int id;
    private String name;
    private String type;
    private LocalDate date;
    private LocalTime startTime;
    private int durationMinutes;
    private String subject;
    private String academicYear;
    private String status;
    public Exam() { }
    public Exam(int id, String name, String type, LocalDate date, LocalTime startTime, int durationMinutes, String subject, String academicYear, String status) {
        this.id=id; this.name=name; this.type=type; this.date=date; this.startTime=startTime; this.durationMinutes=durationMinutes; this.subject=subject; this.academicYear=academicYear; this.status=status;
    }
    public int getId() { return id; }
    public void setId(int value) { id=value; }
    public String getName() { return name; }
    public void setName(String value) { name=value; }
    public String getType() { return type; }
    public void setType(String value) { type=value; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate value) { date=value; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime value) { startTime=value; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int value) { durationMinutes=value; }
    public String getSubject() { return subject; }
    public void setSubject(String value) { subject=value; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String value) { academicYear=value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status=value; }
    @Override public String toString() { return name + " | " + date; }
}
