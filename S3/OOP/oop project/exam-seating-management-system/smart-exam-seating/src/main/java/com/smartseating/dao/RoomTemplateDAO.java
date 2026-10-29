package com.smartseating.dao;

import com.smartseating.model.RoomTemplate;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.*;

public class RoomTemplateDAO {
    private RoomTemplate map(ResultSet r)throws SQLException{return new RoomTemplate(r.getInt("id"),r.getString("template_name"),r.getString("starting_room"),r.getInt("number_of_rooms"),r.getInt("rows_count"),r.getInt("columns_count"),r.getString("building"),r.getInt("floor_no"));}
    public List<RoomTemplate> findAll()throws SQLException{List<RoomTemplate>a=new ArrayList<>();try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM room_templates ORDER BY template_name");ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}return a;}
    public void save(RoomTemplate x)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO room_templates(template_name,starting_room,number_of_rooms,rows_count,columns_count,building,floor_no) VALUES(?,?,?,?,?,?,?)")){p.setString(1,x.getTemplateName());p.setString(2,x.getStartingRoom());p.setInt(3,x.getNumberOfRooms());p.setInt(4,x.getRows());p.setInt(5,x.getColumns());p.setString(6,x.getBuilding());p.setInt(7,x.getFloor());p.executeUpdate();}}
    public void update(RoomTemplate x)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("UPDATE room_templates SET template_name=?,starting_room=?,number_of_rooms=?,rows_count=?,columns_count=?,building=?,floor_no=? WHERE id=?")){p.setString(1,x.getTemplateName());p.setString(2,x.getStartingRoom());p.setInt(3,x.getNumberOfRooms());p.setInt(4,x.getRows());p.setInt(5,x.getColumns());p.setString(6,x.getBuilding());p.setInt(7,x.getFloor());p.setInt(8,x.getId());p.executeUpdate();}}
    public void delete(int id)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("DELETE FROM room_templates WHERE id=?")){p.setInt(1,id);p.executeUpdate();}}
}
