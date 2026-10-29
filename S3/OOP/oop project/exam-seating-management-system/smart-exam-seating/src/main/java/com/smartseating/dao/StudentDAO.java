package com.smartseating.dao;

import com.smartseating.model.Student;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.*;

public class StudentDAO {
    private Student map(ResultSet r)throws SQLException{return new Student(r.getInt("id"),r.getString("register_number"),r.getString("name"),r.getString("department_code"),r.getString("semester_number"),r.getString("division"),r.getString("status"));}
    public List<Student> findAll()throws SQLException{return search("");}
    public List<Student> search(String term)throws SQLException{List<Student>a=new ArrayList<>();String sql="SELECT * FROM students WHERE register_number LIKE ? OR name LIKE ? OR department_code LIKE ? OR semester_number LIKE ? ORDER BY register_number";try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement(sql)){String q="%"+(term==null?"":term.trim())+"%";for(int i=1;i<=4;i++)p.setString(i,q);try(ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}}return a;}
    public List<Student> findSelected(List<String> departments,List<String> semesters)throws SQLException{List<Student>a=new ArrayList<>();if(departments.isEmpty()||semesters.isEmpty())return a;String di=String.join(",",Collections.nCopies(departments.size(),"?"));String si=String.join(",",Collections.nCopies(semesters.size(),"?"));String sql="SELECT * FROM students WHERE status='ACTIVE' AND department_code IN ("+di+") AND semester_number IN ("+si+") ORDER BY register_number";try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement(sql)){int i=1;for(String v:departments)p.setString(i++,v);for(String v:semesters)p.setString(i++,v);try(ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}}return a;}
    public Student findByRegister(String register)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM students WHERE register_number=?")){p.setString(1,register);try(ResultSet r=p.executeQuery()){return r.next()?map(r):null;}}}
    public void save(Student s)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO students(register_number,name,department_code,semester_number,division,status) VALUES(?,?,?,?,?,?)")){p.setString(1,s.getRegisterNumber());p.setString(2,s.getName());p.setString(3,s.getDepartmentCode());p.setString(4,s.getSemesterNumber());p.setString(5,s.getDivision());p.setString(6,s.getStatus());p.executeUpdate();}}
    public void update(Student s)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("UPDATE students SET register_number=?,name=?,department_code=?,semester_number=?,division=?,status=? WHERE id=?")){p.setString(1,s.getRegisterNumber());p.setString(2,s.getName());p.setString(3,s.getDepartmentCode());p.setString(4,s.getSemesterNumber());p.setString(5,s.getDivision());p.setString(6,s.getStatus());p.setInt(7,s.getId());p.executeUpdate();}}
    public void delete(int id)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("DELETE FROM students WHERE id=?")){p.setInt(1,id);p.executeUpdate();}}
    public long count()throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT COUNT(*) FROM students WHERE status='ACTIVE'");ResultSet r=p.executeQuery()){r.next();return r.getLong(1);}}
}
