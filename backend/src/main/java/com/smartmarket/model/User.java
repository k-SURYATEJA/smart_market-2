package com.smartmarket.model;

/**
 * Maps to the USERS table in Oracle.
 * Matches the UserProfile type in src/types/market.ts on the frontend.
 */
public class User {

    private String id;
    private String name;
    private String email;
    private String passwordHash;   // never sent to frontend
    private String role;
    private String specialty;
    private String plan;
    private String joinedDate;
    private String avatarUrl;

    public User() {}

    public User(String id, String name, String email,
                String passwordHash, String role, String specialty,
                String plan, String joinedDate, String avatarUrl) {
        this.id           = id;
        this.name         = name;
        this.email        = email;
        this.passwordHash = passwordHash;
        this.role         = role;
        this.specialty    = specialty;
        this.plan         = plan;
        this.joinedDate   = joinedDate;
        this.avatarUrl    = avatarUrl;
    }

    // --- Getters & Setters ---

    public String getId()            { return id; }
    public void   setId(String id)   { this.id = id; }

    public String getName()              { return name; }
    public void   setName(String name)   { this.name = name; }

    public String getEmail()               { return email; }
    public void   setEmail(String email)   { this.email = email; }

    public String getPasswordHash()                    { return passwordHash; }
    public void   setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole()              { return role; }
    public void   setRole(String role)   { this.role = role; }

    public String getSpecialty()                 { return specialty; }
    public void   setSpecialty(String specialty) { this.specialty = specialty; }

    public String getPlan()              { return plan; }
    public void   setPlan(String plan)   { this.plan = plan; }

    public String getJoinedDate()                  { return joinedDate; }
    public void   setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }

    public String getAvatarUrl()                 { return avatarUrl; }
    public void   setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
