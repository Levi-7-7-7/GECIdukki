package com.smartseating.ui;

import com.smartseating.dao.UserDAO;
import com.smartseating.model.User;
import com.smartseating.util.UI;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class LoginFrame extends JFrame {
    private final JTextField username=new JTextField("admin");
    private final JPasswordField password=new JPasswordField("admin123");
    public LoginFrame(){super("Smart Exam Seating | Login");setDefaultCloseOperation(EXIT_ON_CLOSE);setSize(900,560);setLocationRelativeTo(null);build();}
    private void build(){JPanel root=new JPanel(new GridLayout(1,2));root.setBackground(UI.PALE);JPanel brand=new JPanel(new GridBagLayout());brand.setBackground(UI.NAVY);JLabel icon=new JLabel("▦");icon.setFont(new Font("SansSerif",Font.BOLD,74));icon.setForeground(new Color(95,199,195));JLabel heading=new JLabel("SMART EXAM");heading.setFont(new Font("SansSerif",Font.BOLD,30));heading.setForeground(Color.WHITE);JLabel sub=new JLabel("SEATING ARRANGEMENT SYSTEM");sub.setFont(new Font("SansSerif",Font.BOLD,15));sub.setForeground(new Color(188,211,235));JLabel note=new JLabel("Secure • Automated • Ready to print");note.setForeground(new Color(188,211,235));GridBagConstraints g=new GridBagConstraints();g.gridx=0;g.insets=new Insets(8,8,8,8);brand.add(icon,g);brand.add(heading,g);brand.add(sub,g);brand.add(note,g);root.add(brand);
        JPanel form=new JPanel(new GridBagLayout());form.setBackground(Color.WHITE);JPanel card=new JPanel();card.setLayout(new BoxLayout(card,BoxLayout.Y_AXIS));card.setBackground(Color.WHITE);card.setBorder(new EmptyBorder(35,45,35,45));JLabel welcome=new JLabel("Welcome back");welcome.setFont(new Font("SansSerif",Font.BOLD,26));welcome.setForeground(UI.INK);JLabel hint=new JLabel("Sign in to manage examination seating");hint.setForeground(UI.MUTED);card.add(welcome);card.add(Box.createVerticalStrut(8));card.add(hint);card.add(Box.createVerticalStrut(28));card.add(new JLabel("USERNAME"));card.add(username);card.add(Box.createVerticalStrut(13));card.add(new JLabel("PASSWORD"));card.add(password);card.add(Box.createVerticalStrut(22));JButton login=UI.button("LOGIN",UI.BLUE);JButton exit=UI.button("EXIT",new Color(130,143,160));login.addActionListener(e->login());exit.addActionListener(e->System.exit(0));JPanel buttons=new JPanel(new GridLayout(1,2,10,0));buttons.setBackground(Color.WHITE);buttons.add(login);buttons.add(exit);card.add(buttons);card.add(Box.createVerticalStrut(20));JLabel credentials=new JLabel("Demo: admin/admin123  •  teacher/teacher123");credentials.setFont(new Font("SansSerif",Font.PLAIN,11));credentials.setForeground(UI.MUTED);card.add(credentials);form.add(card);root.add(form);setContentPane(root);getRootPane().setDefaultButton(login);}
    private void login(){try{User u=new UserDAO().authenticate(username.getText().trim(),new String(password.getPassword()));if(u==null){JOptionPane.showMessageDialog(this,"Invalid username, password, or inactive account.","Login failed",JOptionPane.ERROR_MESSAGE);return;}new DashboardFrame(u).setVisible(true);dispose();}catch(Exception ex){JOptionPane.showMessageDialog(this,"Database connection failed. Import database/schema.sql and check DBConnection settings.\n"+ex.getMessage(),"Cannot login",JOptionPane.ERROR_MESSAGE);}}
}
