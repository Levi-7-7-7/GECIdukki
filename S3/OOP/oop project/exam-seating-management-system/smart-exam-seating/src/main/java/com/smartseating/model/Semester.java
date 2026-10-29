package com.smartseating.model;

public class Semester {
    private int id;
    private String number;
    private String academicYear;
    private String status;
    public Semester() { }
    public Semester(int id, String number, String academicYear, String status) { this.id=id; this.number=number; this.academicYear=academicYear; this.status=status; }
    public int getId() { return id; }
    public void setId(int value) { id=value; }
    public String getNumber() { return number; }
    public void setNumber(String value) { number=value; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String value) { academicYear=value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status=value; }
    @Override public String toString() { return number + " (" + academicYear + ")"; }
}
