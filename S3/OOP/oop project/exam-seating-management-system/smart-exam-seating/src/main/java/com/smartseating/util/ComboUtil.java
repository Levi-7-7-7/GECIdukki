package com.smartseating.util;

import javax.swing.*;
import java.awt.*;
import java.util.Collection;
import java.util.function.Function;

public final class ComboUtil {
    private ComboUtil() { }
    public static <T> void fill(JComboBox<T> combo, Collection<T> values) { combo.removeAllItems(); values.forEach(combo::addItem); }
    public static <T> String selectedValues(JList<T> list, Function<T,String> mapper) {
        StringBuilder text = new StringBuilder();
        for (T value : list.getSelectedValuesList()) { if (text.length() > 0) text.append(", "); text.append(mapper.apply(value)); }
        return text.toString();
    }
    public static void select(JList<?> list, int[] indices) { list.setSelectedIndices(indices); }
}
