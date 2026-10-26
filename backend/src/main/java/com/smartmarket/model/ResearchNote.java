package com.smartmarket.model;

/**
 * Maps to the RESEARCH_NOTES table in Oracle.
 * Matches the ResearchNote interface in TradingJournalView.tsx.
 */
public class ResearchNote {

    private String id;
    private String userId;
    private String date;
    private String symbol;
    private String category;       // Technical Pattern | Fundamental Catalyst | Macro Policy | Earnings Breakdown
    private String setupType;
    private String keyLevel;
    private String targetOutlook;
    private String timeframe;      // Intraday | Swing | Multi-Month
    private String thesis;

    public ResearchNote() {}

    // --- Getters & Setters ---

    public String getId()            { return id; }
    public void   setId(String id)   { this.id = id; }

    public String getUserId()              { return userId; }
    public void   setUserId(String userId) { this.userId = userId; }

    public String getDate()              { return date; }
    public void   setDate(String date)   { this.date = date; }

    public String getSymbol()                { return symbol; }
    public void   setSymbol(String symbol)   { this.symbol = symbol; }

    public String getCategory()                  { return category; }
    public void   setCategory(String category)   { this.category = category; }

    public String getSetupType()                   { return setupType; }
    public void   setSetupType(String setupType)   { this.setupType = setupType; }

    public String getKeyLevel()                  { return keyLevel; }
    public void   setKeyLevel(String keyLevel)   { this.keyLevel = keyLevel; }

    public String getTargetOutlook()                     { return targetOutlook; }
    public void   setTargetOutlook(String targetOutlook) { this.targetOutlook = targetOutlook; }

    public String getTimeframe()                   { return timeframe; }
    public void   setTimeframe(String timeframe)   { this.timeframe = timeframe; }

    public String getThesis()                { return thesis; }
    public void   setThesis(String thesis)   { this.thesis = thesis; }
}
