package com.smartseating;

import com.smartseating.ui.LoginFrame;
import com.smartseating.util.UI;
import javax.swing.*;

public final class Main {
    private Main() { }
    public static void main(String[] args) {
        UI.theme();
        SwingUtilities.invokeLater(() -> new LoginFrame().setVisible(true));
    }
}
