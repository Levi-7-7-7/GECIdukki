package com.smartseating.model;

public class Department {
    private int id;
    private String code;
    private String name;
    private String status;
    public Department() { }
    public Department(int id, String code, String name, String status) { this.id=id; this.code=code; this.name=name; this.status=status; }
    public int getId() { return id; }
    public void setId(int id) { this.id=id; }
    public String getCode() { return code; }
    public void setCode(String value) { code=value; }
    public String getName() { return name; }
    public void setName(String value) { name=value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status=value; }
    @Override public String toString() { return code + " - " + name; }
}
