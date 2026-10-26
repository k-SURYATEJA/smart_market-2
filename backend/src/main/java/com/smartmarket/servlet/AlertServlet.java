package com.smartmarket.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smartmarket.dao.AlertDAO;
import com.smartmarket.model.PriceAlert;
import com.smartmarket.util.CorsUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Handles:
 *   GET    /api/alerts?userId=X       — Fetch all price alerts for user
 *   POST   /api/alerts                — Create a new price alert
 *   DELETE /api/alerts/{id}?userId=X  — Delete / dismiss an alert
 */
@WebServlet("/api/alerts/*")
public class AlertServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Gson GSON = new Gson();
    private final AlertDAO alertDAO = new AlertDAO();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        CorsUtil.set(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // ----------------------------------------------------------------
    // GET /api/alerts?userId=X
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
            List<PriceAlert> alerts = alertDAO.getByUserId(userId);
            JsonObject result = new JsonObject();
            result.addProperty("success", true);
            result.add("alerts", GSON.toJsonTree(alerts));
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            throw new ServletException("Database error fetching alerts.", e);
        }
    }

    // ----------------------------------------------------------------
    // POST /api/alerts
    // Body: { userId, symbol, targetPrice, condition }
    // ----------------------------------------------------------------
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        CorsUtil.set(resp);
        resp.setContentType("application/json;charset=UTF-8");
        req.setCharacterEncoding("UTF-8");

        JsonObject body = parseBody(req);

        String userId    = getString(body, "userId");
        String symbol    = getString(body, "symbol");
        String condition = getString(body, "condition");

        if (userId == null || symbol == null || condition == null || !body.has("targetPrice")) {
            sendError(resp, 400, "userId, symbol, targetPrice, and condition are required.");
            return;
        }

        double targetPrice;
        try {
            targetPrice = body.get("targetPrice").getAsDouble();
        } catch (Exception e) {
            sendError(resp, 400, "targetPrice must be a number.");
            return;
        }

        PriceAlert alert = new PriceAlert();
        alert.setId("alrt-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
        alert.setUserId(userId);
        alert.setSymbol(symbol.toUpperCase());
        alert.setTargetPrice(targetPrice);
        alert.setCondition(condition.toUpperCase());
        alert.setCreatedAt(Instant.now().toString());
        alert.setTriggered(false);

        try {
            alertDAO.insert(alert);
            JsonObject result = new JsonObject();
            result.addProperty("success", true);
            result.add("alert", GSON.toJsonTree(alert));
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            throw new ServletException("Database error saving alert.", e);
        }
    }

    // ----------------------------------------------------------------
    // DELETE /api/alerts/{id}?userId=X
    // ----------------------------------------------------------------
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        CorsUtil.set(resp);
        resp.setContentType("application/json;charset=UTF-8");

        String pathInfo = req.getPathInfo();
        String userId   = req.getParameter("userId");

        if (pathInfo == null || pathInfo.length() < 2 || userId == null) {
            sendError(resp, 400, "Alert ID (path) and userId (query param) are required.");
            return;
        }

        String alertId = pathInfo.substring(1);

        try {
            boolean deleted = alertDAO.delete(alertId, userId);
            JsonObject result = new JsonObject();
            result.addProperty("success", deleted);
            resp.setStatus(deleted ? HttpServletResponse.SC_OK : HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            throw new ServletException("Database error deleting alert.", e);
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
