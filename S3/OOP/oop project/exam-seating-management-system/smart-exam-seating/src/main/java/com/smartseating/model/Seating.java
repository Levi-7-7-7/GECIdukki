package com.smartseating.model;

public class Seating {
    private int id, examId, studentId, roomId, columnNumber, invigilatorId;
    private String rowLabel, seatNumber;
    private String registerNumber, studentName, departmentCode, semesterNumber, roomNumber, invigilatorName;
    public int getId() { return id; }
    public void setId(int value) { id=value; }
    public int getExamId() { return examId; }
    public void setExamId(int value) { examId=value; }
    public int getStudentId() { return studentId; }
    public void setStudentId(int value) { studentId=value; }
    public int getRoomId() { return roomId; }
    public void setRoomId(int value) { roomId=value; }
    public int getColumnNumber() { return columnNumber; }
    public void setColumnNumber(int value) { columnNumber=value; }
    public int getInvigilatorId() { return invigilatorId; }
    public void setInvigilatorId(int value) { invigilatorId=value; }
    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String value) { rowLabel=value; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String value) { seatNumber=value; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String value) { registerNumber=value; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String value) { studentName=value; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String value) { departmentCode=value; }
    public String getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(String value) { semesterNumber=value; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String value) { roomNumber=value; }
    public String getInvigilatorName() { return invigilatorName; }
    public void setInvigilatorName(String value) { invigilatorName=value; }
}
