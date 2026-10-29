package com.smartseating.util;

import javax.swing.JOptionPane;
import java.awt.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public final class Validation {
    private Validation() { }
    public static String text(String value, String label) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(label + " is required.");
        return value.trim();
    }
    public static int positive(String value, String label) {
        try { int number = Integer.parseInt(value.trim()); if (number <= 0) throw new NumberFormatException(); return number; }
        catch (NumberFormatException ex) { throw new IllegalArgumentException(label + " must be a positive whole number."); }
    }
    public static LocalDate date(String value) {
        try { return LocalDate.parse(text(value, "Exam date"), DateTimeFormatter.ISO_LOCAL_DATE); }
        catch (DateTimeParseException ex) { throw new IllegalArgumentException("Exam date must use yyyy-MM-dd."); }
    }
    public static LocalTime time(String value) {
        try { return LocalTime.parse(text(value, "Start time"), DateTimeFormatter.ofPattern("HH:mm")); }
        catch (DateTimeParseException ex) { throw new IllegalArgumentException("Start time must use HH:mm, for example 10:00."); }
    }
    public static void showError(Component parent, Exception ex) {
        JOptionPane.showMessageDialog(parent, ex.getMessage(), "Validation / Database Error", JOptionPane.ERROR_MESSAGE);
    }
    public static boolean confirm(Component parent, String message) {
        return JOptionPane.showConfirmDialog(parent, message, "Confirm action", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE) == JOptionPane.YES_OPTION;
    }
}
