package com.smartseating.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/** Minimal PDF writer: monospaced text on A4 pages, no external library needed. */
public final class PdfExporter {
    private static final int LINES_PER_PAGE = 60;
    private static final int MAX_CHARS = 90;

    private PdfExporter() { }

    /** Writes the title and body as a multi-page PDF file. */
    public static void write(Path file, String title, String body) throws IOException {
        List<String> lines = new ArrayList<>();
        lines.add(title);
        lines.add("");
        for (String raw : body.replace("\r", "").replace("\t", "    ").split("\n", -1)) {
            wrap(raw, lines);
        }
        int pages = Math.max(1, (lines.size() + LINES_PER_PAGE - 1) / LINES_PER_PAGE);
        int total = 3 + pages * 2;
        int[] offset = new int[total + 1];
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        put(out, "%PDF-1.4\n");
        offset[1] = out.size();
        put(out, "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
        StringBuilder kids = new StringBuilder();
        for (int i = 0; i < pages; i++) {
            kids.append(4 + 2 * i).append(" 0 R ");
        }
        offset[2] = out.size();
        put(out, "2 0 obj\n<< /Type /Pages /Kids [ " + kids + "] /Count " + pages + " >>\nendobj\n");
        offset[3] = out.size();
        put(out, "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n");
        for (int i = 0; i < pages; i++) {
            StringBuilder content = new StringBuilder("BT /F1 9 Tf 50 800 Td 12 TL\n");
            int end = Math.min(lines.size(), (i + 1) * LINES_PER_PAGE);
            for (int j = i * LINES_PER_PAGE; j < end; j++) {
                content.append('(').append(escape(lines.get(j))).append(") Tj T*\n");
            }
            content.append("ET");
            byte[] data = content.toString().getBytes(StandardCharsets.ISO_8859_1);
            int pageObj = 4 + 2 * i;
            int contentObj = 5 + 2 * i;
            offset[pageObj] = out.size();
            put(out, pageObj + " 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
                    + "/Resources << /Font << /F1 3 0 R >> >> /Contents " + contentObj + " 0 R >>\nendobj\n");
            offset[contentObj] = out.size();
            put(out, contentObj + " 0 obj\n<< /Length " + data.length + " >>\nstream\n");
            out.writeBytes(data);
            put(out, "\nendstream\nendobj\n");
        }
        int xref = out.size();
        put(out, "xref\n0 " + (total + 1) + "\n0000000000 65535 f \n");
        for (int n = 1; n <= total; n++) {
            put(out, String.format("%010d 00000 n \n", offset[n]));
        }
        put(out, "trailer\n<< /Size " + (total + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
        Files.write(file, out.toByteArray());
    }

    private static void wrap(String text, List<String> lines) {
        if (text.length() <= MAX_CHARS) {
            lines.add(text);
            return;
        }
        for (int i = 0; i < text.length(); i += MAX_CHARS) {
            lines.add(text.substring(i, Math.min(text.length(), i + MAX_CHARS)));
        }
    }

    private static String escape(String text) {
        StringBuilder sb = new StringBuilder();
        for (char c : text.toCharArray()) {
            if (c == '\\' || c == '(' || c == ')') {
                sb.append('\\').append(c);
            } else if (c < 32 || c > 126) {
                sb.append('?');
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private static void put(ByteArrayOutputStream out, String text) {
        out.writeBytes(text.getBytes(StandardCharsets.ISO_8859_1));
    }
}
