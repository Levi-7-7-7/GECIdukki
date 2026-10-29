package com.smartseating.service;

import com.smartseating.dao.*;
import com.smartseating.model.*;
import java.sql.SQLException;
import java.util.*;

public class ExamService {
    private final StudentDAO studentDAO=new StudentDAO();
    private final RoomDAO roomDAO=new RoomDAO();
    private final SeatingDAO seatingDAO=new SeatingDAO();
    private final InvigilatorDAO invigilatorDAO=new InvigilatorDAO();
    private final ExamDAO examDAO=new ExamDAO();
    private final RoomAllocationService allocation=new RoomAllocationService();
    private final SeatingGenerator generator=new SeatingGenerator();
    public List<Student> studentsFor(Exam exam)throws SQLException{return studentDAO.findSelected(examDAO.selectedDepartments(exam.getId()),examDAO.selectedSemesters(exam.getId()));}
    public List<Room> roomsFor(int studentCount,boolean automatic,List<Room> selected)throws SQLException{List<Room> available=roomDAO.findAvailable();if(automatic)return allocation.automatic(available,studentCount);allocation.validateManual(selected,studentCount);return selected;}
    public GenerationSummary generate(Exam exam,String shuffle,boolean automatic,List<Room> chosen)throws SQLException{List<Student> students=studentsFor(exam);if(students.isEmpty())throw new IllegalArgumentException("No active students match the exam departments and semesters.");List<Room> rooms=roomsFor(students.size(),automatic,chosen);List<Seating> seats=generator.generate(exam,students,rooms,shuffle);seatingDAO.replaceAll(exam.getId(),seats);List<Teacher> teachers=new TeacherDAO().findAvailable();invigilatorDAO.assignForRooms(exam.getId(),rooms,teachers);return new GenerationSummary(exam,students,rooms,seats,shuffle);}
    public void clear(int examId)throws SQLException{seatingDAO.clearExam(examId);}
    public record GenerationSummary(Exam exam,List<Student> students,List<Room> rooms,List<Seating> seats,String shuffle) { public int capacity(){return rooms.stream().mapToInt(Room::getCapacity).sum();} public int emptySeats(){return capacity()-students.size();} }
}
