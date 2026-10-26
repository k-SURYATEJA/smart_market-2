package com.smartmarket.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smartmarket.dao.UserDAO;
import com.smartmarket.model.User;
import com.smartmarket.util.CorsUtil;
import com.smartmarket.util.CryptoUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Handles:
 *   POST /api/auth/register   — Create new user account
 *   POST /api/auth/login      — Authenticate existing user
 *
 * Request body (both): { "name"?: string, "email": string, "password": string, "specialty"?: string }
 * Response:            { "success": true/false, "profile"?: UserProfile, "errorMessage"?: string }
 */
@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Gson GSON = new Gson();
    private final UserDAO userDAO = new UserDAO();

    // ----------------------------------------------------------------
    // CORS pre-flight
    // ----------------------------------------------------------------
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        CorsUtil.set(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    // ----------------------------------------------------------------
    // POST — dispatch to register or login based on URL path
    // ----------------------------------------------------------------
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        CorsUtil.set(resp);
        resp.setContentType("application/json;charset=UTF-8");
        req.setCharacterEncoding("UTF-8");

        String path = req.getPathInfo(); // "/login" or "/register"

        if ("/register".equals(path)) {
            handleRegister(req, resp);
        } else if ("/login".equals(path)) {
            handleLogin(req, resp);
        } else {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, "Unknown auth endpoint.");
        }
    }

    // ================================================================
    // REGISTER
    // ================================================================
    private void handleRegister(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {

        JsonObject body = parseBody(req);

        String name      = getString(body, "name");
        String email     = getString(body, "email");
        String password  = getString(body, "password");
        String specialty = getString(body, "specialty");

        // --- Validation ---
        if (name == null || name.trim().length() < 2) {
            sendError(resp, 400, "Name must be at least 2 characters.");
            return;
        }
        if (email == null || !email.contains("@")) {
            sendError(resp, 400, "Please provide a valid email address.");
            return;
        }
        if (password == null || password.length() < 8) {
            sendError(resp, 400, "Password must be at least 8 characters.");
            return;
        }

        try {
            if (userDAO.emailExists(email)) {
                sendError(resp, 409, "An account with this email already exists. Please sign in.");
                return;
            }

            // Build user object
            String userId = "usr_" + UUID.randomUUID().toString().replace("-", "");
            String hash   = CryptoUtil.hashPassword(password);
            String joined = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("MMM yyyy"));
            String avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed="
                + java.net.URLEncoder.encode(name.trim(), "UTF-8");
            String spec   = (specialty != null && !specialty.isBlank())
                ? specialty.trim() : "Equities & Swing Technicals";

            User user = new User(
                userId,
                name.trim(),
                email.toLowerCase().trim(),
                hash,
                "Market Analyst",
                spec,
                "PRO TERMINAL",
                joined,
                avatar
            );

            userDAO.insertUser(user);
            sendProfile(resp, user);

        } catch (SQLException e) {
            throw new ServletException("Database error during registration.", e);
        }
    }

    // ================================================================
    // LOGIN
    // ================================================================
    private void handleLogin(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {

        JsonObject body = parseBody(req);

        String email    = getString(body, "email");
        String password = getString(body, "password");

        if (email == null || password == null) {
            sendError(resp, 400, "Email and password are required.");
            return;
        }

        try {
            User user = userDAO.getUserByEmail(email);

            if (user == null || !CryptoUtil.verifyPassword(password, user.getPasswordHash())) {
                sendError(resp, 401, "Invalid email or password.");
                return;
            }

            sendProfile(resp, user);

        } catch (SQLException e) {
            throw new ServletException("Database error during login.", e);
        }
    }

    // ================================================================
    // Helpers
    // ================================================================

    /** Write a successful profile response (no password hash). */
    private void sendProfile(HttpServletResponse resp, User user) throws IOException {
        JsonObject profile = new JsonObject();
        profile.addProperty("id",         user.getId());
        profile.addProperty("name",       user.getName());
        profile.addProperty("email",      user.getEmail());
        profile.addProperty("role",       user.getRole());
        profile.addProperty("specialty",  user.getSpecialty());
        profile.addProperty("plan",       user.getPlan());
        profile.addProperty("joinedDate", user.getJoinedDate());
        profile.addProperty("avatarUrl",  user.getAvatarUrl());

        JsonObject result = new JsonObject();
        result.addProperty("success", true);
        result.add("profile", profile);

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write(GSON.toJson(result));
    }

    /** Write an error response. */
    private void sendError(HttpServletResponse resp, int status, String message) throws IOException {
        JsonObject result = new JsonObject();
        result.addProperty("success",      false);
        result.addProperty("errorMessage", message);
        resp.setStatus(status);
        resp.getWriter().write(GSON.toJson(result));
    }

    /** Parse JSON request body. */
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

    /** Safe getter that returns null if field is missing or blank. */
    private String getString(JsonObject obj, String key) {
        if (obj == null || !obj.has(key) || obj.get(key).isJsonNull()) return null;
        String val = obj.get(key).getAsString().trim();
        return val.isEmpty() ? null : val;
    }
}
