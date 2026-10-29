package com.smartseating.dao;

import com.smartseating.model.User;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    private User map(ResultSet r)throws SQLException{User u=new User(r.getInt("id"),r.getString("username"),r.getString("role"),r.getString("full_name"));u.setStatus(r.getString("status"));return u;}
    public User authenticate(String username,String password)throws SQLException{String sql="SELECT id,username,role,full_name,status FROM users WHERE username=? AND password=? AND status='ACTIVE'";try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement(sql)){p.setString(1,username);p.setString(2,password);try(ResultSet r=p.executeQuery()){return r.next()?map(r):null;}}}
    public List<User> findAll()throws SQLException{List<User>a=new ArrayList<>();try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT id,username,role,full_name,status FROM users ORDER BY username");ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}return a;}
    public void save(User u)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO users(username,password,role,full_name,status) VALUES(?,?,?,?,?)")){p.setString(1,u.getUsername());p.setString(2,u.getPassword());p.setString(3,u.getRole());p.setString(4,u.getFullName());p.setString(5,u.getStatus());p.executeUpdate();}}
    public void update(User u)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("UPDATE users SET username=?,password=?,role=?,full_name=?,status=? WHERE id=?")){p.setString(1,u.getUsername());p.setString(2,u.getPassword());p.setString(3,u.getRole());p.setString(4,u.getFullName());p.setString(5,u.getStatus());p.setInt(6,u.getId());p.executeUpdate();}}
    public void delete(int id)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("DELETE FROM users WHERE id=?")){p.setInt(1,id);p.executeUpdate();}}
}
