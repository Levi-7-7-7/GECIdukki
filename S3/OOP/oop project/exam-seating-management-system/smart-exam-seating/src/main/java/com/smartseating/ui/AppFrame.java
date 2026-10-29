package com.smartseating.ui;

import com.smartseating.model.User;
import com.smartseating.util.UI;
import com.smartseating.util.Validation;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public abstract class AppFrame extends JFrame {
    protected final User currentUser;
    protected final JPanel content = new JPanel(new BorderLayout(14,14));
    protected AppFrame(String title,User user){super(title);currentUser=user;setDefaultCloseOperation(DISPOSE_ON_CLOSE);content.setBorder(new EmptyBorder(18,22,18,22));content.setBackground(UI.PALE);setContentPane(content);}
    protected JPanel white(Component component){JPanel p=new JPanel(new BorderLayout());p.setBackground(Color.WHITE);p.setBorder(new EmptyBorder(16,16,16,16));p.add(component);return p;}
    protected JButton button(String text,Color color){return UI.button(text,color);}
    protected void error(Exception ex){Validation.showError(this,ex);}
    protected boolean confirm(String text){return Validation.confirm(this,text);}
    protected void open(JFrame frame){frame.setVisible(true);}
    protected JLabel title(String text){return UI.heading(text);}
}
