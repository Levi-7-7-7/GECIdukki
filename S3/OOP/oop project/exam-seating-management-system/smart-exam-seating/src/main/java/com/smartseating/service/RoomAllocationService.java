package com.smartseating.service;

import com.smartseating.model.Room;
import java.util.*;

public class RoomAllocationService {
    public List<Room> automatic(List<Room> available,int studentCount){if(studentCount<=0)throw new IllegalArgumentException("No students are selected.");List<Room> sorted=new ArrayList<>(available);sorted.sort(Comparator.comparing(Room::getRoomNumber));List<Room> selected=new ArrayList<>();int capacity=0;for(Room room:sorted){selected.add(room);capacity+=room.getCapacity();if(capacity>=studentCount)break;}if(capacity<studentCount)throw new IllegalArgumentException("Available room capacity is insufficient for the selected students.");return selected;}
    public void validateManual(List<Room> selected,int studentCount){if(selected.isEmpty())throw new IllegalArgumentException("Select at least one room.");int capacity=selected.stream().mapToInt(Room::getCapacity).sum();if(capacity<studentCount)throw new IllegalArgumentException("Selected room capacity is insufficient for the selected students.");}
    public int capacity(List<Room> rooms){return rooms.stream().mapToInt(Room::getCapacity).sum();}
    public int requiredRooms(int students,int seatsPerRoom){if(students<=0||seatsPerRoom<=0)return 0;return (students+seatsPerRoom-1)/seatsPerRoom;}
}
