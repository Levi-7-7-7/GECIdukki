package com.smartseating.dao;

import com.smartseating.model.Room;
import com.smartseating.util.DBConnection;
import java.sql.*;
import java.util.*;

public class RoomDAO {
    private Room map(ResultSet r)throws SQLException{return new Room(r.getInt("id"),r.getString("room_number"),r.getString("building"),r.getInt("floor_no"),r.getInt("rows_count"),r.getInt("columns_count"),r.getInt("capacity"),r.getString("status"));}
    public List<Room> findAll()throws SQLException{List<Room>a=new ArrayList<>();try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM rooms ORDER BY room_number");ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}return a;}
    public List<Room> findAvailable()throws SQLException{List<Room>a=new ArrayList<>();try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM rooms WHERE status='AVAILABLE' ORDER BY room_number");ResultSet r=p.executeQuery()){while(r.next())a.add(map(r));}return a;}
    public void save(Room x)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO rooms(room_number,building,floor_no,rows_count,columns_count,capacity,status) VALUES(?,?,?,?,?,?,?)")){p.setString(1,x.getRoomNumber());p.setString(2,x.getBuilding());p.setInt(3,x.getFloor());p.setInt(4,x.getRows());p.setInt(5,x.getColumns());p.setInt(6,x.getCapacity());p.setString(7,x.getStatus());p.executeUpdate();}}
    public void saveAll(List<Room> rooms)throws SQLException{try(Connection c=DBConnection.getConnection()){c.setAutoCommit(false);try(PreparedStatement p=c.prepareStatement("INSERT INTO rooms(room_number,building,floor_no,rows_count,columns_count,capacity,status) VALUES(?,?,?,?,?,?,?)")){for(Room x:rooms){p.setString(1,x.getRoomNumber());p.setString(2,x.getBuilding());p.setInt(3,x.getFloor());p.setInt(4,x.getRows());p.setInt(5,x.getColumns());p.setInt(6,x.getCapacity());p.setString(7,x.getStatus());p.addBatch();}p.executeBatch();c.commit();}catch(SQLException e){c.rollback();throw e;}}}
    public void update(Room x)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("UPDATE rooms SET room_number=?,building=?,floor_no=?,rows_count=?,columns_count=?,capacity=?,status=? WHERE id=?")){p.setString(1,x.getRoomNumber());p.setString(2,x.getBuilding());p.setInt(3,x.getFloor());p.setInt(4,x.getRows());p.setInt(5,x.getColumns());p.setInt(6,x.getCapacity());p.setString(7,x.getStatus());p.setInt(8,x.getId());p.executeUpdate();}}
    public void delete(int id)throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("DELETE FROM rooms WHERE id=?")){p.setInt(1,id);p.executeUpdate();}}
    public long totalCapacity()throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT COALESCE(SUM(capacity),0) FROM rooms WHERE status='AVAILABLE'");ResultSet r=p.executeQuery()){r.next();return r.getLong(1);}}
    public long count()throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT COUNT(*) FROM rooms");ResultSet r=p.executeQuery()){r.next();return r.getLong(1);}}
}
