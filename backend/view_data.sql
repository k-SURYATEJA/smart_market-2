-- ============================================================
-- SmartMarket Oracle Data Viewer
-- Run: sqlplus system/JaiShriRam#88@localhost:1521/XE @view_data.sql
-- ============================================================

SET LINESIZE 220
SET PAGESIZE 50
SET WRAP OFF
SET FEEDBACK ON
SET HEADING ON

-- ============================================================
-- USERS TABLE
-- ============================================================
PROMPT
PROMPT ==================== USERS ====================
PROMPT

COLUMN id           FORMAT A36  HEADING 'USER ID'
COLUMN name         FORMAT A18  HEADING 'NAME'
COLUMN email        FORMAT A32  HEADING 'EMAIL'
COLUMN role         FORMAT A14  HEADING 'ROLE'
COLUMN specialty    FORMAT A28  HEADING 'SPECIALTY'
COLUMN plan         FORMAT A14  HEADING 'PLAN'
COLUMN joined_date  FORMAT A10  HEADING 'JOINED'

SELECT id, name, email, role, specialty, plan, joined_date
FROM users
ORDER BY joined_date;

-- ============================================================
-- RESEARCH NOTES TABLE
-- ============================================================
PROMPT
PROMPT ==================== RESEARCH NOTES ====================
PROMPT

COLUMN id           FORMAT A18  HEADING 'NOTE ID'
COLUMN user_id      FORMAT A36  HEADING 'USER ID'
COLUMN note_date    FORMAT A12  HEADING 'DATE'
COLUMN symbol       FORMAT A10  HEADING 'SYMBOL'
COLUMN category     FORMAT A22  HEADING 'CATEGORY'
COLUMN setup_type   FORMAT A20  HEADING 'SETUP TYPE'
COLUMN timeframe    FORMAT A10  HEADING 'TIMEFRAME'
COLUMN thesis       FORMAT A40  HEADING 'THESIS'

SELECT id, user_id, note_date, symbol, category, setup_type, timeframe, thesis
FROM research_notes
ORDER BY created_at;

-- ============================================================
-- PRICE ALERTS TABLE
-- ============================================================
PROMPT
PROMPT ==================== PRICE ALERTS ====================
PROMPT

COLUMN id           FORMAT A20  HEADING 'ALERT ID'
COLUMN user_id      FORMAT A36  HEADING 'USER ID'
COLUMN symbol       FORMAT A10  HEADING 'SYMBOL'
COLUMN target_price FORMAT 9999999.99  HEADING 'TARGET'
COLUMN condition    FORMAT A10  HEADING 'CONDITION'
COLUMN triggered    FORMAT A8   HEADING 'FIRED?'
COLUMN created_at   FORMAT A30  HEADING 'CREATED AT'

SELECT id, user_id, symbol, target_price, condition, triggered, created_at
FROM price_alerts
ORDER BY created_at;

PROMPT
PROMPT ==================== DONE ====================
PROMPT
