package com.smartseating.dao;

import com.smartseating.model.Room;
import com.smartseating.model.Teacher;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.*;

public class InvigilatorDAO {
    public void assignForRooms(int examId,List<Room> rooms,List<Teacher> teachers)throws SQLException{
        if(teachers.size()<rooms.size())throw new IllegalArgumentException("There are not enough available teachers for the selected rooms.");
        try(Connection c=DBConnection.getConnection()){c.setAutoCommit(false);try(PreparedStatement d=c.prepareStatement("DELETE FROM invigilator_assignments WHERE exam_id=?");PreparedStatement s=c.prepareStatement("INSERT INTO invigilator_assignments(exam_id,room_id,teacher_id) VALUES(?,?,?)");PreparedStatement u=c.prepareStatement("UPDATE seating SET invigilator_id=? WHERE exam_id=? AND room_id=?")){d.setInt(1,examId);d.executeUpdate();for(int i=0;i<rooms.size();i++){Room room=rooms.get(i);Teacher t=teachers.get(i);s.setInt(1,examId);s.setInt(2,room.getId());s.setInt(3,t.getId());s.addBatch();u.setInt(1,t.getId());u.setInt(2,examId);u.setInt(3,room.getId());u.addBatch();}s.executeBatch();u.executeBatch();c.commit();}catch(SQLException e){c.rollback();throw e;}}}
    public List<String[]> findByExam(int examId)throws SQLException{List<String[]>a=new ArrayList<>();String sql="SELECT r.room_number,t.name,t.designation FROM invigilator_assignments ia JOIN rooms r ON r.id=ia.room_id JOIN teachers t ON t.id=ia.teacher_id WHERE ia.exam_id=? ORDER BY r.room_number";try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement(sql)){p.setInt(1,examId);try(ResultSet r=p.executeQuery()){while(r.next())a.add(new String[]{r.getString(1),r.getString(2),r.getString(3)});}}return a;}
}
