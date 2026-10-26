package com.smartmarket.util;

import javax.servlet.http.HttpServletResponse;

/**
 * Sets CORS headers so the React dev server (localhost:3000)
 * can call our Tomcat API (localhost:8080) without browser CORS errors.
 */
public final class CorsUtil {

    private CorsUtil() {}

    public static void set(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin",  "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Max-Age",       "3600");
    }
}
