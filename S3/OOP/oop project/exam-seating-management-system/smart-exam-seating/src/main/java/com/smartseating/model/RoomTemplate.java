package com.smartseating.model;

public class RoomTemplate {
    private int id;
    private String templateName;
    private String startingRoom;
    private int numberOfRooms;
    private int rows;
    private int columns;
    private String building;
    private int floor;
    public RoomTemplate() { }
    public RoomTemplate(int id, String templateName, String startingRoom, int numberOfRooms, int rows, int columns, String building, int floor) {
        this.id=id; this.templateName=templateName; this.startingRoom=startingRoom; this.numberOfRooms=numberOfRooms; this.rows=rows; this.columns=columns; this.building=building; this.floor=floor;
    }
    public int getId() { return id; }
    public void setId(int value) { id=value; }
    public String getTemplateName() { return templateName; }
    public void setTemplateName(String value) { templateName=value; }
    public String getStartingRoom() { return startingRoom; }
    public void setStartingRoom(String value) { startingRoom=value; }
    public int getNumberOfRooms() { return numberOfRooms; }
    public void setNumberOfRooms(int value) { numberOfRooms=value; }
    public int getRows() { return rows; }
    public void setRows(int value) { rows=value; }
    public int getColumns() { return columns; }
    public void setColumns(int value) { columns=value; }
    public String getBuilding() { return building; }
    public void setBuilding(String value) { building=value; }
    public int getFloor() { return floor; }
    public void setFloor(int value) { floor=value; }
    @Override public String toString() { return templateName + " - " + rows * columns + " Seats"; }
}
