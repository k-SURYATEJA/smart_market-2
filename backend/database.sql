-- ============================================================
-- SMART MARKET BACKEND — Oracle Database Schema
-- Run this script in Oracle SQL Developer or SQL*Plus
-- ============================================================

-- Drop tables if re-running (order matters for FK constraints)
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE price_alerts CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE research_notes CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE users CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/


-- ============================================================
-- USERS TABLE  (replaces localStorage auth)
-- ============================================================
CREATE TABLE users (
    id            VARCHAR2(60)   PRIMARY KEY,
    name          VARCHAR2(100)  NOT NULL,
    email         VARCHAR2(150)  UNIQUE NOT NULL,
    password_hash VARCHAR2(400)  NOT NULL,
    role          VARCHAR2(60)   DEFAULT 'Market Analyst',
    specialty     VARCHAR2(100)  DEFAULT 'Equities & Swing Technicals',
    plan          VARCHAR2(60)   DEFAULT 'PRO TERMINAL',
    joined_date   VARCHAR2(20),
    avatar_url    VARCHAR2(400)
);


-- ============================================================
-- RESEARCH NOTES TABLE  (Trading Journal view)
-- ============================================================
CREATE TABLE research_notes (
    id             VARCHAR2(60)   PRIMARY KEY,
    user_id        VARCHAR2(60)   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_date      VARCHAR2(20)   NOT NULL,
    symbol         VARCHAR2(20)   NOT NULL,
    category       VARCHAR2(60)   NOT NULL,
    setup_type     VARCHAR2(120)  NOT NULL,
    key_level      VARCHAR2(80)   NOT NULL,
    target_outlook VARCHAR2(80)   NOT NULL,
    timeframe      VARCHAR2(30)   NOT NULL,
    thesis         CLOB           NOT NULL,
    created_at     TIMESTAMP      DEFAULT SYSTIMESTAMP
);


-- ============================================================
-- PRICE ALERTS TABLE
-- ============================================================
CREATE TABLE price_alerts (
    id           VARCHAR2(60)   PRIMARY KEY,
    user_id      VARCHAR2(60)   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol       VARCHAR2(20)   NOT NULL,
    target_price NUMBER(14, 4)  NOT NULL,
    condition    VARCHAR2(10)   NOT NULL,   -- 'ABOVE' | 'BELOW'
    created_at   VARCHAR2(40)   NOT NULL,
    triggered    NUMBER(1)      DEFAULT 0
);


-- ============================================================
-- VERIFY
-- ============================================================
SELECT table_name FROM user_tables
WHERE table_name IN ('USERS', 'RESEARCH_NOTES', 'PRICE_ALERTS')
ORDER BY table_name;

COMMIT;
