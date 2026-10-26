package com.smartmarket.dao;

import com.smartmarket.model.ResearchNote;
import com.smartmarket.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * CRUD operations for the RESEARCH_NOTES table.
 */
public class ResearchNoteDAO {

    // ----------------------------------------------------------------
    // Get all notes for a given user (newest first)
    // ----------------------------------------------------------------
    public List<ResearchNote> getByUserId(String userId) throws SQLException {
        List<ResearchNote> notes = new ArrayList<>();
        String sql =
            "SELECT id, user_id, note_date, symbol, category, setup_type, " +
            "key_level, target_outlook, timeframe, thesis " +
            "FROM research_notes WHERE user_id = ? ORDER BY created_at DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) notes.add(mapRow(rs));
            }
        }
        return notes;
    }

    // ----------------------------------------------------------------
    // Insert a new research note
    // ----------------------------------------------------------------
    public boolean insert(ResearchNote note) throws SQLException {
        String sql =
            "INSERT INTO research_notes " +
            "(id, user_id, note_date, symbol, category, setup_type, key_level, target_outlook, timeframe, thesis) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1,  note.getId());
            ps.setString(2,  note.getUserId());
            ps.setString(3,  note.getDate());
            ps.setString(4,  note.getSymbol().toUpperCase());
            ps.setString(5,  note.getCategory());
            ps.setString(6,  note.getSetupType());
            ps.setString(7,  note.getKeyLevel());
            ps.setString(8,  note.getTargetOutlook());
            ps.setString(9,  note.getTimeframe());
            ps.setString(10, note.getThesis());
            return ps.executeUpdate() == 1;
        }
    }

    // ----------------------------------------------------------------
    // Delete a note by id (only if it belongs to the requesting user)
    // ----------------------------------------------------------------
    public boolean delete(String id, String userId) throws SQLException {
        String sql = "DELETE FROM research_notes WHERE id = ? AND user_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, id);
            ps.setString(2, userId);
            return ps.executeUpdate() == 1;
        }
    }

    // ----------------------------------------------------------------
    // Map ResultSet row → ResearchNote object
    // ----------------------------------------------------------------
    private ResearchNote mapRow(ResultSet rs) throws SQLException {
        ResearchNote n = new ResearchNote();
        n.setId(rs.getString("id"));
        n.setUserId(rs.getString("user_id"));
        n.setDate(rs.getString("note_date"));
        n.setSymbol(rs.getString("symbol"));
        n.setCategory(rs.getString("category"));
        n.setSetupType(rs.getString("setup_type"));
        n.setKeyLevel(rs.getString("key_level"));
        n.setTargetOutlook(rs.getString("target_outlook"));
        n.setTimeframe(rs.getString("timeframe"));
        n.setThesis(rs.getString("thesis"));
        return n;
    }
}
