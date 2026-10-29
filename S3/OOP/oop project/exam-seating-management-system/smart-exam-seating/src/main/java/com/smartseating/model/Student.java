package com.smartseating.model;

public class Student {
    private int id;
    private String registerNumber;
    private String name;
    private String departmentCode;
    private String semesterNumber;
    private String division;
    private String status;

    public Student() { }
    public Student(int id, String registerNumber, String name, String departmentCode, String semesterNumber, String division, String status) {
        this.id=id; this.registerNumber=registerNumber; this.name=name; this.departmentCode=departmentCode;
        this.semesterNumber=semesterNumber; this.division=division; this.status=status;
    }
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String value) { registerNumber = value; }
    public String getName() { return name; }
    public void setName(String value) { name = value; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String value) { departmentCode = value; }
    public String getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(String value) { semesterNumber = value; }
    public String getDivision() { return division; }
    public void setDivision(String value) { division = value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status = value; }
}
