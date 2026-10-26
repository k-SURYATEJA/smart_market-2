package com.smartmarket.dao;

import com.smartmarket.model.User;
import com.smartmarket.util.DBConnection;

import java.sql.*;

/**
 * CRUD operations for the USERS table.
 */
public class UserDAO {

    // ----------------------------------------------------------------
    // Check if email is already taken
    // ----------------------------------------------------------------
    public boolean emailExists(String email) throws SQLException {
        String sql = "SELECT 1 FROM users WHERE email = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, email.toLowerCase().trim());
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    // ----------------------------------------------------------------
    // Insert a new user on registration
    // ----------------------------------------------------------------
    public boolean insertUser(User user) throws SQLException {
        String sql =
            "INSERT INTO users (id, name, email, password_hash, role, specialty, plan, joined_date, avatar_url) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, user.getId());
            ps.setString(2, user.getName());
            ps.setString(3, user.getEmail().toLowerCase().trim());
            ps.setString(4, user.getPasswordHash());
            ps.setString(5, user.getRole());
            ps.setString(6, user.getSpecialty());
            ps.setString(7, user.getPlan());
            ps.setString(8, user.getJoinedDate());
            ps.setString(9, user.getAvatarUrl());
            return ps.executeUpdate() == 1;
        }
    }

    // ----------------------------------------------------------------
    // Find user by email for login
    // ----------------------------------------------------------------
    public User getUserByEmail(String email) throws SQLException {
        String sql =
            "SELECT id, name, email, password_hash, role, specialty, plan, joined_date, avatar_url " +
            "FROM users WHERE email = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, email.toLowerCase().trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }
        return null;
    }

    // ----------------------------------------------------------------
    // Map ResultSet row → User object
    // ----------------------------------------------------------------
    private User mapRow(ResultSet rs) throws SQLException {
        User u = new User();
        u.setId(rs.getString("id"));
        u.setName(rs.getString("name"));
        u.setEmail(rs.getString("email"));
        u.setPasswordHash(rs.getString("password_hash"));
        u.setRole(rs.getString("role"));
        u.setSpecialty(rs.getString("specialty"));
        u.setPlan(rs.getString("plan"));
        u.setJoinedDate(rs.getString("joined_date"));
        u.setAvatarUrl(rs.getString("avatar_url"));
        return u;
    }
}
