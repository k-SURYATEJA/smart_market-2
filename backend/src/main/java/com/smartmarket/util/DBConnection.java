package com.smartmarket.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Provides Oracle JDBC connections for the Smart Market backend.
 * Matches the same Oracle XE instance used by StudentManagementSystem.
 */
public final class DBConnection {

    private static final String URL  = "jdbc:oracle:thin:@localhost:1521:xe";
    private static final String USER = "system";
    private static final String PASS = "JaiShriRam#88";

    private DBConnection() {}

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("oracle.jdbc.OracleDriver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(
                "Oracle JDBC Driver not found. Ensure ojdbc8 is in Maven dependencies.", e);
        }
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
