package com.smartseating.util;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.JTableHeader;
import java.awt.*;

public final class UI {
    public static final Color NAVY = new Color(15, 35, 67);
    public static final Color BLUE = new Color(36, 99, 180);
    public static final Color TEAL = new Color(18, 137, 132);
    public static final Color ORANGE = new Color(236, 145, 45);
    public static final Color INK = new Color(30, 42, 58);
    public static final Color MUTED = new Color(98, 113, 133);
    public static final Color PALE = new Color(244, 247, 251);
    private UI() { }
    public static void theme() {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) { }
        UIManager.put("Button.arc", 10);
        UIManager.put("Component.focusWidth", 1);
        UIManager.put("Table.showGrid", true);
        UIManager.put("Table.gridColor", new Color(224, 230, 238));
    }
    public static JLabel heading(String text) {
        JLabel label = new JLabel(text);
        label.setFont(new Font("SansSerif", Font.BOLD, 24)); label.setForeground(INK);
        label.setBorder(new EmptyBorder(0, 0, 12, 0)); return label;
    }
    public static JButton button(String text, Color color) {
        JButton button = new JButton(text); button.setBackground(color); button.setForeground(Color.WHITE);
        button.setFont(new Font("SansSerif", Font.BOLD, 12)); button.setFocusPainted(false);
        button.setBorder(new EmptyBorder(10, 15, 10, 15)); return button;
    }
    public static JPanel formPanel() { JPanel p = new JPanel(new GridBagLayout()); p.setBorder(new EmptyBorder(8,8,8,8)); p.setBackground(Color.WHITE); return p; }
    public static void addField(JPanel panel, int row, String label, JComponent field) {
        GridBagConstraints left = new GridBagConstraints(); left.gridx=0; left.gridy=row; left.anchor=GridBagConstraints.WEST; left.insets=new Insets(6,6,6,14);
        panel.add(new JLabel(label), left);
        GridBagConstraints right = new GridBagConstraints(); right.gridx=1; right.gridy=row; right.weightx=1; right.fill=GridBagConstraints.HORIZONTAL; right.insets=new Insets(6,6,6,6);
        panel.add(field, right);
    }
    public static void tableStyle(JTable table) {
        table.setRowHeight(28); table.setFont(new Font("SansSerif", Font.PLAIN, 12)); table.setSelectionBackground(new Color(213, 229, 250)); table.setSelectionForeground(INK);
        JTableHeader header = table.getTableHeader(); header.setBackground(NAVY); header.setForeground(Color.WHITE); header.setFont(new Font("SansSerif", Font.BOLD, 12));
    }
    public static JScrollPane scroll(Component component) { JScrollPane scroll = new JScrollPane(component); scroll.setBorder(BorderFactory.createLineBorder(new Color(224,230,238))); return scroll; }
    public static void frame(JFrame frame, int width, int height) { frame.setSize(width,height); frame.setLocationRelativeTo(null); frame.setMinimumSize(new Dimension(760,520)); }
}
