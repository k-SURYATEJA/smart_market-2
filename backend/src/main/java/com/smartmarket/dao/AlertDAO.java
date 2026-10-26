package com.smartmarket.dao;

import com.smartmarket.model.PriceAlert;
import com.smartmarket.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * CRUD operations for the PRICE_ALERTS table.
 */
public class AlertDAO {

    // ----------------------------------------------------------------
    // Get all alerts for a given user
    // ----------------------------------------------------------------
    public List<PriceAlert> getByUserId(String userId) throws SQLException {
        List<PriceAlert> alerts = new ArrayList<>();
        String sql =
            "SELECT id, user_id, symbol, target_price, condition, created_at, triggered " +
            "FROM price_alerts WHERE user_id = ? ORDER BY created_at DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) alerts.add(mapRow(rs));
            }
        }
        return alerts;
    }

    // ----------------------------------------------------------------
    // Insert a new price alert
    // ----------------------------------------------------------------
    public boolean insert(PriceAlert alert) throws SQLException {
        String sql =
            "INSERT INTO price_alerts (id, user_id, symbol, target_price, condition, created_at, triggered) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, alert.getId());
            ps.setString(2, alert.getUserId());
            ps.setString(3, alert.getSymbol().toUpperCase());
            ps.setDouble(4, alert.getTargetPrice());
            ps.setString(5, alert.getCondition());
            ps.setString(6, alert.getCreatedAt());
            ps.setInt(7,    alert.isTriggered() ? 1 : 0);
            return ps.executeUpdate() == 1;
        }
    }

    // ----------------------------------------------------------------
    // Delete an alert by id (only if it belongs to the requesting user)
    // ----------------------------------------------------------------
    public boolean delete(String id, String userId) throws SQLException {
        String sql = "DELETE FROM price_alerts WHERE id = ? AND user_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, id);
            ps.setString(2, userId);
            return ps.executeUpdate() == 1;
        }
    }

    // ----------------------------------------------------------------
    // Map ResultSet row → PriceAlert object
    // ----------------------------------------------------------------
    private PriceAlert mapRow(ResultSet rs) throws SQLException {
        PriceAlert a = new PriceAlert();
        a.setId(rs.getString("id"));
        a.setUserId(rs.getString("user_id"));
        a.setSymbol(rs.getString("symbol"));
        a.setTargetPrice(rs.getDouble("target_price"));
        a.setCondition(rs.getString("condition"));
        a.setCreatedAt(rs.getString("created_at"));
        a.setTriggered(rs.getInt("triggered") == 1);
        return a;
    }
}
