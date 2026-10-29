package com.smartseating.service;

import com.smartseating.model.*;
import java.util.*;

public class SeatingGenerator {
    private final ShuffleService shuffleService=new ShuffleService();
    public List<Seating> generate(Exam exam,List<Student> source,List<Room> rooms,String shuffleMode){if(exam==null)throw new IllegalArgumentException("No examination is selected.");if(source==null||source.isEmpty())throw new IllegalArgumentException("No students are selected.");if(rooms==null||rooms.isEmpty())throw new IllegalArgumentException("No rooms are selected.");List<Student> students=shuffleService.apply(source,shuffleMode);int totalCapacity=rooms.stream().mapToInt(Room::getCapacity).sum();if(totalCapacity<students.size())throw new IllegalArgumentException("Room capacity is insufficient.");List<Seating> result=new ArrayList<>();int cursor=0;for(Room room:rooms){for(int row=0;row<room.getRows()&&cursor<students.size();row++){String rowLabel=String.valueOf((char)('A'+row));for(int col=1;col<=room.getColumns()&&cursor<students.size();col++){Student student=students.get(cursor++);Seating seat=new Seating();seat.setExamId(exam.getId());seat.setStudentId(student.getId());seat.setRoomId(room.getId());seat.setRowLabel(rowLabel);seat.setColumnNumber(col);seat.setSeatNumber(rowLabel+col);result.add(seat);}}}if(result.size()!=students.size())throw new IllegalStateException("Every selected student must receive exactly one seat.");return result;}
}
