package com.smartseating.dao;

import com.smartseating.util.DBConnection;
import java.sql.*;

public class DashboardDAO {
    public long count(String table)throws SQLException{
        if(!table.matches("students|departments|teachers|rooms")) throw new IllegalArgumentException("Unsupported dashboard table");
        try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT COUNT(*) FROM "+table);ResultSet r=p.executeQuery()){r.next();return r.getLong(1);}
    }
    public long roomCapacity()throws SQLException{try(Connection c=DBConnection.getConnection();PreparedStatement p=c.prepareStatement("SELECT COALESCE(SUM(capacity),0) FROM rooms WHERE status='AVAILABLE'");ResultSet r=p.executeQuery()){r.next();return r.getLong(1);}}
}
