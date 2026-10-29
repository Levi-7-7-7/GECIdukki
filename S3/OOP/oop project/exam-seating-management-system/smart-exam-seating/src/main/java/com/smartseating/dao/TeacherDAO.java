package com.smartseating.dao;

import com.smartseating.model.Teacher;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.*;

public class TeacherDAO {
    private Teacher map(ResultSet r)throws SQLException{return new Teacher(r.getInt("id"),r.getString("name"),r.getString("department_code"),r.getString("designation"),r.getString("phone"),r.getString("status"));}
    public List<Teacher> findAll()throws SQLException{List<Teacher>a=new ArrayList<>();try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM teachers ORDER BY name");ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}return a;}
    public List<Teacher> findAvailable()throws SQLException{List<Teacher>a=new ArrayList<>();try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM teachers WHERE status='AVAILABLE' ORDER BY name");ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}return a;}
    public void save(Teacher x)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO teachers(name,department_code,designation,phone,status) VALUES(?,?,?,?,?)")){p.setString(1,x.getName());p.setString(2,x.getDepartmentCode());p.setString(3,x.getDesignation());p.setString(4,x.getPhone());p.setString(5,x.getStatus());p.executeUpdate();}}
    public void update(Teacher x)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("UPDATE teachers SET name=?,department_code=?,designation=?,phone=?,status=? WHERE id=?")){p.setString(1,x.getName());p.setString(2,x.getDepartmentCode());p.setString(3,x.getDesignation());p.setString(4,x.getPhone());p.setString(5,x.getStatus());p.setInt(6,x.getId());p.executeUpdate();}}
    public void delete(int id)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("DELETE FROM teachers WHERE id=?")){p.setInt(1,id);p.executeUpdate();}}
    public long count()throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT COUNT(*) FROM teachers");ResultSet r=p.executeQuery()){r.next();return r.getLong(1);}}
}
