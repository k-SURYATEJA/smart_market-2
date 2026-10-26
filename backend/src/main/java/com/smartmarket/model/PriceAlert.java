package com.smartmarket.model;

/**
 * Maps to the PRICE_ALERTS table in Oracle.
 * Matches the PriceAlert type in src/types/market.ts.
 */
public class PriceAlert {

    private String  id;
    private String  userId;
    private String  symbol;
    private double  targetPrice;
    private String  condition;    // 'ABOVE' | 'BELOW'
    private String  createdAt;
    private boolean triggered;

    public PriceAlert() {}

    // --- Getters & Setters ---

    public String getId()            { return id; }
    public void   setId(String id)   { this.id = id; }

    public String getUserId()              { return userId; }
    public void   setUserId(String userId) { this.userId = userId; }

    public String getSymbol()                { return symbol; }
    public void   setSymbol(String symbol)   { this.symbol = symbol; }

    public double getTargetPrice()                   { return targetPrice; }
    public void   setTargetPrice(double targetPrice) { this.targetPrice = targetPrice; }

    public String getCondition()                   { return condition; }
    public void   setCondition(String condition)   { this.condition = condition; }

    public String getCreatedAt()                   { return createdAt; }
    public void   setCreatedAt(String createdAt)   { this.createdAt = createdAt; }

    public boolean isTriggered()                   { return triggered; }
    public void    setTriggered(boolean triggered) { this.triggered = triggered; }
}
