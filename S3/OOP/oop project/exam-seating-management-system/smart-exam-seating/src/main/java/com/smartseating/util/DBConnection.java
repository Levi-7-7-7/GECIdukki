package com.smartseating.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/** Central JDBC factory. System properties take precedence over environment variables. */
public final class DBConnection {
    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/smart_exam_seating?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private DBConnection() { }
    public static Connection getConnection() throws SQLException {
        String url = value("db.url", "SMART_SEATING_DB_URL", DEFAULT_URL);
        String user = value("db.user", "SMART_SEATING_DB_USER", "root");
        String password = value("db.password", "SMART_SEATING_DB_PASSWORD", "root");
        return DriverManager.getConnection(url, user, password);
    }
    private static String value(String property, String environment, String fallback) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) value = System.getenv(environment);
        return value == null || value.isBlank() ? fallback : value;
    }
    public static boolean isAvailable() {
        try (Connection ignored = getConnection()) { return true; }
        catch (SQLException ex) { return false; }
    }
}
