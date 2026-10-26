package com.smartmarket.util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.HexFormat;

/**
 * PBKDF2-SHA256 password hashing — matches the algorithm used by the
 * React frontend (authService.ts) so passwords can be verified
 * regardless of which side originally created the account.
 *
 * Stored format:  iterations:saltHex:hashHex
 * Example:        210000:3a7f…:b9c2…
 */
public final class CryptoUtil {

    private static final int    ITERATIONS = 210_000;
    private static final int    KEY_BITS   = 256;
    private static final String ALGORITHM  = "PBKDF2WithHmacSHA256";

    private CryptoUtil() {}

    // ----------------------------------------------------------------
    // Hash a plain-text password — call on REGISTER
    // ----------------------------------------------------------------
    public static String hashPassword(String password) {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        byte[] hash = pbkdf2(password.toCharArray(), salt, ITERATIONS);
        HexFormat hex = HexFormat.of();
        return ITERATIONS + ":" + hex.formatHex(salt) + ":" + hex.formatHex(hash);
    }

    // ----------------------------------------------------------------
    // Verify a plain-text password against a stored hash — call on LOGIN
    // ----------------------------------------------------------------
    public static boolean verifyPassword(String password, String stored) {
        if (stored == null || stored.isBlank()) return false;
        String[] parts = stored.split(":");
        if (parts.length != 3) return false;

        try {
            int    iterations = Integer.parseInt(parts[0]);
            HexFormat hex     = HexFormat.of();
            byte[] salt       = hex.parseHex(parts[1]);
            byte[] expected   = hex.parseHex(parts[2]);
            byte[] actual     = pbkdf2(password.toCharArray(), salt, iterations);
            return constantTimeEquals(expected, actual);
        } catch (Exception e) {
            return false;
        }
    }

    // ----------------------------------------------------------------
    // Internal — run PBKDF2
    // ----------------------------------------------------------------
    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, KEY_BITS);
            SecretKeyFactory skf = SecretKeyFactory.getInstance(ALGORITHM);
            byte[] hash = skf.generateSecret(spec).getEncoded();
            spec.clearPassword();
            return hash;
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("PBKDF2 hashing failed.", e);
        }
    }

    // Timing-safe comparison to prevent timing attacks
    private static boolean constantTimeEquals(byte[] a, byte[] b) {
        if (a.length != b.length) return false;
        int diff = 0;
        for (int i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
        return diff == 0;
    }
}
