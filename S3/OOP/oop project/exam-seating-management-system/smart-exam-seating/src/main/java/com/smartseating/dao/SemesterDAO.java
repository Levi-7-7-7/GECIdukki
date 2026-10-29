package com.smartseating.dao;

import com.smartseating.model.Semester;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.*;

public class SemesterDAO {
    private Semester map(ResultSet r)throws SQLException{return new Semester(r.getInt("id"),r.getString("semester_number"),r.getString("academic_year"),r.getString("status"));}
    public List<Semester> findAll()throws SQLException{List<Semester> a=new ArrayList<>();try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM semesters ORDER BY semester_number");ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}return a;}
    public void save(Semester s)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO semesters(semester_number,academic_year,status) VALUES(?,?,?)")){p.setString(1,s.getNumber());p.setString(2,s.getAcademicYear());p.setString(3,s.getStatus());p.executeUpdate();}}
    public void update(Semester s)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("UPDATE semesters SET semester_number=?,academic_year=?,status=? WHERE id=?")){p.setString(1,s.getNumber());p.setString(2,s.getAcademicYear());p.setString(3,s.getStatus());p.setInt(4,s.getId());p.executeUpdate();}}
    public void delete(int id)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("DELETE FROM semesters WHERE id=?")){p.setInt(1,id);p.executeUpdate();}}
    public long count()throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT COUNT(*) FROM semesters");ResultSet r=p.executeQuery()){r.next();return r.getLong(1);}}
}
