package com.smartseating.dao;

import com.smartseating.model.Department;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.*;

public class DepartmentDAO {
    private Department map(ResultSet rs) throws SQLException { return new Department(rs.getInt("id"),rs.getString("code"),rs.getString("name"),rs.getString("status")); }
    public List<Department> findAll() throws SQLException { List<Department> out=new ArrayList<>(); try(Connection c=DBConnection.getConnection(); PreparedStatement p=c.prepareStatement("SELECT * FROM departments ORDER BY code"); ResultSet r=p.executeQuery()){while(r.next())out.add(map(r));} return out; }
    public void save(Department d) throws SQLException { try(Connection c=DBConnection.getConnection(); PreparedStatement p=c.prepareStatement("INSERT INTO departments(code,name,status) VALUES(?,?,?)")){p.setString(1,d.getCode());p.setString(2,d.getName());p.setString(3,d.getStatus());p.executeUpdate();} }
    public void update(Department d) throws SQLException { try(Connection c=DBConnection.getConnection(); PreparedStatement p=c.prepareStatement("UPDATE departments SET code=?,name=?,status=? WHERE id=?")){p.setString(1,d.getCode());p.setString(2,d.getName());p.setString(3,d.getStatus());p.setInt(4,d.getId());p.executeUpdate();} }
    public void delete(int id) throws SQLException { try(Connection c=DBConnection.getConnection(); PreparedStatement p=c.prepareStatement("DELETE FROM departments WHERE id=?")){p.setInt(1,id);p.executeUpdate();} }
    public long count() throws SQLException { try(Connection c=DBConnection.getConnection(); PreparedStatement p=c.prepareStatement("SELECT COUNT(*) FROM departments");ResultSet r=p.executeQuery()){r.next();return r.getLong(1);} }
}
