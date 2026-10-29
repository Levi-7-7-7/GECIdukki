package com.smartseating.model;

public class Room {
    private int id;
    private String roomNumber;
    private String building;
    private int floor;
    private int rows;
    private int columns;
    private int capacity;
    private String status;
    public Room() { }
    public Room(int id, String roomNumber, String building, int floor, int rows, int columns, int capacity, String status) {
        this.id=id; this.roomNumber=roomNumber; this.building=building; this.floor=floor; this.rows=rows; this.columns=columns; this.capacity=capacity; this.status=status;
    }
    public int getId() { return id; }
    public void setId(int value) { id=value; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String value) { roomNumber=value; }
    public String getBuilding() { return building; }
    public void setBuilding(String value) { building=value; }
    public int getFloor() { return floor; }
    public void setFloor(int value) { floor=value; }
    public int getRows() { return rows; }
    public void setRows(int value) { rows=value; }
    public int getColumns() { return columns; }
    public void setColumns(int value) { columns=value; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int value) { capacity=value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status=value; }
    @Override public String toString() { return roomNumber + " - " + capacity + " seats"; }
}
