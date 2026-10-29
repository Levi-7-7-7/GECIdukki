package com.smartseating.util;

import com.smartseating.model.Exam;
import java.time.format.DateTimeFormatter;

public final class DateUtil {
    public static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    public static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");
    private DateUtil() { }
    public static String examDate(Exam exam) { return exam.getDate() == null ? "" : exam.getDate().format(DATE); }
    public static String examTime(Exam exam) { return exam.getStartTime() == null ? "" : exam.getStartTime().format(TIME); }
}
