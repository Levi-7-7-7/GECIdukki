package com.smartseating.model;

public class Teacher {
    private int id;
    private String name;
    private String departmentCode;
    private String designation;
    private String phone;
    private String status;
    public Teacher() { }
    public Teacher(int id, String name, String departmentCode, String designation, String phone, String status) { this.id=id; this.name=name; this.departmentCode=departmentCode; this.designation=designation; this.phone=phone; this.status=status; }
    public int getId() { return id; }
    public void setId(int value) { id=value; }
    public String getName() { return name; }
    public void setName(String value) { name=value; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String value) { departmentCode=value; }
    public String getDesignation() { return designation; }
    public void setDesignation(String value) { designation=value; }
    public String getPhone() { return phone; }
    public void setPhone(String value) { phone=value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status=value; }
    @Override public String toString() { return name + " (" + departmentCode + ")"; }
}
