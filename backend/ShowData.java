import java.sql.*;

/**
 * SmartMarket Data Viewer
 * Prints all Oracle tables in a clean, readable table format.
 *
 * Compile: javac -cp "C:\Users\durga\.m2\repository\com\oracle\database\jdbc\ojdbc8\21.1.0.0\ojdbc8-21.1.0.0.jar" ShowData.java
 * Run:     java  -cp ".;C:\Users\durga\.m2\repository\com\oracle\database\jdbc\ojdbc8\21.1.0.0\ojdbc8-21.1.0.0.jar" ShowData
 */
public class ShowData {

    static final String URL  = "jdbc:oracle:thin:@localhost:1521:XE";
    static final String USER = "system";
    static final String PASS = "JaiShriRam#88";

    static final String RESET  = "\u001B[0m";
    static final String CYAN   = "\u001B[36m";
    static final String YELLOW = "\u001B[33m";
    static final String GREEN  = "\u001B[32m";
    static final String BOLD   = "\u001B[1m";

    public static void main(String[] args) throws Exception {
        Class.forName("oracle.jdbc.OracleDriver");
        try (Connection con = DriverManager.getConnection(URL, USER, PASS)) {
            System.out.println(BOLD + "\n===== SmartMarket Oracle Database Viewer =====" + RESET);

            // ── USERS ──────────────────────────────────────────────────────────
            printHeader("USERS");
            String usersSQL = "SELECT id, name, email, role, plan, joined_date FROM users ORDER BY joined_date";
            try (Statement st = con.createStatement();
                 ResultSet rs = st.executeQuery(usersSQL)) {

                System.out.printf(CYAN + "%-38s %-18s %-34s %-16s %-14s %-10s%n" + RESET,
                        "USER ID", "NAME", "EMAIL", "ROLE", "PLAN", "JOINED");
                printLine(38, 18, 34, 16, 14, 10);

                while (rs.next()) {
                    System.out.printf("%-38s %-18s %-34s %-16s %-14s %-10s%n",
                            safe(rs.getString("id")),
                            safe(rs.getString("name")),
                            safe(rs.getString("email")),
                            safe(rs.getString("role")),
                            safe(rs.getString("plan")),
                            safe(rs.getString("joined_date")));
                }
            }

            // ── RESEARCH NOTES ─────────────────────────────────────────────────
            printHeader("RESEARCH NOTES");
            String notesSQL = "SELECT id, user_id, note_date, symbol, category, setup_type, timeframe, thesis FROM research_notes ORDER BY created_at";
            try (Statement st = con.createStatement();
                 ResultSet rs = st.executeQuery(notesSQL)) {

                System.out.printf(CYAN + "%-18s %-38s %-12s %-10s %-22s %-20s %-10s %-40s%n" + RESET,
                        "NOTE ID", "USER ID", "DATE", "SYMBOL", "CATEGORY", "SETUP TYPE", "TIMEFRAME", "THESIS");
                printLine(18, 38, 12, 10, 22, 20, 10, 40);

                while (rs.next()) {
                    System.out.printf("%-18s %-38s %-12s %-10s %-22s %-20s %-10s %-40s%n",
                            safe(rs.getString("id")),
                            safe(rs.getString("user_id")),
                            safe(rs.getString("note_date")),
                            safe(rs.getString("symbol")),
                            safe(rs.getString("category")),
                            safe(rs.getString("setup_type")),
                            safe(rs.getString("timeframe")),
                            truncate(rs.getString("thesis"), 40));
                }
            }

            // ── PRICE ALERTS ────────────────────────────────────────────────────
            printHeader("PRICE ALERTS");
            String alertsSQL = "SELECT id, user_id, symbol, target_price, condition, triggered, created_at FROM price_alerts ORDER BY created_at";
            try (Statement st = con.createStatement();
                 ResultSet rs = st.executeQuery(alertsSQL)) {

                System.out.printf(CYAN + "%-22s %-38s %-10s %-12s %-10s %-8s %-26s%n" + RESET,
                        "ALERT ID", "USER ID", "SYMBOL", "TARGET PRICE", "CONDITION", "FIRED?", "CREATED AT");
                printLine(22, 38, 10, 12, 10, 8, 26);

                int count = 0;
                while (rs.next()) {
                    count++;
                    System.out.printf("%-22s %-38s %-10s %-12s %-10s %-8s %-26s%n",
                            safe(rs.getString("id")),
                            safe(rs.getString("user_id")),
                            safe(rs.getString("symbol")),
                            safe(rs.getString("target_price")),
                            safe(rs.getString("condition")),
                            safe(rs.getString("triggered")),
                            safe(rs.getString("created_at")));
                }
                if (count == 0) {
                    System.out.println(YELLOW + "  (no alerts yet)" + RESET);
                }
            }

            System.out.println(GREEN + BOLD + "\n===== Done =====" + RESET + "\n");
        }
    }

    static void printHeader(String title) {
        System.out.println(BOLD + YELLOW + "\n==== " + title + " ====" + RESET);
    }

    static void printLine(int... widths) {
        StringBuilder sb = new StringBuilder();
        for (int w : widths) {
            sb.append("-".repeat(w)).append(" ");
        }
        System.out.println(sb);
    }

    static String safe(String val) {
        return val == null ? "(null)" : val;
    }

    static String truncate(String val, int max) {
        if (val == null) return "(null)";
        return val.length() > max ? val.substring(0, max - 3) + "..." : val;
    }
}
