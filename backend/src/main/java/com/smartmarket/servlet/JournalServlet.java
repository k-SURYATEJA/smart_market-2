package com.smartmarket.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smartmarket.dao.ResearchNoteDAO;
import com.smartmarket.model.ResearchNote;
import com.smartmarket.util.CorsUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Handles:
 *   GET    /api/journal?userId=X     — Fetch all research notes for user
 *   POST   /api/journal              — Save a new research note
 *   DELETE /api/journal/{id}?userId=X — Delete a note
 */
@WebServlet("/api/journal/*")
public class JournalServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Gson GSON = new Gson();
    private final ResearchNoteDAO noteDAO = new ResearchNoteDAO();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        CorsUtil.set(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // ----------------------------------------------------------------
    // GET /api/journal?userId=X  →  return list of notes
    // ----------------------------------------------------------------
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        CorsUtil.set(resp);
        resp.setContentType("application/json;charset=UTF-8");

        String userId = req.getParameter("userId");
        if (userId == null || userId.isBlank()) {
            sendError(resp, 400, "userId parameter is required.");
            return;
        }

        try {
            List<ResearchNote> notes = noteDAO.getByUserId(userId);
            JsonObject result = new JsonObject();
            result.addProperty("success", true);
            result.add("notes", GSON.toJsonTree(notes));
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            throw new ServletException("Database error fetching notes.", e);
        }
    }

    // ----------------------------------------------------------------
    // POST /api/journal  →  save a new research note
    // Body: { userId, symbol, category, setupType, keyLevel, targetOutlook, timeframe, thesis }
    // ----------------------------------------------------------------
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        CorsUtil.set(resp);
        resp.setContentType("application/json;charset=UTF-8");
        req.setCharacterEncoding("UTF-8");

        JsonObject body = parseBody(req);

        String userId        = getString(body, "userId");
        String symbol        = getString(body, "symbol");
        String category      = getString(body, "category");
        String setupType     = getString(body, "setupType");
        String keyLevel      = getString(body, "keyLevel");
        String targetOutlook = getString(body, "targetOutlook");
        String timeframe     = getString(body, "timeframe");
        String thesis        = getString(body, "thesis");

        if (userId == null || symbol == null || category == null || thesis == null) {
            sendError(resp, 400, "userId, symbol, category and thesis are required.");
            return;
        }

        ResearchNote note = new ResearchNote();
        note.setId("rn-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        note.setUserId(userId);
        note.setDate(LocalDate.now().toString());
        note.setSymbol(symbol.toUpperCase());
        note.setCategory(category);
        note.setSetupType(setupType != null ? setupType : "Analysis Note");
        note.setKeyLevel(keyLevel != null ? keyLevel : "-");
        note.setTargetOutlook(targetOutlook != null ? targetOutlook : "-");
        note.setTimeframe(timeframe != null ? timeframe : "Swing");
        note.setThesis(thesis);

        try {
            noteDAO.insert(note);
            JsonObject result = new JsonObject();
            result.addProperty("success", true);
            result.add("note", GSON.toJsonTree(note));
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            throw new ServletException("Database error saving note.", e);
        }
    }

    // ----------------------------------------------------------------
    // DELETE /api/journal/{id}?userId=X
    // ----------------------------------------------------------------
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        CorsUtil.set(resp);
        resp.setContentType("application/json;charset=UTF-8");

        String pathInfo = req.getPathInfo(); // "/{id}"
        String userId   = req.getParameter("userId");

        if (pathInfo == null || pathInfo.length() < 2 || userId == null) {
            sendError(resp, 400, "Note ID (path) and userId (query param) are required.");
            return;
        }

        String noteId = pathInfo.substring(1); // strip leading "/"

        try {
            boolean deleted = noteDAO.delete(noteId, userId);
            JsonObject result = new JsonObject();
            result.addProperty("success", deleted);
            resp.setStatus(deleted ? HttpServletResponse.SC_OK : HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            throw new ServletException("Database error deleting note.", e);
        }
    }

    // ================================================================
    // Helpers
    // ================================================================
    private void sendError(HttpServletResponse resp, int status, String message) throws IOException {
        JsonObject result = new JsonObject();
        result.addProperty("success",      false);
        result.addProperty("errorMessage", message);
        resp.setStatus(status);
        resp.getWriter().write(GSON.toJson(result));
    }

    private JsonObject parseBody(HttpServletRequest req) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        String raw = sb.toString().trim();
        if (raw.isEmpty()) return new JsonObject();
        return JsonParser.parseString(raw).getAsJsonObject();
    }

    private String getString(JsonObject obj, String key) {
        if (obj == null || !obj.has(key) || obj.get(key).isJsonNull()) return null;
        String val = obj.get(key).getAsString().trim();
        return val.isEmpty() ? null : val;
    }
}
